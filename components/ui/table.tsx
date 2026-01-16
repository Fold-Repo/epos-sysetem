
import { cn } from "@/lib";
import React from "react";

const Table: React.FC<{
    children?: React.ReactNode;
    className?: string;
}> = ({ children, className = '' }) => {
    return (
        <div className="overflow-hidden">
            <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <table className={cn(
                            "min-w-full divide-y divide-gray-200 tracking-wide",
                            "border-collapse",
                            className
                        )}>
                            {children}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TableBody: React.FC<{
    children?: React.ReactNode;
    className?: string;
}> = ({ children, className = '' }) => {
    return (
        <tbody className={cn("divide-y divide-gray-100", className)}>
            {children}
        </tbody>
    );
};

const TableHead: React.FC<{
    children?: React.ReactNode;
    className?: string;
    scope?: "col" | "row";
}> = ({ children, className = '', scope = "col" }) => {
    return (
        <th scope={scope} className={cn(
            "px-6 py-3 bg-[#F4F6F8] text-left whitespace-nowrap",
            "font-semibold text-xs text-gray-700 uppercase tracking-wider",
            "sticky top-0 z-10",
            className
        )}>
            {children}
        </th>
    );
};

const TableHeader: React.FC<{
    children?: React.ReactNode;
    className?: string;
}> = ({ children, className = '' }) => {
    return (
        <thead className={cn("bg-white text-[#6B7280] border-t border-[#EAECF0] text-xs", className)}>
            {children}
        </thead>
    );
};

const TableRow: React.FC<{
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
}> = ({ children, className = '', onClick, style }) => {
    return (
        <tr 
            className={cn(
                className,
                onClick && 'hover:bg-gray-100 cursor-pointer transition-colors duration-150'
            )} 
            onClick={onClick}
            style={style}
        >
            {children}
        </tr>
    );
};

const TableCell: React.FC<{
    children?: React.ReactNode;
    className?: string;
    colSpan?: number;
}> = ({ children, className = '', colSpan }) => {
    return (
        <td colSpan={colSpan} className={cn(
            "px-6 py-4 text-xs whitespace-nowrap",
            "text-gray-900",
            className
        )}>
            {children}
        </td>
    );
};


export {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell
};
