import Link from 'next/link'

import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { ChevronIcon } from '../icons/chevron-icon'
import { RatingStars } from '../shared/RatingStars'

export function AnnouncementBadge({
  text,
  href,
  cta = 'Learn more',
  variant = 'normal',
  rating,
  stars,
  starClassName,
  textElement = 'span',
  className,
  ...props
}: {
  text: ReactNode
  href: string
  cta?: ReactNode
  variant?: 'normal' | 'overlay'
  /** When provided, renders rating stars to the left of the text */
  rating?: number
  /** Number of stars to display (defaults to 5) */
  stars?: number
  /** Custom class name for star icons */
  starClassName?: string
  textElement?: 'span' | 'h2'
} & Omit<ComponentProps<typeof Link>, 'href' | 'children'>) {
  const TextElement = textElement
  const dividerClassName = clsx(
    'h-3 w-px max-sm:hidden',
    variant === 'normal' && 'bg-olive-950/20',
    variant === 'overlay' && 'bg-white/20'
  )

  return (
    <Link
      href={href}
      {...props}
      data-variant={variant}
      className={clsx(
        'group relative inline-flex max-w-full gap-x-3 overflow-hidden rounded-md px-3.5 py-2 text-sm/6 max-sm:flex-col sm:items-center sm:rounded-full sm:px-3 sm:py-0.5',
        variant === 'normal' &&
          'bg-olive-950/5 text-olive-950 hover:bg-olive-950/10',
        variant === 'overlay' &&
          'bg-olive-950/15 text-white hover:bg-olive-950/20',
        className
      )}
    >
      {rating !== undefined && (
        <RatingStars
          rating={rating}
          stars={stars}
          starClassName={starClassName}
        />
      )}
      <TextElement className='m-0 mt-1.5 text-pretty sm:mt-0 sm:truncate'>
        {text}
      </TextElement>
      <span className={dividerClassName} />
      <span
        className={clsx(
          'inline-flex shrink-0 items-center gap-2 font-semibold',
          variant === 'normal' && 'text-olive-950'
        )}
      >
        {cta} <ChevronIcon className='shrink-0' />
      </span>
    </Link>
  )
}
