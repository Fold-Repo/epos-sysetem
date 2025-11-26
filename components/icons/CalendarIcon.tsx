import React from 'react';

interface CalendarIconProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    width?: number;
    height?: number;
}

const CalendarIcon: React.FC<CalendarIconProps> = ({
    className = '',
    width = 12,
    height = 12,
    ...props
}) => {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path 
                d="M0 9.91667C0 10.9083 0.758333 11.6667 1.75 11.6667H9.91667C10.9083 11.6667 11.6667 10.9083 11.6667 9.91667V5.25H0V9.91667ZM9.91667 1.16667H8.75V0.583333C8.75 0.233333 8.51667 0 8.16667 0C7.81667 0 7.58333 0.233333 7.58333 0.583333V1.16667H4.08333V0.583333C4.08333 0.233333 3.85 0 3.5 0C3.15 0 2.91667 0.233333 2.91667 0.583333V1.16667H1.75C0.758333 1.16667 0 1.925 0 2.91667V4.08333H11.6667V2.91667C11.6667 1.925 10.9083 1.16667 9.91667 1.16667Z" 
                fill="currentColor"
            />
        </svg>
    );
};

export default CalendarIcon;

