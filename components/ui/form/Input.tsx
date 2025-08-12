'use client';

import React, { ReactNode, useState } from "react";
import { cn } from "@/lib";
import Label from "./Label";
import ErrorMessage from "./ErrorMessage";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
    label?: string;
    name: string;
    className?: string;
    formGroupClass?: string;
    labelClassName?: string;
    startContent?: ReactNode;
    endContent?: ReactNode;
    fullWidth?: boolean;
    inputSize?: "sm" | "md" | "lg";
    radius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
    error?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    isCurrency?: boolean;
}

const sizeClasses: Record<string, string> = {
    sm: "h-10",
    md: "h-11",
    lg: "h-13",
};

const radiusClasses: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
};

const formatCurrency = (value: string) => {
    const number = parseFloat(value.replace(/,/g, ''));
    if (isNaN(number)) return '';
    return number.toLocaleString();
};

const unformatCurrency = (value: string) => {
    return value.replace(/,/g, '');
};

const Input: React.FC<InputProps> = ({
    label,
    name,
    className,
    formGroupClass,
    labelClassName,
    startContent,
    endContent,
    fullWidth,
    inputSize = "md",
    radius = "md",
    error,
    value,
    onChange,
    onBlur,
    isCurrency = false,
    ...props
}) => {
    const [displayValue, setDisplayValue] = useState(() => {
        if (isCurrency && value) {
            return formatCurrency(String(value));
        }
        return value ?? '';
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let rawValue = e.target.value;

        if (isCurrency) {
            rawValue = unformatCurrency(rawValue);
            const formattedValue = formatCurrency(rawValue);
            
            const syntheticEvent = {
                ...e,
                target: {
                    ...e.target,
                    value: rawValue,
                    name: name
                }
            };
            
            onChange?.(syntheticEvent);
            setDisplayValue(formattedValue);
        } else {
            onChange?.(e);
        }
    };

    const inputValue = isCurrency ? displayValue : value;

    return (
        <div className={cn("form-group", formGroupClass, fullWidth && "w-full")}>
            {label && <Label htmlFor={name} label={label} className={labelClassName} />}

            <div className="relative w-full">
                {startContent && (
                    <div className="absolute left-3 inset-y-0 flex items-center">
                        {startContent}
                    </div>
                )}

                <input
                    {...props}
                    id={name}
                    name={name}
                    value={inputValue}
                    onChange={handleChange}
                    onBlur={onBlur}
                    className={cn(
                        "form-control",
                        sizeClasses[inputSize],
                        radiusClasses[radius],
                        startContent ? "pl-9" : "",
                        endContent ? "pr-9" : "",
                        className,
                        error && "is-invalid"
                    )}
                />

                {endContent && (
                    <div className="absolute right-3 inset-y-0 flex items-center">
                        {endContent}
                    </div>
                )}
            </div>

            <ErrorMessage error={error} />
            
        </div>
    );
};

export default Input;