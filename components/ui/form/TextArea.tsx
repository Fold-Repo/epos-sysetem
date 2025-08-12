'use client'

import React from "react";
import { cn } from "@/lib";
import Label from "./Label";
import ErrorMessage from "./ErrorMessage";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    name?: string;
    className?: string;
    formGroupClass?: string;
    labelClassName?: string;
    fullWidth?: boolean;
    inputSize?: "sm" | "md" | "lg";
    radius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
    error?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

const sizeClasses: Record<string, string> = {
    sm: "h-20",
    md: "h-28",
    lg: "h-36",
};

const radiusClasses: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
};

const TextArea: React.FC<TextAreaProps> = ({
    label,
    name,
    className,
    formGroupClass,
    labelClassName,
    fullWidth,
    inputSize = "md",
    radius = "md",
    error,
    value,
    onChange,
    onBlur,
    ...props
}) => {
    return (
        <div className={cn("form-group", formGroupClass, fullWidth && "w-full")}>
            {label && <Label htmlFor={name} label={label} className={labelClassName} />}

            <textarea
                {...props}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={cn(
                    "form-control shadow-none",
                    sizeClasses[inputSize],
                    radiusClasses[radius],
                    error && "is-invalid",
                    className
                )}
            />

            <ErrorMessage error={error} />
        </div>
    );
};

export default TextArea;