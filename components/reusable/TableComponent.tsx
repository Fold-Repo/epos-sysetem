
"use client";

import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
    CheckBox,
} from "./../ui";

interface Column {
    key: string;
    title: React.ReactNode;
    className?: string;
}

export interface RenderRowOptions {
    withCheckbox: boolean;
}

interface FlexibleTableProps<T> {
    columns: Column[];
    data: T[];
    rowKey: (item: T) => string;
    renderRow: (item: T, index: number, isSelected: boolean, options?: RenderRowOptions) => React.ReactNode;
    className?: string;
    tableClassName?: string;
    withCheckbox?: boolean;
    checkboxClassName?: string;
    onSelectionChange?: (selectedItems: T[]) => void;
    onRowClick?: (item: T, index: number) => void;
    loading?: boolean;
    skeletonRowCount?: number;
}

export const TableComponent = <T,>({
    columns,
    data,
    rowKey,
    renderRow,
    className = "",
    tableClassName = "",
    withCheckbox = false,
    checkboxClassName = "",
    onSelectionChange,
    onRowClick,
    loading = false,
    skeletonRowCount = 10,

}: FlexibleTableProps<T>) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const isAllSelected = data.length > 0 && selectedIds.length === data.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(data.map(rowKey));
        }
    };

    const handleRowToggle = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        if (onSelectionChange) {
            const selectedItems = data.filter((item) => selectedIds.includes(rowKey(item)));
            onSelectionChange(selectedItems);
        }
    }, [selectedIds, data, rowKey, onSelectionChange]);

    return (
        <div className={className}>
            <Table className={tableClassName}>
                <TableHeader>
                    <TableRow className={withCheckbox ? 'gap-x-1' : ''}>
                        {withCheckbox && (
                            <TableHead className={`w-10 ${checkboxClassName}`}>
                                <CheckBox
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                    className="bg-[#F4F6F8] border-[#E1E3E8]"
                                />
                            </TableHead>
                        )}
                        {columns.map((col, index) => (
                            <TableHead
                                key={col.key}
                                className={`${col.className} ${withCheckbox && index === 0 ? '' : ''}`}>
                                {col.title}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {loading ? (
                        Array.from({ length: skeletonRowCount }).map((_, idx) => (
                            <TableRow key={`skeleton-${idx}`} className={withCheckbox ? 'animate-pulse gap-x-1' : 'animate-pulse'}>
                                {withCheckbox && (
                                    <TableCell className={`w-10 ${checkboxClassName}`}>
                                        <div className="size-4 rounded bg-slate-200" />
                                    </TableCell>
                                )}
                                {columns.map((_, colIdx) => (
                                    <TableCell key={colIdx} className={withCheckbox && colIdx === 0 ? 'pl-2' : ''}>
                                        <div className="h-8 w-full rounded bg-slate-200" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length + (withCheckbox ? 1 : 0)} className="text-center py-6">
                                No data available
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item, index) => {
                            const id = rowKey(item);
                            const isSelected = selectedIds.includes(id);
                            return (
                                <TableRow 
                                    key={id} 
                                    className={withCheckbox ? 'gap-x-1' : ''}
                                    onClick={onRowClick ? () => onRowClick(item, index) : undefined}
                                    style={onRowClick ? { cursor: 'pointer' } : undefined}
                                >
                                    {withCheckbox && (
                                        <TableCell className={`w-10 ${checkboxClassName}`}>
                                            <CheckBox
                                                checked={isSelected}
                                                onChange={() => handleRowToggle(id)}
                                                className="bg-[#F4F6F8] border-[#E1E3E8]"
                                            />
                                        </TableCell>
                                    )}
                                    {renderRow(item, index, isSelected, { withCheckbox })}
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
