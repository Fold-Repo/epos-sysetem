import React from 'react';

interface CheckIconProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    width?: number;
    height?: number;
}

const CheckIcon: React.FC<CheckIconProps> = ({
    className = '',
    width = 15,
    height = 15,
    ...props
}) => {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path 
                d="M0 7.02625C2.22969 9.43875 4.39156 11.6106 6.46969 14.3575C8.72906 9.86375 11.0416 5.35438 14.8572 0.470938L13.8291 0C10.6072 3.41687 8.10406 6.65125 5.92906 10.495C4.41656 9.1325 1.97219 7.20437 0.479688 6.21375L0 7.02625Z" 
                fill="currentColor"
            />
        </svg>
    );
};

export default CheckIcon;

