import { clsx } from 'clsx/lite'
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Template } from 'tinacms'
import { tinaField } from 'tinacms/dist/react'
import { Container } from '../elements/container'
import { FacebookIcon } from '../icons/social/facebook-icon'
import { InstagramIcon } from '../icons/social/instagram-icon'
import { XIcon } from '../icons/social/x-icon'
import { YouTubeIcon } from '../icons/social/youtube-icon'
import { OfficeLocations } from '../shared/office-locations'
import { Section, SectionBorder, SectionDividerLines } from '../shared/section'
import { SocialLink } from '../shared/footer-with-links-and-social-icons'
import { siteConfig } from '@/lib/site-config'
import type { SocialPlatform } from '@/lib/social-links'
import type { BlockDoc } from './block-doc'

type TinaContentSource = {
  _content_source?: {
    queryId: string
    path: Array<number | string>
  }
}

export type ContactInfoWithFormData = TinaContentSource & {
  showTopBorder?: boolean | null
  formHeading?: string | null
  locationsHeading?: string | null
  locationsIntro?: string | null
  contactHeading?: string | null
  socialHeading?: string | null
}

const socialLinkIcons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
  x: XIcon,
} satisfies Record<SocialPlatform, typeof InstagramIcon>

export function ContactInfoWithFormBlock({
  data,
}: {
  data: ContactInfoWithFormData
}) {
  const { contactFormEmbedUrl, email, phone } = siteConfig.contact
  const hasLocations = siteConfig.locations.length > 0
  const hasPhone = Boolean(phone.href && phone.display)
  const hasEmail = Boolean(email)
  const hasContactMethods = hasPhone || hasEmail
  const hasSocialLinks = siteConfig.socialLinks.length > 0
  const hasSidebar = hasLocations || hasContactMethods || hasSocialLinks

  return (
    <Section>
      <SectionBorder
        top={data.showTopBorder === false ? 'top-0' : 'top-[2px]'}
      />
      <Container>
        {data.showTopBorder === false ? null : <SectionDividerLines />}
        <div
          className={clsx(
            'grid grid-cols-1 gap-y-16 pt-12 pb-10 lg:grid-cols-2 lg:py-0',
            !hasSidebar && 'lg:grid-cols-1'
          )}
        >
          <div
            className={clsx(
              hasSidebar && 'lg:order-last lg:py-16 lg:pl-12',
              !hasSidebar && 'lg:py-16'
            )}
          >
            {data.formHeading ? (
              <h2
                className='text-base font-medium text-olive-950'
                data-tina-field={tinaField(data, 'formHeading')}
              >
                {data.formHeading}
              </h2>
            ) : null}
            <div className='mt-4.5 w-full overflow-hidden rounded-2xl bg-white p-[1.5px] shadow-[0_0_0_1px_rgba(0,0,0,0.12),inset_0_0_0_4px_rgba(255,255,255,1),0_2px_4px_0_rgba(0,0,0,0.04)]'>
              {contactFormEmbedUrl ? (
                <iframe
                  title='Contact form'
                  src={contactFormEmbedUrl}
                  className='block h-[620px] w-full rounded-[15px] bg-primary-100/45 sm:h-[720px]'
                />
              ) : (
                <div className='h-[620px] w-full rounded-[15px] bg-primary-100/45 sm:h-[720px]' />
              )}
            </div>
          </div>

          {hasSidebar ? (
            <>
              <div className='lg:hidden'>
                <SectionDividerLines />
              </div>

              <div className='flex flex-col gap-10 lg:border-r lg:border-olive-950/7 lg:py-16 lg:pr-12'>
                {hasLocations ? (
                  <SidebarSection separated={false}>
                    <OfficeLocations
                      title={data.locationsHeading}
                      description={data.locationsIntro}
                      titleField={tinaField(data, 'locationsHeading')}
                      descriptionField={tinaField(data, 'locationsIntro')}
                    />
                  </SidebarSection>
                ) : null}

                {hasContactMethods ? (
                  <SidebarSection separated={hasLocations}>
                    {data.contactHeading ? (
                      <h2
                        className='text-base font-medium text-olive-950'
                        data-tina-field={tinaField(data, 'contactHeading')}
                      >
                        {data.contactHeading}
                      </h2>
                    ) : null}
                    <dl className='mt-6 grid grid-cols-1 gap-6 text-sm/6 sm:grid-cols-2'>
                      {hasPhone ? (
                        <div>
                          <dt className='font-[550] text-olive-950'>Phone</dt>
                          <dd>
                            <Link
                              href={phone.href}
                              className='text-olive-700 transition-colors hover:text-primary-600'
                            >
                              {phone.display}
                            </Link>
                          </dd>
                        </div>
                      ) : null}
                      {hasEmail ? (
                        <div>
                          <dt className='font-[550] text-olive-950'>Email</dt>
                          <dd>
                            <Link
                              href={`mailto:${email}`}
                              className='text-olive-700 transition-colors hover:text-primary-600'
                            >
                              {email}
                            </Link>
                          </dd>
                        </div>
                      ) : null}
                    </dl>
                  </SidebarSection>
                ) : null}

                {hasSocialLinks ? (
                  <SidebarSection separated={hasLocations || hasContactMethods}>
                    {data.socialHeading ? (
                      <h2
                        className='text-base font-medium text-olive-950'
                        data-tina-field={tinaField(data, 'socialHeading')}
                      >
                        {data.socialHeading}
                      </h2>
                    ) : null}
                    <div className='mt-6 flex items-center gap-4'>
                      {siteConfig.socialLinks.map(
                        ({ platform, name, href }) => {
                          const Icon = socialLinkIcons[platform]

                          return (
                            <SocialLink
                              key={`${platform}-${href}`}
                              href={href}
                              name={name}
                            >
                              <Icon />
                            </SocialLink>
                          )
                        }
                      )}
                    </div>
                  </SidebarSection>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </Container>
    </Section>
  )
}

export const contactInfoWithFormBlockDoc = {
  category: 'contact',
  description:
    'Contact section that combines an embedded contact form with locations, phone/email, and social links from site config. Use it on contact pages rather than duplicating contact details in custom content.',
  contentNotes: [
    'Form URL, locations, phone, email, and social links come from site config.',
    'Block fields only control headings and intro text around configured contact data.',
  ],
} satisfies BlockDoc

function SidebarSection({
  children,
  separated,
}: {
  children: ReactNode
  separated: boolean
}) {
  return (
    <div
      className={clsx(
        separated &&
          'relative pt-10 before:absolute before:top-0 before:left-1/2 before:h-px before:w-screen before:-translate-x-1/2 before:bg-olive-950/7 after:absolute after:top-px after:left-1/2 after:h-px after:w-screen after:-translate-x-1/2 after:bg-white lg:-mr-12 lg:pr-12 lg:before:right-0 lg:before:left-auto lg:before:w-[calc(min(50vw,48rem)-2px)] lg:before:translate-x-0 lg:after:right-0 lg:after:left-auto lg:after:w-[calc(min(50vw,48rem)-2px)] lg:after:translate-x-0'
      )}
    >
      {children}
    </div>
  )
}

export const contactInfoWithFormBlockSchema: Template = {
  name: 'contactInfoWithForm',
  label: 'Contact Info With Form',
  ui: {
    previewSrc: '/block-previews/contact-info-with-form.png',
    defaultItem: {
      showTopBorder: true,
      formHeading: 'Send us a message',
      locationsHeading: 'Service areas',
      locationsIntro:
        'Tell us what is going on and we will help you find the next practical step.',
      contactHeading: 'Get in touch',
      socialHeading: 'Follow us',
    },
  },
  fields: [
    {
      type: 'boolean',
      label: 'Show Top Border',
      name: 'showTopBorder',
    },
    {
      type: 'string',
      label: 'Form Heading',
      name: 'formHeading',
    },
    {
      type: 'string',
      label: 'Locations Heading',
      name: 'locationsHeading',
    },
    {
      type: 'string',
      label: 'Locations Intro',
      name: 'locationsIntro',
      ui: {
        component: 'textarea',
      },
    },
    {
      type: 'string',
      label: 'Contact Heading',
      name: 'contactHeading',
    },
    {
      type: 'string',
      label: 'Social Heading',
      name: 'socialHeading',
    },
  ],
}
