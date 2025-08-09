"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from "@/hooks";
import useEnterSubmit from "@/hooks/use-enter-submit";
import { useHeight } from "@/hooks/use-height";
import { useInput } from "@/hooks/use-input";
import { cn } from "@/utils";
import { ArrowUpIcon, CheckIcon, Loader2Icon, XIcon } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import Icons from './global/icons';
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface Props {
    isLoading: boolean;
    handleSendMessage: (e: React.FormEvent) => Promise<void>;
}

const ChatInput = ({ isLoading, handleSendMessage }: Props) => {

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const { isOpen: isOpenSidebar } = useSidebar();

    const { formRef, onKeyDown } = useEnterSubmit();

    const { input, setInput } = useInput();

    const { setHeight } = useHeight();

    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [micSupported, setMicSupported] = useState(false);

    useEffect(() => {
        setMicSupported(!!navigator.mediaDevices?.getUserMedia);
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            setRecordingTime(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const transcribeAudio = async (audioBlob: Blob) => {
        try {
            setIsTranscribing(true);

            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.webm');

            const response = await fetch('/api/transcribe', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                toast.error("Transcription failed");
                return;
            }

            const data = await response.json();
            const transcript = data.text.trim();

            if (transcript && !transcript.includes('[No speech detected]')) {
                setInput(transcript);
                toast.success("Voice transcribed successfully!");
            } else {
                toast('No speech detected in recording');
            }
        } catch (error) {
            console.error('Transcription error:', error);
            toast.error("Transcription failed");
        } finally {
            setIsTranscribing(false);
        }
    };

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                }
            });

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            audioChunksRef.current = [];
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                console.log('Data available, size:', event.data.size);
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.start(1000);
            setIsRecording(true);
            setRecordingTime(0);

            console.log('Recording started');
        } catch (error) {
            console.error('Error starting recording:', error);
            toast.error('Could not access microphone. Please check permissions.');
        }
    }, []);

    const stopRecording = useCallback((abort: boolean = false) => {
        if (!mediaRecorderRef.current || !isRecording) {
            return;
        }

        const mediaRecorder = mediaRecorderRef.current;

        if (abort) {
            try {
                mediaRecorder.stop();
            } catch (e) {
                console.log('MediaRecorder already stopped');
            }

            if (mediaRecorder.stream) {
                mediaRecorder.stream.getTracks().forEach(track => track.stop());
            }

            audioChunksRef.current = [];
            mediaRecorderRef.current = null;
            setIsRecording(false);
            toast('Recording aborted');
            return;
        }

        mediaRecorder.onstop = async () => {
            console.log('MediaRecorder stopped, chunks:', audioChunksRef.current.length);

            if (mediaRecorder.stream) {
                mediaRecorder.stream.getTracks().forEach(track => track.stop());
            }

            if (audioChunksRef.current.length > 0) {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                console.log('Audio blob size:', audioBlob.size);

                if (audioBlob.size > 0) {
                    await transcribeAudio(audioBlob);
                } else {
                    toast('No audio data recorded');
                }
            } else {
                toast('No audio data to transcribe');
            }

            audioChunksRef.current = [];
            mediaRecorderRef.current = null;
        };

        setIsRecording(false);
        try {
            mediaRecorder.stop();
        } catch (e) {
            console.log('MediaRecorder already stopped');
            audioChunksRef.current = [];
            mediaRecorderRef.current = null;
        }
    }, [isRecording, transcribeAudio]);

    const abortRecording = useCallback(() => {
        stopRecording(true);
    }, [stopRecording]);

    const completeRecording = useCallback(() => {
        stopRecording(false);
    }, [stopRecording]);

    const toggleRecording = useCallback(() => {
        if (isRecording) {
            completeRecording();
        } else {
            startRecording();
        }
    }, [isRecording, startRecording, completeRecording]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
            setHeight(textareaRef.current.scrollHeight);
        }
    }, [input]);

    return (
        <div
            className={cn(
                "fixed bottom-0 inset-x-0 mx-auto transition-all duration-300 bg-background z-50 peer-[[data-state=open]]:group-[]:lg:pl-64",
                isOpenSidebar ? "lg:pl-64" : "lg:pl-0"
            )}
        >
            <div className="px-3 text-base pb-4 md:px-5 lg:px-1 xl:px-5">
                <div className="flex flex-1 gap-4 mx-auto text-base md:gap-5 lg:gap-6 md:max-w-3xl">
                    <form
                        ref={formRef}
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (input.trim().length > 0) {
                                handleSendMessage(e);
                            }
                        }}
                        className="relative w-full"
                    >
                        <div
                            className={cn(
                                "flex justify-end w-full gap-x-1.5 rounded-xl p-1 transition-colors bg-background border border-border/60 dark:bg-[#262626] overflow-y-auto",
                                textareaRef?.current && textareaRef?.current?.clientHeight > 48 && (input || "")?.trim().length ? "items-end" : "items-center",
                            )}
                        >
                            <div className="relative flex flex-col justify-center flex-1 min-w-0">
                                <Textarea
                                    rows={1}
                                    tabIndex={0}
                                    value={input}
                                    autoFocus={true}
                                    ref={textareaRef}
                                    disabled={isLoading}
                                    onKeyDown={onKeyDown}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className={cn(
                                        "h-auto pl-4 overflow-y-auto bg-transparent border-0 resize-none text-left focus:outline-none max-h-52 w-full",
                                    )}
                                />
                            </div>

                            {micSupported && (
                                <div
                                    className={cn(
                                        "h-full flex items-center justify-center gap-x-2 z-20 mt-auto p-1 overflow-hidden",
                                        textareaRef?.current && textareaRef?.current?.clientHeight > 48 ? "items-end" : "items-center",
                                    )}
                                >
                                    {(isRecording || isTranscribing) && (
                                        <div className={cn(
                                            "flex items-center gap-2 px-3 py-1 h-8 rounded-md text-xs relative font-medium transition-all",
                                            isRecording ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                                        )}>
                                            {isRecording ? (
                                                <>
                                                    <div className="relative flex items-center justify-center">
                                                        <div className="size-1.5 bg-red-500/80 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                                        <div className="size-2 bg-red-500 rounded-full animate-ping" />
                                                    </div>
                                                    REC {formatTime(recordingTime)}
                                                </>
                                            ) : (
                                                <>
                                                    <Loader2Icon className="size-3 animate-spin" />
                                                    Transcribing...
                                                </>
                                            )}
                                        </div>
                                    )}
                                    <TooltipProvider delayDuration={0}>
                                        {isRecording ? (
                                            <>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            type="button"
                                                            variant="ghost"
                                                            onClick={() => stopRecording(true)}
                                                            disabled={isLoading || isTranscribing}
                                                            className="relative bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:!text-red-500"
                                                        >
                                                            <XIcon className="size-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" sideOffset={10}>
                                                        Abort recording
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            type="button"
                                                            variant="ghost"
                                                            onClick={() => stopRecording(false)}
                                                            disabled={isLoading || isTranscribing}
                                                            className="relative bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:!text-green-500"
                                                        >
                                                            <CheckIcon className="size-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" sideOffset={10}>
                                                        Complete recording
                                                    </TooltipContent>
                                                </Tooltip>
                                            </>
                                        ) : (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="icon"
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={toggleRecording}
                                                        disabled={isLoading || isTranscribing}
                                                        className="relative transition-all duration-200"
                                                    >
                                                        <Icons.mic className="size-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top" sideOffset={10}>
                                                    Start voice input
                                                    {/* {isRecording ? (
                                                        <div className="flex items-center gap-1">
                                                            <div className="size-2 bg-red-500 rounded-full animate-pulse" />
                                                            Recording {formatTime(recordingTime)} - Click to stop
                                                        </div>
                                                    ) : isTranscribing ? (
                                                        "Processing audio..."
                                                    ) : (
                                                        ""
                                                    )} */}
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </TooltipProvider>
                                </div>
                            )}

                            <div
                                className={cn(
                                    "w-10 h-full flex justify-end z-20 mt-auto p-1",
                                    textareaRef?.current && textareaRef?.current.clientHeight > 48 ? "items-end" : "items-center",
                                )}
                            >
                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="icon"
                                                type="submit"
                                                disabled={isLoading || !input.trim()}
                                            >
                                                {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : <ArrowUpIcon className="size-4" />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" sideOffset={10}>
                                            Send message (Enter)
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChatInput
