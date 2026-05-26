import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

export function Eyebrow({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={clsx('text-sm/7 font-[550] text-olive-700', className)}
      {...props}
    >
      {children}
    </div>
  )
}
