import React from 'react';

interface LogoutIconProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    width?: number;
    height?: number;
}

const LogoutIcon: React.FC<LogoutIconProps> = ({
    className = '',
    width = 17,
    height = 17,
    ...props
}) => {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M9.31083 16.1626H5.03C3.95345 16.2118 2.90081 15.8352 2.09983 15.1142C1.29884 14.3932 0.813931 13.3859 0.75 12.3101V4.60678C0.813931 3.531 1.29884 2.52365 2.09983 1.80268C2.90081 1.0817 3.95345 0.705071 5.03 0.754281H9.31"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M15.4091 8.4585H4.28162"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
            />
            <path
                d="M11.4825 12.7382L15.1525 9.06822C15.3134 8.90593 15.4036 8.6867 15.4036 8.45822C15.4036 8.22975 15.3134 8.01052 15.1525 7.84822L11.4825 4.17822"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default LogoutIcon;

