import React, { ReactNode } from 'react'
import { cn } from '@/lib'

type MetricCardProps = {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  colorClass?: string
  bgColorClass?: string
  useColorForDescription?: boolean
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
  useColorForDescription = false,
  children,
  className
}: MetricCardProps) => {

  const getBgColorClass = (textClass: string): string => {
    if (!textClass) return '';
    
    if (textClass.startsWith('text-')) {
      const colorPart = textClass.replace('text-', '');
      if (colorPart.startsWith('[')) {
        return '';
      }
      return `bg-${colorPart}/10`;
    }
    
    return '';
  }

  const getBgColorStyle = (textClass: string): React.CSSProperties | undefined => {
    if (!textClass) return undefined;
    
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
    <div className={cn("bg-white p-3 2xl:p-4 rounded-xl border border-slate-100 space-y-1", className)}>

      <div className="flex items-center justify-between">

        <h3 className="text-xs text-gray-500">
          {title}
        </h3>

        {icon && (
          <div className={cn("p-2 rounded-md", computedBgColorClass || undefined)}
            style={bgColorStyle}>
            <div className={colorClass}>
              {icon}
            </div>
          </div>
        )}

      </div>

      <h2 className='text-lg font-medium text-black'>{value}</h2>

      {description && (
        <p className={`text-[12px] pt-1 ${useColorForDescription && colorClass ? colorClass : 'text-gray-400'}`}>     {description}
        </p>
      )}

      {children}

    </div>
  )
}

export default MetricCard

