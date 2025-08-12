import { cn } from '@/lib';
import React from 'react';

interface LabelProps {
    htmlFor?: string;
    label: string;
    className?: string;
}

const Label: React.FC<LabelProps> = ({ htmlFor, label, className }) => {
    return (
        <label htmlFor={htmlFor} className={cn("font-medium text-secondary-text text-sm mb-2", className)}>
            {label}
        </label>
    );
};

export default Label;
