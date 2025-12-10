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
      "bg-white rounded-2xl border border-gray-100",
      className
    )}>

      {(title || headerActions) && (
        
        <div className={cn("p-4 flex items-center gap-x-5 gap-y-4 flex-wrap text-text-color", headerClassName)}>

          <div className="flex items-center gap-x-1.5">
            {title && (
              <h2 className={cn(
                'text-sm font-medium',
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


      <div className={cn("p-4 ", bodyClassName)}>
        {children}
      </div>

    </div>
  )
}

export default DashboardCard

