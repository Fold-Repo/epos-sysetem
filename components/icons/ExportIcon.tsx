import React from 'react';

interface ExportIconProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    width?: number;
    height?: number;
}

const ExportIcon: React.FC<ExportIconProps> = ({
    className = '',
    width = 16,
    height = 13,
    ...props
}) => {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 16 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M12 10.8792H1.6V3.6792H3.676C3.676 3.6792 4.2272 2.9624 5.412 2.0792H0.8C0.587827 2.0792 0.384344 2.16349 0.234315 2.31351C0.0842855 2.46354 0 2.66703 0 2.8792L0 11.6792C0 11.8914 0.0842855 12.0949 0.234315 12.2449C0.384344 12.3949 0.587827 12.4792 0.8 12.4792H12.8C13.0122 12.4792 13.2157 12.3949 13.3657 12.2449C13.5157 12.0949 13.6 11.8914 13.6 11.6792V8.6824L12 9.9984V10.8792ZM10.6888 5.3192V8.16L16 3.9992L10.6888 0V2.5048C4.24 2.5048 4.24 8.8792 4.24 8.8792C6.0656 5.8808 7.1888 5.3192 10.6888 5.3192Z"
                fill="currentColor"
            />
        </svg>
    );
};

export default ExportIcon;

