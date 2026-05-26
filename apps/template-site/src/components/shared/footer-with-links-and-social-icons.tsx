import Link from 'next/link'
import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { Container } from '../elements/container'

export function FooterLink({
  href,
  className,
  ...props
}: {
  href: ComponentProps<typeof Link>['href']
} & Omit<ComponentProps<typeof Link>, 'href'>) {
  return (
    <li className={clsx('text-olive-700', className)}>
      <Link href={href} {...props} />
    </li>
  )
}

export function SocialLink({
  href,
  name,
  className,
  ...props
}: {
  href: string
  name: string
} & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <a
      href={href}
      target='_blank'
      aria-label={name}
      className={clsx(
        'text-olive-700 transition duration-200 ease-in-out *:size-6 hover:text-olive-900',
        className
      )}
      {...props}
    />
  )
}

export function FooterWithLinksAndSocialIcons({
  links,
  socialLinks,
  fineprint,
  className,
  ...props
}: {
  links: ReactNode
  socialLinks?: ReactNode
  fineprint: ReactNode
} & ComponentProps<'footer'>) {
  return (
    <footer className={clsx('pt-16', className)} {...props}>
      <div className='py-16 text-olive-950'>
        <Container className='flex flex-col gap-10 text-center text-sm/7'>
          <div className='flex flex-col gap-6'>
            <nav>
              <ul className='flex flex-wrap items-center justify-center gap-x-10 gap-y-2'>
                {links}
              </ul>
            </nav>
            {socialLinks && (
              <div className='flex items-center justify-center gap-10'>
                {socialLinks}
              </div>
            )}
          </div>
          <div className='text-olive-600'>{fineprint}</div>
        </Container>
      </div>
    </footer>
  )
}
