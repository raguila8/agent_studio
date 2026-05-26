import Image from 'next/image'
import { clsx } from 'clsx/lite'
import type { Template } from 'tinacms'
import { tinaField } from 'tinacms/dist/react'
import { Container } from '../elements/container'
import {
  Section,
  SectionBorder,
  SectionDividerLine,
  defaultSectionSize,
  sectionSizeField,
  type SectionSize,
} from '../shared/section'
import { Heading } from '../elements/heading'
import { LightWallpaper, Wallpaper } from '../elements/wallpaper'
import { TinaAnnouncementBadge } from '../tina/elements/tina-announcement-badge'
import { announcementBadgeField } from '../tina/fields/announcement-badge'
import { ImageWithDimensionsField } from '../tina/inputs/image-with-dimensions'
import {
  ButtonLink,
  PlainButtonLink,
  SoftButtonLink,
} from '@/components/elements/button'
import { ArrowNarrowRightIcon } from '@/components/icons/arrow-narrow-right-icon'
import { imageSrcOrFallback } from '@/lib/images'
import { siteConfig } from '@/lib/site-config'
import type { BlockDoc } from './block-doc'

import homeServicesHeroImage from '@/images/block-fallbacks/home-services-hero.jpg'

// Tina passes `form` to custom fields at runtime, but the schema component type
// used here does not expose that documented prop.
const imageWithDimensionsField = ImageWithDimensionsField as never

type TinaContentSource = {
  _content_source?: {
    queryId: string
    path: Array<number | string>
  }
}

type ActionData = TinaContentSource & {
  label?: string | null
  link?: string | null
  style?: string | null
  color?: string | null
  size?: string | null
  showChevron?: boolean | null
}

type BackgroundVariant = 'dark' | 'light'

const defaultBackgroundVariant: BackgroundVariant = 'dark'

type WallpaperHeroWithImageBlockData = TinaContentSource & {
  eyebrow?: {
    text?: string | null
    href?: string | null
    cta?: string | null
    variant?: string | null
    rating?: number | null
    stars?: number | null
  } | null
  headline?: string | null
  subheadline?: string | null
  backgroundVariant?: BackgroundVariant | null
  actions?: Array<ActionData | null> | null
  image?: {
    src?: string | null
    alt?: string | null
    width?: number | null
    height?: number | null
  } | null
  sectionSize?: SectionSize | null
}

function renderAction(
  action?: ActionData | null,
  backgroundVariant: BackgroundVariant = defaultBackgroundVariant
) {
  if (!action?.label) return null

  const isLightBackground = backgroundVariant === 'light'
  const content = (
    <>
      {action.label}
      {action.showChevron ? <ArrowNarrowRightIcon /> : null}
    </>
  )

  if (action.style === 'soft') {
    return (
      <SoftButtonLink
        href={action.link ?? '#'}
        size={(action.size as 'md' | 'lg') ?? 'md'}
        className={
          isLightBackground
            ? undefined
            : 'font-[550]! text-white hover:bg-white/15'
        }
      >
        {content}
      </SoftButtonLink>
    )
  }

  if (action.style === 'plain') {
    return (
      <PlainButtonLink
        href={action.link ?? '#'}
        size={(action.size as 'md' | 'lg') ?? 'md'}
        className='font-[550]!'
        color={
          ((isLightBackground
            ? action.color === 'light'
              ? 'dark/light'
              : action.color === 'primary-light'
                ? 'primary'
                : action.color
            : action.color === 'primary-light'
              ? 'light'
              : action.color) as 'dark/light' | 'light' | 'primary') ??
          (isLightBackground ? 'dark/light' : 'light')
        }
      >
        {content}
      </PlainButtonLink>
    )
  }

  return (
    <ButtonLink
      href={action.link ?? '#'}
      className='font-[550]! hover:text-primary-900! hover:[--button-accent-light-overlay:hsla(40,43%,97%,0.88)]!'
      size={(action.size as 'md' | 'lg') ?? 'md'}
      color={
        ((isLightBackground
          ? action.color === 'light' || action.color === 'primary-light'
            ? 'primary'
            : action.color
          : action.color) as
          | 'dark/light'
          | 'light'
          | 'primary'
          | 'primary-light') ??
        (isLightBackground ? 'primary' : 'primary-light')
      }
    >
      {content}
    </ButtonLink>
  )
}

