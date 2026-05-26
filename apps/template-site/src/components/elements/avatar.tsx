import { clsx } from 'clsx/lite'
import Image from 'next/image'
import Link from 'next/link'
import type { ComponentProps } from 'react'

type AvatarProps = {
  src: string
  alt: string
  href?: string
  className?: string
}

const baseWrapperClasses = clsx(
  'group inline-flex size-7.5 shrink-0 items-center justify-center rounded-[10px] border border-white bg-olive-200 backdrop-blur-sm',
  'shadow-[0_2px_4px_0_rgba(0,0,0,0.04),0_1px_2px_-1px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.08)]',
  'transition-all duration-200 ease-in-out'
)

const hoverWrapperClasses =
  'hover:bg-olive-200/60 hover:shadow-[0_2px_4px_0_rgba(0,0,0,0.04),0_1px_2px_-1px_rgba(0,0,0,0.08),0_0_0_1.5px_--alpha(var(--color-primary-500)/45%)]'

function AvatarBadge({
  src,
  alt,
  className,
  interactive,
}: Omit<AvatarProps, 'href'> & { interactive?: boolean }) {
  return (
    <div
      className={clsx(
        baseWrapperClasses,
        interactive && hoverWrapperClasses,
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={18}
        height={18}
        className='size-6 shrink-0 rounded-[7px] object-cover outline-[0.5px] -outline-offset-[0.5px] outline-black/8'
      />
    </div>
  )
}

export function Avatar({ src, alt, href, className }: AvatarProps) {
  if (href) {
    const isExternal = /^https?:\/\//.test(href)
    const linkProps: ComponentProps<typeof Link> = {
      href,
      ...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {}),
    }
    return (
      <Link {...linkProps}>
        <AvatarBadge src={src} alt={alt} className={className} interactive />
      </Link>
    )
  }

  return <AvatarBadge src={src} alt={alt} className={className} />
}
