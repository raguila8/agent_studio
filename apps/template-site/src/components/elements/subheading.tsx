import { clsx } from 'clsx/lite'
import { type ComponentProps } from 'react'

export function Subheading({
  children,
  className,
  ...props
}: ComponentProps<'h2'>) {
  return (
    <h2
      className={clsx(
        'font-display text-[38px]/10 tracking-tight text-pretty text-olive-950 sm:text-5xl/14',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}
