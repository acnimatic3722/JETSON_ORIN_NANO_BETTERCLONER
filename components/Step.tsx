
import React from 'react';
import type { StepContent } from '../types';
import { CodeBlock } from './CodeBlock';
import { Warning } from './Warning';

interface StepProps {
    content: StepContent;
}

export const Step: React.FC<StepProps> = ({ content }) => {
    return (
        <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-strong:text-jetson-green">
            <h2>{content.title}</h2>
            {content.description.map((paragraph, index) => (
                <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
            ))}
            
            {content.warning && <Warning message={content.warning} />}
            
            {content.command && <CodeBlock command={content.command} />}

            {content.note && (
                <div className="mt-4 p-4 bg-blue-900/50 border-l-4 border-blue-400 rounded-r-lg">
                    <p className="text-blue-200 !m-0"><strong className="text-blue-300">Note:</strong> {content.note}</p>
                </div>
            )}
        </div>
    );
};