export function WallpaperHeroWithImageBlock({
  data,
}: {
  data: WallpaperHeroWithImageBlockData
}) {
  const backgroundVariant =
    data.backgroundVariant === 'light' ? 'light' : defaultBackgroundVariant
  const isLightBackground = backgroundVariant === 'light'
  const WallpaperComponent = isLightBackground ? LightWallpaper : Wallpaper
  const wallpaperColor = siteConfig.theme.wallpaperColor
  const eyebrowData =
    isLightBackground && data.eyebrow
      ? { ...data.eyebrow, variant: 'normal' }
      : data.eyebrow
  const hasActions = data.actions?.some((action) => action?.label)

  return (
    <Section size={data.sectionSize ?? defaultSectionSize}>
      <SectionBorder top='top-px' />
      <SectionDividerLine color='white' className='h-px' />
      <WallpaperComponent className='' color={wallpaperColor}>
        <div className='-mx-2 sm:px-6 md:px-12 lg:px-0'>
          <Container className='flex flex-col gap-16'>
            <div className='flex gap-x-10 gap-y-16 max-lg:flex-col sm:gap-y-24'>
              <div className='flex shrink-0 flex-col items-start gap-6 pt-16 sm:pt-32 lg:basis-2xl lg:py-40'>
                <TinaAnnouncementBadge
                  data={eyebrowData}
                  tinaFieldName={tinaField(data, 'eyebrow')}
                  textElement='h2'
                />
                <Heading
                  className='max-w-5xl sm:text-7xl/20!'
                  color={isLightBackground ? 'dark/light' : 'light'}
                  data-tina-field={tinaField(data, 'headline')}
                >
                  {data.headline}
                </Heading>
                <div
                  className={clsx(
                    'flex max-w-3xl flex-col gap-4 text-lg/8',
                    isLightBackground ? 'text-olive-700' : 'text-white/95'
                  )}
                  data-tina-field={tinaField(data, 'subheadline')}
                >
                  {data.subheadline}
                </div>
                {hasActions ? (
                  <div className='flex flex-wrap items-center gap-4'>
                    {data.actions?.map((action, index) => {
                      if (!action?.label) return null

                      return (
                        <div
                          key={index}
                          data-tina-field={tinaField(data, 'actions', index)}
                        >
                          {renderAction(action, backgroundVariant)}
                        </div>
                      )
                    })}
                  </div>
                ) : null}
              </div>
              <div className='-mr-[calc(48px+max(0px,(100vw-672px)/2))] min-w-0 flex-1 md:-mr-[calc(72px+max(0px,(100vw-768px)/2))] lg:-mr-[calc(1.5rem+max(0px,(1920px-1280px)/2))] lg:pt-24'>
                <div className='relative h-72 sm:h-92 md:h-125 lg:size-full'>
                  <div
                    className='absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_30%),linear-gradient(to_bottom,transparent,black_30%)] [mask-composite:intersect] *:size-full *:object-cover max-lg:rounded-t-lg lg:rounded-tl-lg'
                    data-tina-field={tinaField(data, 'image')}
                  >
                    <Image
                      className='bg-white/75 object-cover object-right'
                      src={imageSrcOrFallback(
                        data.image?.src,
                        homeServicesHeroImage
                      )}
                      alt={data.image?.alt ?? ''}
                      fill
                      priority
                      sizes='(min-width: 1536px) 848px, (min-width: 1280px) 528px, (min-width: 1024px) 50vw, 100vw'
                    />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </WallpaperComponent>
    </Section>
  )
}

