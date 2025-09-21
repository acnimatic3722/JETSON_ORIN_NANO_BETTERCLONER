
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import type { ChatMessage } from '../types';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);


const SYSTEM_INSTRUCTION = "You are a friendly and expert AI assistant specializing in NVIDIA Jetson devices and Linux. Your primary goal is to help users safely clone their Jetson OS from an SD card to an SSD. Be cautious with commands, explain risks clearly, and always double-check the user's understanding, especially regarding `dd` and drive identifiers like /dev/mmcblk0 or /dev/sda.";

export const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const isInitialMount = useRef(true);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = useCallback(async (messageText: string) => {
        if (!chatRef.current) {
            setError("Chat is not initialized.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await chatRef.current.sendMessage({ message: messageText });
            setMessages(prev => [...prev, { role: 'model', text: response.text }]);
        } catch (e) {
            console.error(e);
            const errorMessage = "Sorry, I encountered an error. Please check your connection or API key and try again.";
            setError(errorMessage);
            setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    useEffect(() => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            chatRef.current = ai.chats.create({
              model: 'gemini-2.5-flash',
              config: {
                systemInstruction: SYSTEM_INSTRUCTION,
              },
            });
            setError(null);
            
            // Pre-load the user's question from the prompt
            const initialQuestion = "/dev/mmcblk0 my sd right?";
            setMessages([{ role: 'user', text: initialQuestion }]);

        } catch (e) {
            console.error(e);
            setError("Failed to initialize AI Assistant. API Key might be missing.");
        }
    }, []);

    useEffect(() => {
        if (isInitialMount.current && messages.length === 1 && messages[0].role === 'user' && chatRef.current) {
            isInitialMount.current = false;
            sendMessage(messages[0].text);
        }
    }, [messages, sendMessage]);
    
    useEffect(scrollToBottom, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        const userMessage: ChatMessage = { role: 'user', text: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        sendMessage(input.trim());
        setInput('');
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 bg-jetson-green text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-jetson-green transition-transform transform hover:scale-110 animate-pulse"
                aria-label="Toggle AI Assistant"
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-md h-[70vh] max-h-[600px] z-50 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out transform-gpu origin-bottom-right">
                    <header className="bg-terminal-header p-4 flex justify-between items-center rounded-t-2xl border-b border-gray-700">
                        <h2 className="text-lg font-bold text-white">Jetson AI Assistant</h2>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white" aria-label="Close chat">
                            <CloseIcon />
                        </button>
                    </header>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-xl ${msg.role === 'user' ? 'bg-jetson-green text-jetson-gray font-semibold' : 'bg-gray-700 text-gray-200'}`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[85%] p-3 rounded-xl bg-gray-700 text-gray-200">
                                    <div className="flex items-center space-x-1">
                                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                         {error && (
                            <div className="p-3 bg-red-900/50 border border-red-500/50 text-red-200 text-sm rounded-lg">
                                {error}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 flex items-center gap-2 bg-gray-800 rounded-b-2xl">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jetson-green"
                            aria-label="Chat input"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-jetson-green text-jetson-gray p-2.5 rounded-full shadow-md hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Send message"
                        >
                            <SendIcon />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};
