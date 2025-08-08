"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from "@/hooks";
import useEnterSubmit from "@/hooks/use-enter-submit";
import { useHeight } from "@/hooks/use-height";
import { useInput } from "@/hooks/use-input";
import { cn } from "@/utils";
import { CoreMessage } from "ai";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import React, { useEffect, useRef } from 'react';
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface Props {
    messages?: CoreMessage[];
    isLoading: boolean;
    handleSendMessage: (e: React.FormEvent) => Promise<void>;
}

const ChatInput = ({ messages, isLoading, handleSendMessage }: Props) => {

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { isOpen: isOpenSidebar } = useSidebar();

    const { formRef, onKeyDown } = useEnterSubmit();

    const { input, setInput } = useInput();

    const { setHeight } = useHeight();

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
                                "flex justify-end w-full gap-x-1.5 md:gap-x-2 rounded-xl p-1 transition-colors bg-[#f4f4f4 bg-background border border-border/60 dark:bg-[#262626] overflow-y-auto",
                                textareaRef.current && textareaRef.current.clientHeight > 48 && input.trim().length ? "items-end" : "items-center",
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
                            <div
                                className={cn(
                                    "w-10 h-full flex justify-end z-20 mt-auto p-1",
                                    textareaRef.current && textareaRef.current.clientHeight > 48 ? "items-end" : "items-center",
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
                                        <TooltipContent>
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
