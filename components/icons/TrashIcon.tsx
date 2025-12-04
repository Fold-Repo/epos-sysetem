import React from 'react';

interface TrashIconProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    width?: number;
    height?: number;
}

const TrashIcon: React.FC<TrashIconProps> = ({
    className = '',
    width = 18,
    height = 18,
    ...props
}) => {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M14.9722 6.35L14.3359 13.7954C14.1934 15.4626 12.6487 16.75 10.7908 16.75H6.70922C4.85132 16.75 3.30663 15.4626 3.16414 13.7954L2.52778 6.35M16.75 4.75C14.4407 3.73718 11.6955 3.15 8.75 3.15C5.80453 3.15 3.05926 3.73718 0.75 4.75M6.97222 3.15V2.35C6.97222 1.46634 7.76816 0.75 8.75 0.75C9.73184 0.75 10.5278 1.46634 10.5278 2.35V3.15M6.97222 7.95V12.75M10.5278 7.95V12.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default TrashIcon;

