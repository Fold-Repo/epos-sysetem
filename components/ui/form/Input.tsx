
"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { cn } from "@/lib";
import Label from "./Label";
import ErrorMessage from "./ErrorMessage";
import { sizeClasses, radiusClasses } from "./constants";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
    label?: string | ReactNode;
    name: string;
    className?: string;
    formGroupClass?: string;
    labelClassName?: string;
    startContent?: ReactNode;
    endContent?: ReactNode;
    fullWidth?: boolean;
    inputSize?: "sm" | "md" | "lg";
    radius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
    innerShadow?: boolean;
    error?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    isCurrency?: boolean;
    type?: string
}


const formatCurrency = (value: string) => {
    const number = parseFloat(value.replace(/,/g, ""));
    if (isNaN(number)) return "";
    return number.toLocaleString();
};

const unformatCurrency = (value: string) => {
    return value.replace(/,/g, "");
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
    innerShadow = false,
    error,
    value,
    onChange,
    onBlur,
    isCurrency = false,
    type = "text",
    ...props
}) => {
    const [displayValue, setDisplayValue] = useState(() => {
        if (isCurrency && value) {
            return formatCurrency(String(value));
        }
        return value ?? "";
    });

    // Sync displayValue with value prop when it changes
    useEffect(() => {
        if (isCurrency && value !== undefined) {
            const formatted = formatCurrency(String(value));
            setDisplayValue(formatted);
        } else if (!isCurrency) {
            // For non-currency inputs, we don't use displayValue, but we should still sync
            // The value prop is used directly in inputValue
        }
    }, [value, isCurrency]);

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
                    type={type}
                    id={name}
                    name={name}
                    value={type !== "file" ? inputValue : undefined}
                    onChange={handleChange}
                    onBlur={onBlur}
                    className={cn(
                        "form-control",
                        sizeClasses[inputSize],
                        radiusClasses[radius],
                        startContent ? "pl-9" : "",
                        endContent ? "pr-9" : "",
                        error && "is-invalid",
                        className
                    )}
                />

                {endContent && (
                    <div className="absolute right-3 inset-y-0 flex items-center">{endContent}</div>
                )}

            </div>

            <ErrorMessage error={error} />
        </div>
    );
};

export default Input;
