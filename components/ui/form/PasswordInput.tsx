'use client'

import React, { useState, ReactNode } from "react";
import { cn } from "@/lib";
import Label from "./Label";
import ErrorMessage from "./ErrorMessage";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
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

const PasswordInput: React.FC<PasswordInputProps> = ({
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
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

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
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={cn(
                        "form-control",
                        sizeClasses[inputSize],
                        radiusClasses[radius],
                        startContent ? "pl-9" : "",
                        endContent ? "pr-9" : "pr-11",
                        error && "is-invalid",
                        className
                    )}
                />

                <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 inset-y-0 flex items-center cursor-pointer text-gray-600">
                    {showPassword ? (
                        <EyeSlashIcon className="size-[18px]" />
                    ) : (
                        <EyeIcon className="size-[18px]" />
                    )}
                </button>

                {endContent && (
                    <div className="absolute right-9 inset-y-0 flex items-center">
                        {endContent}
                    </div>
                )}
            </div>

            <ErrorMessage error={error} />
        </div>
    );
};

export default PasswordInput;