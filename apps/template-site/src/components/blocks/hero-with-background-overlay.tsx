import type { Template } from 'tinacms'
import { PageBlocksHeroWithBackgroundOverlay } from '../../../tina/__generated__/types'
import { tinaField } from 'tinacms/dist/react'
import { Container } from '../elements/container'
import {
  Section,
  SectionBorder,
  defaultSectionSize,
  sectionSizeField,
  type SectionSize,
} from '../shared/section'
import { Heading } from '../elements/heading'
import { Wallpaper } from '../elements/wallpaper'
import { TinaAnnouncementBadge } from '../tina/elements/tina-announcement-badge'
import { announcementBadgeField } from '../tina/fields/announcement-badge'
import {
  ButtonLink,
  SoftButtonLink,
  PlainButtonLink,
} from '@/components/elements/button'
import { imageSrcOrFallback } from '@/lib/images'
import type { BlockDoc } from './block-doc'

import heroImage from '@/images/block-fallbacks/hero-background-home-services.jpg'

type HeroWithBackgroundOverlayData = PageBlocksHeroWithBackgroundOverlay & {
  sectionSize?: SectionSize | null
}

export function HeroWithBackgroundOverlay({
  data,
}: {
  data: HeroWithBackgroundOverlayData
}) {
  return (
    <Section size={data.sectionSize ?? defaultSectionSize}>
      <div
        className='pointer-events-none absolute inset-0 z-10 ring-8 ring-white/30 ring-inset'
        aria-hidden='true'
      />
      <SectionBorder />
      <Wallpaper
        color='dark'
        overlayImage={imageSrcOrFallback(data.image?.src, heroImage)}
        style={{
          maskImage:
            'radial-gradient(ellipse 95% 90% at center, black 70%, transparent 100%)',
        }}
        data-tina-field={tinaField(data, 'image')}
      >
        <Container className='flex flex-col gap-16'>
          <div className='flex flex-col'>
            <div className='flex shrink-0 flex-col items-start gap-6 pt-16 pb-16 sm:pt-32 sm:pb-24 lg:py-40'>
              <TinaAnnouncementBadge
                data={data.eyebrow}
                tinaFieldName={tinaField(data, 'eyebrow')}
              />
              <Heading
                className='max-w-5xl'
                color='light'
                data-tina-field={tinaField(data, 'headline')}
              >
                {data.headline}
              </Heading>
              <div
                className='flex max-w-3xl flex-col gap-4 text-lg/8 text-olive-50/95'
                data-tina-field={tinaField(data, 'subheadline')}
              >
                {data.subheadline}
              </div>
              {data.action && (
                <div data-tina-field={tinaField(data, 'action')}>
                  {data.action.style === 'soft' ? (
                    <SoftButtonLink
                      href={data.action.link ?? '#'}
                      size={(data.action.size as 'md' | 'lg') ?? 'md'}
                    >
                      {data.action.label}
                    </SoftButtonLink>
                  ) : data.action.style === 'plain' ? (
                    <PlainButtonLink
                      href={data.action.link ?? '#'}
                      size={(data.action.size as 'md' | 'lg') ?? 'md'}
                      color={
                        (data.action.color as
                          | 'dark/light'
                          | 'light'
                          | 'primary') ?? 'dark/light'
                      }
                    >
                      {data.action.label}
                    </PlainButtonLink>
                  ) : (
                    <ButtonLink
                      href={data.action.link ?? '#'}
                      className='font-[550]!'
                      size={(data.action.size as 'md' | 'lg') ?? 'md'}
                      color={
                        (data.action.color as
                          | 'dark/light'
                          | 'light'
                          | 'primary'
                          | 'primary-light') ?? 'dark/light'
                      }
                    >
                      {data.action.label}
                    </ButtonLink>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Wallpaper>
    </Section>
  )
}

export const heroWithBackgroundOverlayBlockDoc = {
  category: 'hero_intro',
  description:
    'Full-width hero with dark wallpaper styling, background image treatment, announcement badge, headline, subheadline, and a single action. Choose it for a high-impact homepage or landing page opener.',
  contentNotes: [
    'Use a background image that stays readable under the overlay.',
    'Best for one primary CTA, not a long button group.',
    'Verify ratings, review counts, service areas, and licensing claims before publishing.',
  ],
} satisfies BlockDoc

export const heroWithBackgroundOverlayBlockSchema: Template = {
  name: 'heroWithBackgroundOverlay',
  label: 'Hero with Background Overlay',
  ui: {
    previewSrc: '/block-previews/hero-with-bg-overlay.png',
    defaultItem: {
      eyebrow: {
        text: 'Rated five stars by 100+ clients',
        href: '#',
        cta: 'Read reviews',
        rating: 5,
        stars: 5,
        variant: 'overlay',
      },
      sectionSize: defaultSectionSize,
      headline: "What if hiring a contractor didn't have to be a gamble?",
      subheadline:
        'Ground corned cow picanha doner fatback chop kevin. Pancetta spare tip bone sausage tenderloin tongue tail venison jerky kielbasa bacon bresaola pastrami ball.',
      action: {
        label: 'Get a free estimate',
        link: '#',
        style: 'button',
        color: 'primary-light',
        size: 'lg',
      },
    },
  },
  fields: [
    sectionSizeField(),
    announcementBadgeField(),
    {
      type: 'string',
      label: 'Headline',
      name: 'headline',
    },
    {
      type: 'string',
      label: 'Subheadline',
      name: 'subheadline',
      ui: {
        component: 'textarea',
      },
    },
    {
      label: 'Action',
      name: 'action',
      type: 'object',
      ui: {
        defaultItem: {
          label: 'Action Label',
          style: 'button',
          color: 'dark/light',
          size: 'md',
          link: '#',
        },
      },
      fields: [
        {
          label: 'Label',
          name: 'label',
          type: 'string',
        },
        {
          label: 'Link',
          name: 'link',
          type: 'string',
        },
        {
          label: 'Style',
          name: 'style',
          type: 'string',
          options: [
            { label: 'Button', value: 'button' },
            { label: 'Soft Button', value: 'soft' },
            { label: 'Plain Link', value: 'plain' },
          ],
        },
        {
          label: 'Color',
          name: 'color',
          type: 'string',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Primary Light', value: 'primary-light' },
            { label: 'Dark', value: 'dark/light' },
            { label: 'Light', value: 'light' },
          ],
        },
        {
          label: 'Size',
          name: 'size',
          type: 'string',
          options: [
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
        },
      ],
    },
    {
      type: 'object',
      label: 'Image',
      name: 'image',
      fields: [
        {
          name: 'src',
          label: 'Image Source',
          type: 'image',
        },
        {
          name: 'alt',
          label: 'Alt Text',
          type: 'string',
        },
      ],
    },
  ],
}
