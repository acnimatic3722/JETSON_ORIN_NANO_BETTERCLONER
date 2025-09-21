
import React from 'react';

interface WarningProps {
    message: string;
}

export const Warning: React.FC<WarningProps> = ({ message }) => {
    return (
        <div className="my-4 p-4 bg-red-900/50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
                 <p className="text-red-200 !m-0" dangerouslySetInnerHTML={{ __html: message }} />
            </div>
        </div>
    );
};
