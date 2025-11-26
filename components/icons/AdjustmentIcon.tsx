import React from 'react';

interface AdjustmentIconProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    width?: number;
    height?: number;
}

const AdjustmentIcon: React.FC<AdjustmentIconProps> = ({
    className = '',
    width = 12,
    height = 11,
    ...props
}) => {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 12 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M0.75 2.5H2.5M2.5 2.5C2.5 3.4665 3.2835 4.25 4.25 4.25C5.2165 4.25 6 3.4665 6 2.5C6 1.5335 5.2165 0.75 4.25 0.75C3.2835 0.75 2.5 1.5335 2.5 2.5ZM0.75 8.33333H4.25M9.5 8.33333H11.25M9.5 8.33333C9.5 9.29983 8.7165 10.0833 7.75 10.0833C6.7835 10.0833 6 9.29983 6 8.33333C6 7.36684 6.7835 6.58333 7.75 6.58333C8.7165 6.58333 9.5 7.36684 9.5 8.33333ZM7.75 2.5H11.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default AdjustmentIcon;

