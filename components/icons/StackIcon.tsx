import React from 'react';

interface StackIconProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    width?: number;
    height?: number;
}

const StackIcon: React.FC<StackIconProps> = ({
    className = '',
    width = 16,
    height = 16,
    ...props
}) => {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M8.55333 1.45333C8.20186 1.29302 7.79814 1.29302 7.44667 1.45333L1.73333 4.05333C1.49162 4.15991 1.33564 4.39916 1.33564 4.66333C1.33564 4.9275 1.49162 5.16675 1.73333 5.27333L7.45333 7.88C7.8048 8.04032 8.20853 8.04032 8.56 7.88L14.28 5.28C14.5217 5.17342 14.6777 4.93417 14.6777 4.67C14.6777 4.40583 14.5217 4.16658 14.28 4.06"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M1.33333 8C1.33269 8.26038 1.4837 8.49731 1.72 8.60667L7.45333 11.2133C7.80291 11.3716 8.20375 11.3716 8.55333 11.2133L14.2733 8.61333C14.5145 8.50496 14.6688 8.26435 14.6667 8"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M1.33333 11.3333C1.33269 11.5937 1.4837 11.8306 1.72 11.94L7.45333 14.5467C7.80291 14.705 8.20375 14.705 8.55333 14.5467L14.2733 11.9467C14.5145 11.8383 14.6688 11.5977 14.6667 11.3333"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default StackIcon;

