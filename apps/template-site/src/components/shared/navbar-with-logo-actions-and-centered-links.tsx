'use client'

import { ElDialog, ElDialogPanel } from '@tailwindplus/elements/react'
import { clsx } from 'clsx/lite'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import type { ComponentProps, ReactNode } from 'react'
import { useRef, useState } from 'react'
import { Container } from '@/components/elements/container'
import {
  Section,
  SectionBorder,
  SectionDividerLines,
} from '@/components/shared/section'
import { siteConfig } from '@/lib/site-config'

const isPurpleTheme = siteConfig.theme.primaryColor === 'purple'
const navbarBackground = isPurpleTheme
  ? 'bg-mauve-100/95 backdrop-blur-lg'
  : siteConfig.theme.primaryColor === 'brown'
    ? 'bg-taupe-100'
    : 'bg-olive-100'

export function NavbarLink({
  children,
  className,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      className={clsx(
        'group inline-flex items-center justify-between gap-1.5 text-3xl/10 font-medium text-olive-950 md:text-sm/7',
        className
      )}
      {...props}
    >
      {children}
      <span
        className='inline-flex p-1.5 opacity-0 group-hover:opacity-100 md:hidden'
        aria-hidden='true'
      >
        <svg
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='m8.25 4.5 7.5 7.5-7.5 7.5'
          />
        </svg>
      </span>
    </Link>
  )
}

export function NavbarDropdown({
  trigger,
  children,
  className,
}: {
  trigger: ReactNode
  children: ReactNode
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  function handleEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  function handleLeave() {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  return (
    <div
      className={clsx('relative', className)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type='button'
        className='group inline-flex cursor-pointer items-center gap-1.5 text-sm/7 font-medium text-olive-950'
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {trigger}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={clsx(
              'fixed inset-x-0 top-(--scroll-padding-top) z-20 overflow-hidden border-b border-olive-950/7',
              navbarBackground
            )}
          >
            <SectionDividerLines />
            <Section>
              <div className='border-x border-olive-950/7 py-6'>
                <Container>{children}</Container>
              </div>
            </Section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function NavbarDropdownLink({
  children,
  description,
  className,
  ...props
}: { description?: string } & ComponentProps<typeof Link>) {
  return (
    <Link
      className={clsx(
        'block rounded-lg px-3 py-2 transition-colors duration-200',
        isPurpleTheme ? 'hover:bg-olive-200/95' : 'hover:bg-olive-200/55',
        className
      )}
      {...props}
    >
      <span className='text-sm/6 font-medium text-olive-800'>{children}</span>
      {description && (
        <span className='block text-sm/6 text-olive-600'>{description}</span>
      )}
    </Link>
  )
}

export function MobileNavLink({
  children,
  className,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <div className={clsx('border-t border-olive-950/7', className)}>
      <Link
        className='group flex w-full items-center justify-between border-t border-white px-6 py-4 text-base/7 font-medium text-olive-950'
        {...props}
      >
        <span>{children}</span>
        <svg
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-4 text-olive-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='m8.25 4.5 7.5 7.5-7.5 7.5'
          />
        </svg>
      </Link>
    </div>
  )
}

export function MobileNavAccordion({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={clsx(
        'border-t border-olive-950/7',
        open && 'bg-white/40',
        className
      )}
    >
      <button
        type='button'
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className='flex w-full cursor-pointer items-center justify-between border-t border-white px-6 py-4 text-left text-base/7 font-medium text-olive-950'
      >
        <span>{label}</span>
        <motion.svg
          width={13}
          height={13}
          viewBox='0 0 13 13'
          fill='none'
          stroke='currentColor'
          strokeWidth={1}
          className='size-3.5 text-olive-400'
          aria-hidden='true'
        >
          <path d='M12.5 6.5H0.5' strokeLinecap='round' />
          <motion.path
            d='M6.5 0.5V12.5'
            strokeLinecap='round'
            animate={{ rotate: open ? 90 : 0 }}
            style={{ transformOrigin: '6.5px 6.5px' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className='overflow-hidden'
          >
            <div className='flex flex-col gap-1 px-6 pb-5'>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function NavbarLogo({
  className,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link {...props} className={clsx('inline-flex items-stretch', className)} />
  )
}

export function NavbarWithLogoActionsAndCenteredLinks({
  links,
  mobileLinks,
  logo,
  actions,
  mobileMenuHeader,
  className,
  ...props
}: {
  links: ReactNode
  mobileLinks?: ReactNode
  logo: ReactNode
  actions: ReactNode
  mobileMenuHeader?: ReactNode
} & ComponentProps<'header'>) {
  return (
    <header
      className={clsx('sticky top-0 z-10', navbarBackground, className)}
      {...props}
    >
      <style>{`:root { --scroll-padding-top: 5.25rem }`}</style>
      <Section>
        <nav>
          <div className='mx-auto flex h-(--scroll-padding-top) max-w-7xl items-center gap-4 px-6 md:px-10'>
            <SectionBorder />
            <div className='flex flex-1 items-center'>{logo}</div>
            <div className='flex max-md:hidden md:ml-4 md:gap-6 lg:ml-0 lg:gap-8'>
              {links}
            </div>
            <div className='flex flex-1 items-center justify-end gap-4'>
              <div className='flex shrink-0 items-center gap-2'>{actions}</div>

              <button
                command='show-modal'
                commandfor='mobile-menu'
                aria-label='Toggle menu'
                className='inline-flex cursor-pointer rounded-full p-1.5 text-olive-950 hover:bg-olive-950/10 md:hidden'
              >
                <svg viewBox='0 0 24 24' fill='currentColor' className='size-6'>
                  <path
                    fillRule='evenodd'
                    d='M3.748 8.248a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75ZM3.748 15.75a.75.75 0 0 1 .75-.751h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>
          </div>

          <ElDialog className='md:hidden'>
            <dialog id='mobile-menu' className='backdrop:bg-transparent'>
              <ElDialogPanel
                className={clsx('fixed inset-0 py-6', navbarBackground)}
              >
                <div className='flex items-center justify-between px-6'>
                  <div className='flex items-center'>{mobileMenuHeader}</div>
                  <button
                    command='close'
                    commandfor='mobile-menu'
                    aria-label='Toggle menu'
                    className='inline-flex cursor-pointer rounded-full p-1.5 text-olive-950 hover:bg-olive-950/10'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-6'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M6 18 18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>
                <div className='mt-6'>
                  {mobileLinks ?? links}
                  <div className='border-t border-olive-950/7'>
                    <div className='border-t border-white' />
                  </div>
                </div>
              </ElDialogPanel>
            </dialog>
          </ElDialog>
        </nav>
      </Section>
    </header>
  )
}
