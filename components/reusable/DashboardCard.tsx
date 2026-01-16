import React, { ReactNode } from 'react'
import { cn } from '@/lib'

type DashboardCardProps = {
  title?: string
  icon?: ReactNode
  children?: ReactNode
  className?: string
  headerClassName?: string
  bodyClassName?: string
  titleClassName?: string
  headerActions?: ReactNode
}

const DashboardCard = ({
  title,
  icon,
  children,
  className,
  headerClassName,
  bodyClassName,
  titleClassName,
  headerActions
}: DashboardCardProps) => {
  return (
    <div className={cn(
      "bg-white rounded-2xl border border-gray-100 shadow-sm",
      "hover:shadow-md transition-shadow duration-200",
      className
    )}>

      {(title || headerActions) && (
        
        <div className={cn(
          "p-4 flex items-center gap-x-5 gap-y-4 flex-wrap",
          "border-b border-gray-100",
          "text-text-color",
          headerClassName
        )}>

          <div className="flex items-center gap-x-1.5">
            {icon && <span className="text-primary">{icon}</span>}
            {title && (
              <h2 className={cn(
                'text-sm font-semibold text-gray-900',
                titleClassName
              )}>
                {title}
              </h2>
            )}
          </div>

          {headerActions && (
            <div className="ml-auto">
              {headerActions}
            </div>
          )}

        </div>
      )}


      <div className={cn("p-4", bodyClassName)}>
        {children}
      </div>

    </div>
  )
}

export default DashboardCard

