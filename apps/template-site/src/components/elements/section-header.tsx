import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'

type SectionHeaderLayout = 'split' | 'stacked'

type SectionHeaderProps = Omit<ComponentProps<'div'>, 'children'> & {
  eyebrow?: ReactNode
  headline?: ReactNode
  subheadline?: ReactNode
  action?: ReactNode
  layout?: SectionHeaderLayout
  asideClassName?: string
  actionClassName?: string
}

export function SectionHeader({
  eyebrow,
  headline,
  subheadline,
  action,
  layout = 'split',
  className,
  asideClassName,
  actionClassName,
  ...props
}: SectionHeaderProps) {
  if (!eyebrow && !headline && !subheadline && !action) return null

  const isSplit = layout === 'split'

  return (
    <div
      className={clsx(
        isSplit
          ? 'flex flex-col gap-6 py-10 sm:py-16 lg:flex-row lg:items-end lg:justify-between lg:gap-8'
          : 'relative flex max-w-2xl flex-col gap-6',
        className
      )}
      {...props}
    >
      <div className='flex flex-col gap-2'>
        {eyebrow}
        {headline}
      </div>
      {(subheadline || action) && (
        <div
          className={clsx(
            isSplit && 'flex max-w-2xl flex-col items-start gap-5 lg:max-w-md',
            !isSplit && 'flex max-w-3xl flex-col items-start gap-5',
            action && isSplit && 'lg:items-end',
            asideClassName
          )}
        >
          {subheadline}
          {action && <div className={actionClassName}>{action}</div>}
        </div>
      )}
    </div>
  )
}
