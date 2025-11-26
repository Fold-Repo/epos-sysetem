import React, { ReactNode } from 'react'
import { cn } from '@/lib'

type MetricCardProps = {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  colorClass?: string
  bgColorClass?: string
  children?: ReactNode
  className?: string
}

const MetricCard = ({
  title,
  value,
  description,
  icon,
  colorClass = 'text-secondary',
  bgColorClass,
  children,
  className
}: MetricCardProps) => {

  const getBgColorClass = (textClass: string): string => {
    if (textClass === 'text-secondary') {
      return 'bg-secondary/10';
    }
    if (textClass === 'text-success') {
      return 'bg-success/10';
    }
    if (textClass.startsWith('text-[')) {
      return '';
    }
    return '';
  }

  const getBgColorStyle = (textClass: string): React.CSSProperties | undefined => {
    if (textClass.startsWith('text-[')) {
      const colorMatch = textClass.match(/text-\[(.*?)\]/);
      if (colorMatch) {
        const color = colorMatch[1];
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return { backgroundColor: `rgba(${r}, ${g}, ${b}, 0.1)` };
      }
    }
    return undefined;
  }

  const computedBgColorClass = bgColorClass || getBgColorClass(colorClass);
  const bgColorStyle = bgColorClass ? undefined : getBgColorStyle(colorClass);

  return (
    <div className={cn("p-3 2xl:p-4 rounded-xl border border-[#E6E9EF] space-y-1", className)}>

      <div className="flex items-center justify-between">

        <h3 className={cn("text-xs 2xl:text-sm", colorClass)}>
          {title}
        </h3>

        {icon && (
          <div className={cn("p-1.5 rounded-lg", computedBgColorClass || undefined)}
            style={bgColorStyle}>
            <div className={colorClass}>
              {icon}
            </div>
          </div>
        )}

      </div>

      <h2 className='text-[15px] font-semibold text-text-color'>{value}</h2>

      {description && (
        <p className="text-xs text-slate-400 font-light">{description}</p>
      )}

      {children}

    </div>
  )
}

export default MetricCard

