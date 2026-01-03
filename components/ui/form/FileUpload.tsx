"use client";

import React, { useState, useRef } from "react";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/react";
import Image from "next/image";
import { cn } from "@/lib";
import Label from "./Label";
import ErrorMessage from "./ErrorMessage";
import { radiusClasses } from "./constants";

interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value"> {
    label?: string | React.ReactNode;
    name: string;
    className?: string;
    formGroupClass?: string;
    labelClassName?: string;
    fullWidth?: boolean;
    radius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
    error?: string;
    maxFileSize?: number; // in MB
    acceptedFileTypes?: string[]; // e.g., ["pdf", "jpg", "png"]
    helperText?: string; // Custom helper text
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: FileList | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
    label,
    name,
    className,
    formGroupClass,
    labelClassName,
    fullWidth,
    radius = "xl",
    error,
    maxFileSize = 5,
    acceptedFileTypes = ["pdf", "jpg", "png"],
    helperText,
    onChange,
    accept,
    value,
    multiple = true,
    ...props
}) => {
    
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync files with value prop
    React.useEffect(() => {
        if (value && value instanceof FileList) {
            setFiles(Array.from(value));
        } else if (!value) {
            setFiles([]);
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            const newFiles: File[] = [];
            
            Array.from(selectedFiles).forEach((file) => {
                const fileSizeMB = file.size / (1024 * 1024);
                
                if (fileSizeMB > maxFileSize) {
                    alert(`File "${file.name}" size exceeds ${maxFileSize}MB limit`);
                    return;
                }
                
                newFiles.push(file);
            });

            // If multiple is false, replace files instead of appending
            const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
            setFiles(updatedFiles);
            
            // Update the input element's files
            if (fileInputRef.current) {
                const dataTransfer = new DataTransfer();
                updatedFiles.forEach((file) => {
                    dataTransfer.items.add(file);
                });
                fileInputRef.current.files = dataTransfer.files;
            }
        }
        onChange?.(e);
    };

    const handleRemove = (index: number) => {
        const remainingFiles = files.filter((_, i) => i !== index);
        setFiles(remainingFiles);
        
        if (fileInputRef.current) {
            const dataTransfer = new DataTransfer();
            remainingFiles.forEach((file) => {
                dataTransfer.items.add(file);
            });
            fileInputRef.current.files = dataTransfer.files;
            
            // Create a synthetic change event
            const syntheticEvent = {
                target: fileInputRef.current,
                currentTarget: fileInputRef.current,
            } as React.ChangeEvent<HTMLInputElement>;
            
            onChange?.(syntheticEvent);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const acceptValue = accept || acceptedFileTypes.map(type => `.${type}`).join(",");

    const fileTypesUpper = acceptedFileTypes.map(type => type.toUpperCase()).join(", ");
    const defaultHelperText = `${fileTypesUpper} up to ${maxFileSize}MB`;
    const displayHelperText = helperText || defaultHelperText;

    return (
        <div className={cn("form-group", formGroupClass, fullWidth && "w-full")}>
            {label && <Label htmlFor={name} label={label} className={labelClassName} />}

            <input
                ref={fileInputRef}
                id={name}
                name={name}
                type="file"
                className="hidden"
                onChange={handleChange}
                accept={acceptValue}
                multiple={multiple}
                {...props}
            />

            <button
                type="button"
                onClick={handleClick}
                className={cn(
                    "w-full bg-white border cursor-pointer",
                    "px-4 py-4",
                    "flex flex-col items-center justify-center space-y-2",
                    "focus:outline-none",
                    error 
                        ? "border-red-500" 
                        : "border-gray-300",
                    radiusClasses[radius],
                    className
                )}
                aria-label="Upload file">
                <ArrowUpTrayIcon className="w-6 h-6" />
                <div className="flex flex-col items-center justify-center space-y-1">
                    <p className="text-sm text-gray-700">
                        Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                        {displayHelperText}
                    </p>
                </div>
            </button>

            {/* File previews */}
            {files.length > 0 && (
                <div className="mt-3 space-y-2">
                    {files.map((file, index) => (
                        <div 
                            key={index} 
                            className="flex border rounded-[8px] p-1.5 border-gray-300 w-full items-center relative">
                            {file.type.startsWith("image/") ? (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Image ${index}`}
                                    className="h-[26px] w-[26px] object-cover rounded"
                                />
                            ) : file.type === "application/pdf" ? (
                                <div className="bg-white flex items-center justify-center rounded">
                                    <Image 
                                        className="h-[26px] w-[26px] object-cover rounded" 
                                        src="/img/file-pdf.png" 
                                        alt="PDF icon"
                                        width={26}
                                        height={26}
                                    />
                                </div>
                            ) : (
                                <div className="bg-white flex items-center justify-center rounded">
                                    <Image 
                                        className="h-[26px] w-[26px] object-cover rounded" 
                                        src="/img/file-blank.png" 
                                        alt="File"
                                        width={26}
                                        height={26}
                                    />
                                </div>
                            )}
                            <p className="text-xs text-[#333] pt-0 px-2 overflow-hidden whitespace-nowrap text-ellipsis flex-1">
                                {file.name}
                            </p>
                            <Button
                                isIconOnly
                                size="sm"
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="absolute -top-2 -right-2 bg-black text-white rounded-full h-5 w-5 min-w-5"
                                aria-label="Remove file"
                            >
                                <XMarkIcon className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <ErrorMessage error={error} />
        </div>
    );
};

export default FileUpload;

