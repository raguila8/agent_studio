import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Main } from '@/components/elements/main'
import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { SectionBorder, SectionDividerLines } from '@/components/shared/section'
import {
  MobileNavAccordion,
  MobileNavLink,
  NavbarDropdown,
  NavbarDropdownLink,
  NavbarLink,
  NavbarLogo,
  NavbarWithLogoActionsAndCenteredLinks,
} from '@/components/shared/navbar-with-logo-actions-and-centered-links'
import {
  FooterCategory,
  FooterLink,
  FooterWithLinkCategories,
} from '@/components/shared/footer-with-link-categories'

import { InstagramIcon } from '@/components/icons/social/instagram-icon'
import { FacebookIcon } from '@/components/icons/social/facebook-icon'
import { YouTubeIcon } from '@/components/icons/social/youtube-icon'
import { XIcon } from '@/components/icons/social/x-icon'
import { ChevronDownIcon } from '@/components/icons/chevron-down-icon'
import { navigationConfig } from '@/lib/navigation'
import { siteConfig } from '@/lib/site-config'
import type { SocialPlatform } from '@/lib/social-links'
import { IconPhoneOutlineDuo18 } from 'nucleo-ui-outline-duo-18'

const socialLinkIcons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
  x: XIcon,
} satisfies Record<SocialPlatform, typeof InstagramIcon>

const mobileDropdownLinkClass =
  'rounded-lg px-3 py-1.5 text-[15px]/6 font-[450] text-olive-800 hover:bg-olive-200/45'

export function SiteFrame({ children }: { children: ReactNode }) {
  const hasLogoImage =
    siteConfig.logo.src &&
    siteConfig.logo.width > 0 &&
    siteConfig.logo.height > 0

  return (
    <div>
      <NavbarWithLogoActionsAndCenteredLinks
        id='navbar'
        className='border-b border-olive-950/7'
        links={
          <>
            {navigationConfig.header.links.map((item, itemIndex) =>
              item.type === 'dropdown' ? (
                <NavbarDropdown
                  key={`${item.label}-${itemIndex}`}
                  trigger={
                    <>
                      {item.label}{' '}
                      <ChevronDownIcon className='size-4 text-olive-600 transition-transform duration-200 group-aria-expanded:rotate-180' />
                    </>
                  }
                >
                  <div className='grid grid-cols-2 gap-1 lg:max-w-3xl'>
                    {item.items.map((dropdownItem, dropdownItemIndex) => (
                      <NavbarDropdownLink
                        key={`${item.label}-${dropdownItem.href}-${dropdownItemIndex}`}
                        href={dropdownItem.href}
                        description={dropdownItem.description}
                      >
                        {dropdownItem.label}
                      </NavbarDropdownLink>
                    ))}
                  </div>
                </NavbarDropdown>
              ) : (
                <NavbarLink
                  key={`${item.label}-${item.href}-${itemIndex}`}
                  href={item.href}
                >
                  {item.label}
                </NavbarLink>
              )
            )}
          </>
        }
        mobileLinks={
          <>
            {navigationConfig.header.links.map((item, itemIndex) =>
              item.type === 'dropdown' ? (
                <MobileNavAccordion
                  key={`${item.label}-${itemIndex}`}
                  label={item.label}
                >
                  {item.items.map((dropdownItem, dropdownItemIndex) => (
                    <Link
                      key={`${item.label}-${dropdownItem.href}-${dropdownItemIndex}`}
                      href={dropdownItem.href}
                      className={mobileDropdownLinkClass}
                    >
                      {dropdownItem.label}
                    </Link>
                  ))}
                </MobileNavAccordion>
              ) : (
                <MobileNavLink
                  key={`${item.label}-${item.href}-${itemIndex}`}
                  href={item.href}
                >
                  {item.label}
                </MobileNavLink>
              )
            )}
          </>
        }
        logo={
          <NavbarLogo href='/' className='flex items-center'>
            {hasLogoImage ? (
              <Image
                src={siteConfig.logo.src}
                alt={siteConfig.name}
                width={siteConfig.logo.width}
                height={siteConfig.logo.height}
                className='h-11 w-auto max-w-52 object-contain md:h-9.5 md:max-w-44 lg:h-11 lg:max-w-52'
                priority
              />
            ) : (
              <span className='text-base font-semibold tracking-wider text-olive-700'>
                {siteConfig.name}
              </span>
            )}
          </NavbarLogo>
        }
        actions={
          <>
            {navigationConfig.header.actions.secondary ? (
              <PlainButtonLink
                href={navigationConfig.header.actions.secondary.href}
                color='primary'
                className='max-sm:hidden md:hidden lg:block'
              >
                {navigationConfig.header.actions.secondary.label}
              </PlainButtonLink>
            ) : null}
            {navigationConfig.header.actions.primary ? (
              <ButtonLink
                href={navigationConfig.header.actions.primary.href}
                color='primary'
              >
                {navigationConfig.header.actions.primary.label}
              </ButtonLink>
            ) : null}
          </>
        }
        mobileMenuHeader={
          <Link
            href={siteConfig.contact.phone.href}
            className='inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-primary-300/20 px-4 py-1.5 text-sm/5 font-medium text-primary-600 transition duration-100 ease-linear hover:bg-primary-300/35 sm:hidden'
          >
            <IconPhoneOutlineDuo18
              title=''
              aria-hidden='true'
              className='size-4.5 shrink-0 duotone-primary'
            />
            {siteConfig.contact.phone.display}
          </Link>
        }
      />

      <Main>{children}</Main>

      <div className='relative mx-auto w-full max-w-screen-2xl'>
        <SectionDividerLines />
        <SectionBorder top='top-[2px]' />
        <FooterWithLinkCategories
          id='footer'
          links={
            <>
              {navigationConfig.footer.groups.map((group, groupIndex) => (
                <FooterCategory
                  key={`${group.title}-${groupIndex}`}
                  title={group.title}
                >
                  {group.links.map((link, linkIndex) => (
                    <FooterLink
                      key={`${group.title}-${link.href}-${linkIndex}`}
                      href={link.href}
                    >
                      {link.label}
                    </FooterLink>
                  ))}
                </FooterCategory>
              ))}
              {navigationConfig.footer.showSocialLinks &&
                siteConfig.socialLinks.length > 0 && (
                  <FooterCategory title='Connect'>
                    {siteConfig.socialLinks.map(({ platform, name, href }) => {
                      const Icon = socialLinkIcons[platform]

                      return (
                        <FooterLink key={`${platform}-${href}`} href={href}>
                          <span className='inline-flex items-center gap-2'>
                            <Icon className='size-4' aria-hidden='true' />
                            {name}
                          </span>
                        </FooterLink>
                      )
                    })}
                  </FooterCategory>
                )}
            </>
          }
          fineprint={`© ${new Date().getFullYear()} ${siteConfig.name}`}
        />
      </div>
    </div>
  )
}