export const wallpaperHeroWithImageBlockDoc = {
  category: 'hero_intro',
  description:
    'Service-page hero with a large headline, supporting copy, one or more actions, an optional announcement badge, and a prominent right-side image. Choose it when the page needs a strong service-specific opening with visual context.',
  contentNotes: [
    'Best near the top of a page, before trust markers or deeper service detail.',
    'Use one primary action and, when helpful, one secondary action.',
    'Use a real, relevant service image with accurate alt text; avoid unsupported location, licensing, rating, or response-time claims.',
    'Generate the image as a landscape composition, preferably around a 4:3 aspect ratio. Avoid portrait images for this block; the hero crops better on mobile with landscape artwork, and the same image may be reused in service cards or other landscape-oriented blocks.',
  ],
} satisfies BlockDoc

export const wallpaperHeroWithImageBlockSchema: Template = {
  name: 'wallpaperHeroWithImage',
  label: 'Wallpaper Hero with Image',
  ui: {
    previewSrc: '/block-previews/wallpaper-hero-with-image.png',
    defaultItem: {
      eyebrow: {
        text: '123 Main Street, Springfield, IL 62701',
        href: '#',
        cta: 'Get directions',
        variant: 'overlay',
      },
      backgroundVariant: defaultBackgroundVariant,
      sectionSize: defaultSectionSize,
      headline: 'Reliable home services from a team you can trust',
      subheadline:
        'Our licensed, local team handles everything from quick repairs to full installations, bringing honest pricing, careful workmanship, and respect for your home and your time to every job we take on.',
      actions: [
        {
          label: 'Get a free estimate',
          link: '#',
          style: 'button',
          color: 'primary-light',
          size: 'lg',
          showChevron: false,
        },
        {
          label: 'See our services',
          link: '#',
          style: 'plain',
          color: 'light',
          size: 'lg',
          showChevron: true,
        },
      ],
    },
  },
  fields: [
    sectionSizeField(),
    {
      type: 'string',
      label: 'Background Variant',
      name: 'backgroundVariant',
      options: [
        { label: 'Dark Wallpaper', value: 'dark' },
        { label: 'Light Wallpaper', value: 'light' },
      ],
    },
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
      type: 'object',
      list: true,
      name: 'actions',
      label: 'Actions',
      ui: {
        itemProps: (item) => ({
          label: item?.label || 'Action',
        }),
        defaultItem: {
          label: 'Action label',
          link: '#',
          style: 'button',
          color: 'primary-light',
          size: 'lg',
          showChevron: false,
        },
      },
      fields: [
        {
          type: 'string',
          label: 'Label',
          name: 'label',
        },
        {
          type: 'string',
          label: 'Link',
          name: 'link',
        },
        {
          type: 'string',
          label: 'Style',
          name: 'style',
          options: [
            { label: 'Button', value: 'button' },
            { label: 'Soft Button', value: 'soft' },
            { label: 'Plain Link', value: 'plain' },
          ],
        },
        {
          type: 'string',
          label: 'Color',
          name: 'color',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Primary Light', value: 'primary-light' },
            { label: 'Dark', value: 'dark/light' },
            { label: 'Light', value: 'light' },
          ],
        },
        {
          type: 'string',
          label: 'Size',
          name: 'size',
          options: [
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
        },
        {
          type: 'boolean',
          label: 'Show Chevron',
          name: 'showChevron',
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
          ui: {
            component: imageWithDimensionsField,
          },
        },
        {
          name: 'alt',
          label: 'Alt Text',
          type: 'string',
        },
        {
          name: 'width',
          label: 'Image Width',
          type: 'number',
          ui: {
            component: 'hidden',
          },
        },
        {
          name: 'height',
          label: 'Image Height',
          type: 'number',
          ui: {
            component: 'hidden',
          },
        },
      ],
    },
  ],
}
