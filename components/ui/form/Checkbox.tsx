"use client";

import React from "react";
import { cn } from "@/lib";
import ErrorMessage from "./ErrorMessage";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string | React.ReactNode;
    name?: string;
    className?: string;
    formGroupClass?: string;
    labelClassName?: string;
    fullWidth?: boolean;
    error?: string;
    checked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    value?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
    label,
    name,
    className,
    formGroupClass,
    labelClassName,
    fullWidth,
    error,
    checked,
    onChange,
    onBlur,
    value,
    ...props
}) => {
    return (
        <div className={cn("mb-0 pb-0 text-light", formGroupClass, fullWidth && "w-full")}>
            <label className={cn("inline-flex items-start cursor-pointer gap-2 text-xs", labelClassName)}>
                <input
                    {...props}
                    type="checkbox"
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    className="peer hidden"
                />
                <div className={cn(
                    "size-4 border rounded flex items-center justify-center",
                    "border-gray-300 peer-checked:border-primary peer-checked:bg-primary",
                    "peer-focus:ring-2 peer-focus:ring-primary transition-all",
                    className
                )} />
                {label && <span className={cn("text-xs text-black", labelClassName)}>{label}</span>}
            </label>
            <ErrorMessage error={error} />
        </div>
    );
};

export default Checkbox;