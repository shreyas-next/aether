// "use client";

// import { Message } from "@/actions";
// import { addMessageToChat, createNewChat } from "@/actions/chat";
// import { useInput } from "@/hooks";
// import React, { useState } from 'react';
// import { toast } from "sonner";
// import ChatWrapper from "./chat-wrapper";
// import { User } from "@supabase/supabase-js";
// import { useRouter } from "next/navigation";
// import { v4 as uuidv4 } from "uuid";
// import { readStreamableValue, StreamableValue } from "@ai-sdk/rsc";
// import { AsyncIterableStream, DefaultChatTransport } from "ai";
// import { useChat } from '@ai-sdk/react';

// interface Props {
//     user: User;
//     chatId?: string;
//     messages: Message[] | [];
// }

// const ChatContainer = ({ user, chatId, messages }: Props) => {

//     const router = useRouter();

//     const { input, setInput } = useInput();

//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
//     const [oMessages, setOMessages] = useState<Message[]>([]);
//     const [streamingMessage, setStreamingMessage] = useState<string>('');
//     const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(null);

//     const handleSendMessage = async (message: string) => {
//         setIsLoading(true);

//         if (!message.trim()) return;

//         const tempMessageId = `temp-${Date.now()}`;
//         const tempUserMessageId = uuidv4();
//         const tempAiMessageId = uuidv4();

//         const userMessage: Message = {
//             id: tempUserMessageId,
//             chat_id: chatId || "",
//             content: String(message),
//             role: "user",
//             created_at: new Date().toISOString(),
//         };

//         const placeholderAiMessage: Message = {
//             id: tempAiMessageId,
//             chat_id: chatId || "",
//             content: '',
//             role: 'assistant',
//             created_at: new Date().toISOString()
//         };

//         setOMessages((prev) => [...prev, userMessage, placeholderAiMessage]);
//         setCurrentStreamingId(tempAiMessageId);

//         try {
//             if (chatId) {
//                 // NOTE: Working
//                 setIsAiLoading(true);
//                 const { aiMessage } = await addMessageToChat(chatId, message, 'user');

//                 if (!aiMessage) {
//                     toast.error("Failed to generate AI response");
//                     return;
//                 }

//                 router.refresh();
//             } else {
//                 // NOTE: Working
//                 setIsAiLoading(true);
//                 const { chatId: newChatId, aiMessage } = await createNewChat(message);

//                 const aiMessageObj: Message = {
//                     id: `temp-ai-${Date.now()}`,
//                     chat_id: newChatId,
//                     content: String(aiMessage),
//                     role: 'assistant',
//                     created_at: new Date().toISOString()
//                 };

//                 setOMessages(prev => [...prev, aiMessageObj]);
//                 router.push(`/c/${newChatId}`);
//             }

//             // NOTE: This is working
//             // if(chatId) {
//             //     await addMessageToChat(chatId, message, 'user');
//             // } else {
//             //     const newChatId = await createNewChat(message);
//             //     router.push(`/c/${newChatId}`)
//             // }
//         } catch (error) {
//             console.log("Error creating chat", error);
//             toast.error("Error creating chat. Please try again");
//             setOMessages(prev =>
//                 prev.filter(msg => msg.id !== tempMessageId && msg.id !== currentStreamingId)
//             );
//         } finally {
//             setIsLoading(false);
//             setIsAiLoading(false);
//             setCurrentStreamingId(null);
//             setTimeout(() => {
//                 setOMessages([]);
//                 setStreamingMessage("");
//             }, 1000);
//         }
//     };

//     const displayMessages = React.useMemo(() => {
//         const allMessages = [...messages, ...oMessages];

//         if (currentStreamingId && streamingMessage) {
//             return allMessages.map(msg =>
//                 msg.id === currentStreamingId
//                     ? { ...msg, content: streamingMessage }
//                     : msg
//             );
//         }

//         return allMessages;
//     }, [messages, oMessages, currentStreamingId, streamingMessage]);

//     return (
//         <ChatWrapper
//             user={user}
//             messages={displayMessages}
//             isLoading={isLoading}
//             oMessages={oMessages}
//             isAiLoading={isAiLoading}
//             onSubmit={handleSendMessage}
//         />
//     )
// };

// export default ChatContainer
"use client";

import { Message } from "@/actions";
import { addMessageToChat, createNewChat } from "@/actions/chat";
import { useInput } from "@/hooks";
import React, { useState } from 'react';
import { toast } from "sonner";
import ChatWrapper from "./chat-wrapper";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

interface Props {
    user: User;
    chatId?: string;
    messages: Message[] | [];
}

const ChatContainer = ({ user, chatId, messages }: Props) => {

    const router = useRouter();

    const { input, setInput } = useInput();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
    const [oMessages, setOMessages] = useState<Message[]>([]);

    const handleSendMessage = async (message: string) => {
        setIsLoading(true);

        if (!message.trim()) return;

        const tempMessageId = `temp-${Date.now()}`;
        const userMessage: Message = {
            id: tempMessageId,
            chat_id: chatId || "",
            content: String(message),
            role: "user",
            created_at: new Date().toISOString(),
        };

        setOMessages((prev) => [...prev, userMessage]);

        try {
            if (chatId) {
                setIsAiLoading(true);
                const { aiMessage } = await addMessageToChat(chatId, message, 'user');

                if (!aiMessage) {
                    toast.error("Failed to generate AI response");
                    return;
                }

                router.refresh();
            } else {
                setIsAiLoading(true);
                const { chatId: newChatId, aiMessage } = await createNewChat(message);

                const aiMessageObj: Message = {
                    id: `temp-ai-${Date.now()}`,
                    chat_id: newChatId,
                    content: String(aiMessage),
                    role: 'assistant',
                    created_at: new Date().toISOString()
                };

                setOMessages(prev => [...prev, aiMessageObj]);
                router.push(`/c/${newChatId}`);
            }

            // NOTE: This is working
            // if(chatId) {
            //     await addMessageToChat(chatId, message, 'user');
            // } else {
            //     const newChatId = await createNewChat(message);
            //     router.push(`/c/${newChatId}`)
            // }
        } catch (error) {
            console.log("Error creating chat", error);
            toast.error("Error creating chat. Please try again");
            setOMessages(prev =>
                prev.filter(msg => msg.id !== tempMessageId)
            );
        } finally {
            setIsLoading(false);
            setIsAiLoading(false);
            setTimeout(() => {
                setOMessages([]);
            }, 1000);
        }
    };

    return (
        <ChatWrapper
            user={user}
            messages={messages}
            isLoading={isLoading}
            oMessages={oMessages}
            isAiLoading={isAiLoading}
            onSubmit={handleSendMessage}
        />
    )
};

export default ChatContainer
