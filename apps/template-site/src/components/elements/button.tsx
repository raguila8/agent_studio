import Link from 'next/link'
import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

const sizes = {
  md: 'px-3.5 py-1',
  lg: 'px-5 py-2',
}

const baseStyles = {
  default:
    'inline-flex shrink-0 items-center justify-center gap-1 rounded-full text-sm/7 font-medium',
  plain:
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-sm/7 font-medium',
} as const

export const primaryButtonStyles =
  '[--button-accent-overlay:rgb(255_255_255_/_0)] bg-[linear-gradient(var(--button-accent-overlay),var(--button-accent-overlay)),linear-gradient(180deg,var(--color-primary-400)_0,var(--color-primary-500)_100%)] text-white shadow-[inset_0_1px_.5px_0_hsla(0,0%,100%,.13),0_1px_1px_0_rgba(140,54,0,.2),0_2px_4px_-2px_rgba(140,54,0,.4),0_1px_5px_-2px_rgba(140,54,0,.4),0_0_0_1px_var(--color-primary-500)] [transition:--button-accent-overlay_.2s_ease-out,box-shadow_.15s_ease-out,opacity_.2s_ease-out] hover:[--button-accent-overlay:hsla(0,0%,100%,.1)] hover:shadow-[inset_0_1px_.5px_0_hsla(0,0%,100%,.13),0_1px_1px_0_rgba(140,54,0,.4),0_2px_4px_-2px_rgba(140,54,0,.5),0_1px_5px_-2px_rgba(140,54,0,.6),0_0_0_1px_var(--color-primary-500)]'

const solidColors = {
  light: 'hover bg-white text-olive-950 hover:bg-olive-100',
  primary:
    "relative isolate overflow-hidden text-white [transition:box-shadow_.15s_ease-out,opacity_.2s_ease-out] before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-[linear-gradient(180deg,var(--color-primary-400)_0,var(--color-primary-500)_100%)] before:content-[''] after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:bg-[rgba(255,255,255,.1)] after:opacity-0 after:transition-opacity after:duration-200 after:ease-out after:content-[''] hover:after:opacity-100",
  'primary-light':
    'relative isolate overflow-hidden text-primary-800 bg-[linear-gradient(var(--button-accent-light-overlay),var(--button-accent-light-overlay)),linear-gradient(180deg,var(--color-primary-400)_0,var(--color-primary-600)_100%)] [transition:--button-accent-light-overlay_.2s_ease-out,box-shadow_.15s_ease-out,opacity_.2s_ease-out,color_.2s_ease-out] hover:[--button-accent-light-overlay:hsla(0,0%,100%,.2)] hover:text-white',
} as const

const variants = {
  solid: {
    base: baseStyles.default,
    colors: {
      'dark/light': 'bg-mist-600 text-white hover:bg-mist-700',
      ...solidColors,
    },
  },
  solidLink: {
    base: baseStyles.default,
    colors: {
      'dark/light': 'bg-mist-500 text-white hover:bg-mist-600',
      ...solidColors,
    },
  },
  soft: {
    base: baseStyles.default,
    colors: {
      default: 'bg-olive-950/10 text-olive-950 hover:bg-olive-950/15',
    },
  },
  plain: {
    base: baseStyles.plain,
    colors: {
      'dark/light': 'text-olive-950 hover:bg-olive-950/10',
      light: 'text-white hover:bg-white/18',
      primary:
        'text-primary-700 hover:bg-primary-500/14 duration-200 ease-in-out',
    },
  },
} as const

type LinkHref = ComponentProps<typeof Link>['href']
type ButtonSize = keyof typeof sizes
type ButtonVariant = keyof typeof variants
type ButtonColor<T extends ButtonVariant> = keyof (typeof variants)[T]['colors']
type SolidButtonColor = Exclude<ButtonColor<'solid'>, 'primary-light'>
type SolidButtonLinkColor = ButtonColor<'solidLink'>
type PlainButtonColor = ButtonColor<'plain'>

function buttonClassName<T extends ButtonVariant>({
  variant,
  size,
  color,
  className,
}: {
  variant: T
  size: ButtonSize
  color: ButtonColor<T>
  className?: string
}) {
  const styles = variants[variant]
  const colors: Readonly<Record<string, string>> = styles.colors

  return clsx(styles.base, colors[String(color)], sizes[size], className)
}

export function Button({
  size = 'md',
  type = 'button',
  color = 'dark/light',
  className,
  ...props
}: {
  size?: ButtonSize
  color?: SolidButtonColor
} & ComponentProps<'button'>) {
  return (
    <button
      type={type}
      className={buttonClassName({
        variant: 'solid',
        size,
        color,
        className,
      })}
      {...props}
    />
  )
}

export function ButtonLink({
  size = 'md',
  color = 'dark/light',
  className,
  href,
  ...props
}: {
  href: LinkHref
  size?: ButtonSize
  color?: SolidButtonLinkColor
} & Omit<ComponentProps<typeof Link>, 'color' | 'href'>) {
  return (
    <Link
      href={href}
      className={buttonClassName({
        variant: 'solidLink',
        size,
        color,
        className,
      })}
      {...props}
    />
  )
}

export function SoftButton({
  size = 'md',
  type = 'button',
  className,
  ...props
}: {
  size?: ButtonSize
} & ComponentProps<'button'>) {
  return (
    <button
      type={type}
      className={buttonClassName({
        variant: 'soft',
        size,
        color: 'default',
        className,
      })}
      {...props}
    />
  )
}

export function SoftButtonLink({
  size = 'md',
  href,
  className,
  ...props
}: {
  href: LinkHref
  size?: ButtonSize
} & Omit<ComponentProps<typeof Link>, 'href'>) {
  return (
    <Link
      href={href}
      className={buttonClassName({
        variant: 'soft',
        size,
        color: 'default',
        className,
      })}
      {...props}
    />
  )
}

export function PlainButton({
  size = 'md',
  color = 'dark/light',
  type = 'button',
  className,
  ...props
}: {
  size?: ButtonSize
  color?: PlainButtonColor
} & ComponentProps<'button'>) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant: 'plain', size, color, className })}
      {...props}
    />
  )
}

export function PlainButtonLink({
  size = 'md',
  color = 'dark/light',
  href,
  className,
  ...props
}: {
  href: LinkHref
  size?: ButtonSize
  color?: PlainButtonColor
} & Omit<ComponentProps<typeof Link>, 'color' | 'href'>) {
  return (
    <Link
      href={href}
      className={buttonClassName({ variant: 'plain', size, color, className })}
      {...props}
    />
  )
}
