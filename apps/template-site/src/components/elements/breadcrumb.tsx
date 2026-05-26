import { ChevronRightIcon } from '@heroicons/react/16/solid'
import { clsx } from 'clsx/lite'
import Link from 'next/link'
import type { ComponentProps } from 'react'

type BreadcrumbItem = {
  label: string
  href?: string
}

export function Breadcrumb({
  items,
  className,
  ...props
}: { items: BreadcrumbItem[] } & ComponentProps<'nav'>) {
  return (
    <nav
      aria-label='Breadcrumb'
      className={clsx('text-sm/7 font-[550] text-olive-700/90', className)}
      {...props}
    >
      <ol className='flex flex-wrap items-center gap-1.5'>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const labelClass = clsx(
            'transition-colors duration-100 ease-in-out hover:text-olive-950',
            isLast && 'text-olive-800/95'
          )
          return (
            <li key={index} className='flex items-center gap-1.5'>
              {item.href ? (
                <Link
                  href={item.href}
                  aria-current={isLast ? 'page' : undefined}
                  className={labelClass}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={labelClass}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRightIcon
                  className='size-3.5 text-olive-500'
                  aria-hidden='true'
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
