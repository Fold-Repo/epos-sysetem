"use client";

import React, { useState } from "react";
import { Calendar, DateRange, RangeKeyDict } from "react-date-range";
import { format } from "date-fns";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { CalendarIcon } from "../icons";

type Props = {
    value?: Date;

    startDate?: Date;
    endDate?: Date;

    onChange: (value: Date | { startDate: Date; endDate: Date }) => void;
    className?: string;
    triggerClassName?: string;
    range?: boolean;
};

const formatOnlyDate = (date: Date) => format(date, "dd MMM");
const formatFullDate = (date: Date) => format(date, "dd MMM yyyy");

const DatePicker: React.FC<Props> = ({
    value,
    startDate,
    endDate,
    onChange,
    className,
    triggerClassName,
    range = false,
}) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Single date state
    const [date, setDate] = useState<Date>(value ?? new Date());

    // Range date state
    const [dateRange, setDateRange] = useState([
        {
            startDate: startDate ?? new Date(),
            endDate: endDate ?? new Date(),
            key: "selection",
        },
    ]);

    // Handle single date
    const handleSingleDateChange = (selectedDate: Date) => {
        setDate(selectedDate);
        onChange(selectedDate);
        setIsCalendarOpen(false);
    };

    const handleRangeChange = (ranges: RangeKeyDict) => {
        const selection = ranges.selection;
        const start = selection.startDate ?? new Date();
        const end = selection.endDate ?? new Date();

        setDateRange([
            {
                startDate: start,
                endDate: end,
                key: "selection",
            },
        ]);

        onChange({ startDate: start, endDate: end });
    };

    return (
        <div className={cn("relative inline-block text-left", className)}>

            <button
                type="button"
                aria-label={range ? "Select date range" : "Select date"}
                className={cn(
                    "flex items-center gap-x-1.5 cursor-pointer text-text-color text-[12px] rounded-lg p-2 bg-white",
                    triggerClassName
                )}
                onClick={() => setIsCalendarOpen((prev) => !prev)}>

                <CalendarIcon className="text-slate-400" width={12} height={12} />

                <span className="whitespace-nowrap">
                    {range
                        ? `${formatOnlyDate(dateRange[0].startDate!)} - ${formatOnlyDate(
                            dateRange[0].endDate!
                        )}`
                        : formatFullDate(date)}
                </span>

                <ChevronDownIcon
                    className={cn(
                        "size-3.5 transition-transform duration-300",
                        isCalendarOpen && "rotate-180"
                    )}
                />
            </button>

            {isCalendarOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsCalendarOpen(false)}
                    />
                    <div className="absolute z-50 mt-2 right-0 bg-white shadow-lg rounded-lg overflow-hidden">
                        {range ? (
                            <DateRange
                                editableDateInputs
                                onChange={handleRangeChange}
                                moveRangeOnFirstSelection={false}
                                ranges={dateRange}
                                showDateDisplay={false}
                                rangeColors={["#8b5cf6"]}
                            />
                        ) : (
                            <Calendar
                                date={date}
                                onChange={handleSingleDateChange}
                                showDateDisplay={false}
                                color="#8b5cf6"
                            />
                        )}
                    </div>
                </>
            )}

        </div>
    );
};

export default DatePicker;

