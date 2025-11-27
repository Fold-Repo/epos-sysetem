import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadCrumbProps = {
  items?: BreadcrumbItem[]
  title?: string
  description?: string
  className?: string
}

const BreadCrumb = ({
  items = [],
  title,
  description,
  className,
}: BreadCrumbProps) => {
  return (
    <div className={cn("px-3 py-3 bg-[#F4F6F8] border-y border-[#6C72781A] space-y-2", className)}>

      {items.length > 0 && (
        <ol className="flex items-center gap-x-0.5 text-slate-400 text-xs">
          {items.map((item, index) => {

            const isLast = index === items.length - 1
            const isFirst = index === 0

            return (
              <li key={index} className="inline-flex items-center">
                {isFirst && <ArrowLeftIcon className="size-4 mr-1" />}
                {item.href ? (
                  <Link className="flex items-center hover:text-text-color focus:outline-none 
                    focus:text-text-color transition-colors" href={item.href}>
                    {item.label}
                  </Link>
                ) : (
                  <span className="flex items-center">
                    {item.label}
                  </span>
                )}
                {!isLast && (
                  <svg className="shrink-0 size-5 mx-1"
                    width="16" height="16" viewBox="0 0 16 16"
                    fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M6 13L10 3" stroke="currentColor" strokeLinecap="round"></path>
                  </svg>
                )}
              </li>
            )
          })}
        </ol>
      )}

      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h2 className='text-base font-medium text-text-color'>{title}</h2>
          )}
          {description && (
            <p className='text-xs text-dark/70'>{description}</p>
          )}
        </div>
      )}

    </div>
  )
}

export default BreadCrumb