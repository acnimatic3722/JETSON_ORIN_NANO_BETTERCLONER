
export interface StepContent {
    title: string;
    description: string[];
    command?: string;
    warning?: string;
    note?: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}
