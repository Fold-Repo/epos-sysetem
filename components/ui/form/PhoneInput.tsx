'use client';

import React from "react";
import PhoneInput from "react-phone-number-input";
import { CountryCode } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import { cn } from "@/lib";
import Label from "./Label";
import ErrorMessage from "./ErrorMessage";

interface PhoneNumberInputProps {
    label?: string;
    name?: string;
    className?: string;
    formGroupClass?: string;
    labelClassName?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    inputSize?: "sm" | "md" | "lg";
    radius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
    error?: string;
    placeholder?: string;
    country?: CountryCode;
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
}

const sizeClasses = {
    sm: "h-10",
    md: "h-11",
    lg: "h-13",
};

const radiusClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
};

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
    label,
    name,
    className,
    formGroupClass,
    labelClassName,
    disabled,
    fullWidth,
    inputSize = "md",
    radius = "md",
    error,
    placeholder = "Enter phone number",
    country = "NG",
    value = "",
    onChange,
    onBlur,
    ...props
}) => {
    const handleChange = (phoneValue: string | undefined) => {
        onChange?.(phoneValue || "");
    };

    return (
        <div className={cn("form-group", formGroupClass, fullWidth && "w-full")}>
            {label && <Label htmlFor={name} label={label} className={labelClassName} />}

            <PhoneInput
                {...props}
                international
                value={value}
                onChange={handleChange}
                onBlur={onBlur}
                disabled={disabled}
                defaultCountry={country}
                placeholder={placeholder}
                className={cn(
                    "form-control py-1",
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

export default PhoneNumberInput;