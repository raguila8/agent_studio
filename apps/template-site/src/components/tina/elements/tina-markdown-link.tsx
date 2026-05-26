import Link from 'next/link'
import { clsx } from 'clsx/lite'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

type TinaMarkdownLinkProps = {
  url?: string
  href?: string
  children?: ReactNode
  className?: string
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'>

function hasScheme(href: string) {
  return /^[a-z][a-z0-9+.-]*:/i.test(href)
}

function isExternalWebHref(href: string) {
  return /^https?:\/\//i.test(href) || href.startsWith('//')
}

export function TinaMarkdownLink({
  url,
  href,
  children,
  className,
  target,
  rel,
  ...props
}: TinaMarkdownLinkProps = {}) {
  const linkHref = url ?? href ?? '#'

  if (
    linkHref.startsWith('#') ||
    hasScheme(linkHref) ||
    linkHref.startsWith('//')
  ) {
    const opensNewTab = isExternalWebHref(linkHref)

    return (
      <a
        href={linkHref}
        target={target ?? (opensNewTab ? '_blank' : undefined)}
        rel={rel ?? (opensNewTab ? 'noopener noreferrer' : undefined)}
        className={className}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={linkHref} className={clsx(className)} {...props}>
      {children}
    </Link>
  )
}
