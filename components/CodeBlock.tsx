
import React, { useState, useCallback } from 'react';

interface CodeBlockProps {
    command: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ command }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(command).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [command]);

    return (
        <div className="my-6 bg-terminal-bg rounded-lg shadow-lg overflow-hidden border border-terminal-header">
            <div className="flex justify-between items-center px-4 py-2 bg-terminal-header">
                <span className="text-xs text-gray-300 font-semibold">Jetson Terminal</span>
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-xs bg-gray-600 hover:bg-gray-500 text-white font-semibold px-3 py-1 rounded-md transition-colors"
                >
                    {copied ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-jetson-green" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Copied!
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                        </>
                    )}
                </button>
            </div>
            <pre className="p-4 text-sm whitespace-pre-wrap font-mono">
                <code><span className="text-gray-400">$ </span>{command}</code>
            </pre>
        </div>
    );
};
