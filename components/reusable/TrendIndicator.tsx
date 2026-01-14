import { FC } from 'react';
import { ArrowUpRightIcon, ArrowDownLeftIcon } from '@heroicons/react/24/outline';

interface TrendIndicatorProps {
    trend: 'up' | 'down'; 
    percentage: number | string; 
    description: string; 
}

const TrendIndicator: FC<TrendIndicatorProps> = ({ trend, percentage, description }) => {

    const isPositive = trend === 'up';

    return (
        <div className="inline-flex items-center gap-x-2 text-xs">
            {isPositive ? (
                <ArrowUpRightIcon className="size-3 text-green-600" />
            ) : (
                <ArrowDownLeftIcon className="size-3 text-red-600" />
            )}
            <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                {percentage}%
            </span>
            <p className="text-gray-700">{description}</p>
        </div>
    );
};

export default TrendIndicator;

