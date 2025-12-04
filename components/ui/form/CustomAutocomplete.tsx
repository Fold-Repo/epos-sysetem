"use client";

import React, { ReactNode } from "react";
import Select, { StylesConfig, GroupBase } from "react-select";
import { cn } from "@/lib";
import Label from "./Label";
import ErrorMessage from "./ErrorMessage";
import { sizeClasses, radiusClasses } from "./constants";

export interface Option {
    value: string;
    label: string;
}

interface CustomAutocompleteProps {
    name: string;
    label?: string | ReactNode;
    options: Option[];
    placeholder?: string;
    formGroupClass?: string;
    labelClassName?: string;
    className?: string;
    multiple?: boolean;
    returnObject?: boolean;
    error?: string;
    value?: string | string[] | Option | Option[];
    onChange?: (value: any) => void;
    onBlur?: () => void;
    isDisabled?: boolean;
    isClearable?: boolean;
    isSearchable?: boolean;
    inputSize?: "sm" | "md" | "lg";
    radius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
}

const CustomAutocomplete: React.FC<CustomAutocompleteProps> = ({
    name,
    label,
    options,
    placeholder = "Select",
    formGroupClass = "mb-4",
    labelClassName,
    className,
    multiple = false,
    returnObject = false,
    error,
    value,
    onChange,
    onBlur,
    isDisabled = false,
    isClearable = false,
    isSearchable = true,
    inputSize = "md",
    radius = "md",
}) => {

    const selectedValue = (() => {
        if (!value) return multiple ? [] : null;

        if (multiple) {
            const valuesArray = Array.isArray(value) ? value : [];
            if (valuesArray.length === 0) return [];

            const firstItem = valuesArray[0];
            if (typeof firstItem === "object" && firstItem !== null && "value" in firstItem) {
                // Type guard: valuesArray is Option[]
                const optionArray = valuesArray as Option[];
                return options.filter((opt) =>
                    optionArray.some((val: Option) => val?.value === opt.value)
                );
            } else {
                // Type guard: valuesArray is string[]
                const stringArray = valuesArray as string[];
                return options.filter((opt) => stringArray.includes(opt.value));
            }
        } else {
            if (typeof value === "object" && value !== null && "value" in value) {
                return options.find((opt) => opt.value === (value as Option).value) || null;
            } else {
                // Value is a string
                return options.find((opt) => opt.value === value) || null;
            }
        }
    })();

    const handleChange = (selected: any) => {
        if (!onChange) return;

        if (multiple) {
            if (!selected) {
                onChange([]);
                return;
            }

            const selectedArray = Array.isArray(selected) ? selected : [selected];
            const values = selectedArray.map((opt: Option) =>
                returnObject ? opt : opt.value
            );
            onChange(values);
        } else {
            if (!selected) {
                onChange(returnObject ? null : "");
                return;
            }
            onChange(returnObject ? selected : selected?.value || "");
        }
    };

    // Map size classes to minHeight (matching Tailwind h-* values)
    const sizeHeightMap: Record<keyof typeof sizeClasses, string> = {
        sm: "2rem", // h-10 = 40px
        md: "2.75rem", // h-11 = 44px
        lg: "3rem", // h-12 = 48px
    };

    // Map radius classes to borderRadius (matching Tailwind rounded-* values)
    const radiusMap: Record<keyof typeof radiusClasses, string> = {
        none: "0",
        sm: "0.25rem", // rounded-sm
        md: "0.5rem", // rounded-md
        lg: "0.75rem", // rounded-lg
        xl: "1rem", // rounded-xl
        full: "9999px", // rounded-full
    };

    const customStyles: StylesConfig<Option, boolean, GroupBase<Option>> = {
        control: (provided, state) => ({
            ...provided,
            padding: "0.2rem 0.5rem",
            borderRadius: radiusMap[radius] || "0.5rem",
            borderColor: error
                ? "#e53935" 
                : state.isFocused
                ? "#8b5cf6" 
                : "#d1d5db", 
            fontSize: "0.8125rem",
            color: "#000",
            boxShadow: state.isFocused
                ? error
                    ? "0 0 0 2px rgba(229, 57, 53, 0.15)" 
                    : "0px 1.15px 2.3px 0px #e4e5e73d" 
                : "none",
            "&:hover": {
                borderColor: error ? "#e53935" : state.isFocused ? "#8b5cf6" : "#d1d5db",
            },
            minHeight: sizeHeightMap[inputSize] || sizeHeightMap.md,
        }),
        placeholder: (provided) => ({
            ...provided,
            fontSize: "0.75rem",
            color: "#9ca3af",
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: radiusMap[radius] || radiusMap.md,
            fontSize: "0.75rem",
            zIndex: 9999,
        }),
        multiValue: (provided) => ({
            ...provided,
            borderRadius: "9999px",
            backgroundColor: "#e5e7eb",
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            fontSize: "0.75rem",
            padding: "0.25rem 0.5rem",
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            borderRadius: "9999px",
            "&:hover": {
                backgroundColor: "#d1d5db",
                color: "#000",
            },
        }),
        option: (provided, state) => ({
            ...provided,
            fontSize: "0.8125rem", 
            backgroundColor: state.isSelected
                ? "#8b5cf6" 
                : state.isFocused
                ? "#f3f4f6" 
                : "transparent",
            color: state.isSelected ? "#fff" : "#000",
            "&:active": {
                backgroundColor: "#8b5cf6", 
                color: "#fff",
            },
        }),
    };

    return (
        <div className={cn("form-group", formGroupClass)}>
            {label && (
                <Label htmlFor={name} label={label} className={labelClassName} />
            )}

            <div className={cn("w-full", className)}>
                <Select<Option, boolean>
                    isMulti={multiple}
                    name={name}
                    options={options}
                    placeholder={placeholder}
                    classNamePrefix="react-select"
                    value={selectedValue}
                    onChange={handleChange}
                    onBlur={onBlur}
                    isDisabled={isDisabled}
                    isClearable={isClearable}
                    isSearchable={isSearchable}
                    styles={customStyles}
                />
            </div>

            <ErrorMessage error={error} />
        </div>
    );
};

export default CustomAutocomplete;

