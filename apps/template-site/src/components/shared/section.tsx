import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

export type SectionSize = 'default' | 'narrow' | 'wide' | 'full'

export const defaultSectionSize: SectionSize = 'default'

export const sectionSizeClasses: Record<SectionSize, string> = {
  default: 'relative mx-auto w-full max-w-[1536px]',
  narrow: 'relative mx-auto w-full max-w-7xl',
  wide: 'relative mx-auto w-full max-w-[1600px]',
  full: 'relative w-full',
}

export const sectionSizeOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Narrow', value: 'narrow' },
  { label: 'Wide', value: 'wide' },
  { label: 'Full Width', value: 'full' },
] as const satisfies ReadonlyArray<{ label: string; value: SectionSize }>

export function sectionSizeField({
  name = 'sectionSize',
  label = 'Section Width',
}: {
  name?: string
  label?: string
} = {}) {
  return {
    type: 'string',
    name,
    label,
    options: sectionSizeOptions.map((option) => ({
      label: option.label,
      value: option.value,
    })),
  } as const
}

export function Section({
  children,
  className,
  size = defaultSectionSize,
  ...props
}: ComponentProps<'section'> & { size?: SectionSize }) {
  return (
    <section
      className={clsx(
        sectionSizeClasses[size] ?? sectionSizeClasses[defaultSectionSize],
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

export function SectionBorder({
  className,
  top = 'top-0',
  bottom = 'bottom-0',
  ...props
}: ComponentProps<'div'> & {
  top?: string
  bottom?: string
}) {
  return (
    <div
      className={clsx(
        'pointer-events-none absolute inset-x-0 z-10 mx-auto w-full border-x border-olive-950/7',
        top,
        bottom,
        className
      )}
      aria-hidden='true'
      {...props}
    />
  )
}

export function SectionDividerLine({
  color = 'olive',
  className,
  ...props
}: ComponentProps<'div'> & {
  color?: 'olive' | 'white'
}) {
  return (
    <div
      className={clsx(
        'relative left-1/2 w-screen -translate-x-1/2 border-t',
        color === 'olive' && 'border-olive-950/7',
        color === 'white' && 'border-white',
        className
      )}
      {...props}
    />
  )
}

export function SectionDividerLines() {
  return (
    <>
      <SectionDividerLine />
      <SectionDividerLine color='white' />
    </>
  )
}
