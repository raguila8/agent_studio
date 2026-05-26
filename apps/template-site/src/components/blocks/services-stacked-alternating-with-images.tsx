import Image from 'next/image'
import Link from 'next/link'
import type { Template } from 'tinacms'
import { tinaField } from 'tinacms/dist/react'
import { Container } from '../elements/container'
import { Section, SectionBorder, SectionDividerLines } from '../shared/section'
import { SectionDividerBlock } from '../blocks/section-divider'
import { ChevronIcon } from '../icons/chevron-icon'
import { LightWallpaper } from '../elements/wallpaper'
import {
  highlightedHeadingField,
  paragraphNode,
  richTextRoot,
  textNode,
  type RichTextValue,
} from '../tina/fields/highlighted-heading'
import { ImageWithDimensionsField } from '../tina/inputs/image-with-dimensions'
import { SectionIntroHeader } from './section-intro-header'
import { imageSrcOrFallback } from '@/lib/images'
import { siteConfig } from '@/lib/site-config'
import type { BlockDoc } from './block-doc'

import installationImage from '@/images/block-fallbacks/feature-card-installation.jpg'
import repairsImage from '@/images/block-fallbacks/feature-card-repairs.jpg'
import maintenanceImage from '@/images/block-fallbacks/feature-card-maintenance.jpg'
import emergencyImage from '@/images/block-fallbacks/feature-card-emergency.jpg'

// Tina passes `form` to custom fields at runtime, but the schema component type
// used here does not expose that documented prop.
const imageWithDimensionsField = ImageWithDimensionsField as never

type TinaContentSource = {
  _content_source?: {
    queryId: string
    path: Array<number | string>
  }
}

type ServiceItem = TinaContentSource & {
  title?: string | null
  description?: string | null
  action?: {
    label?: string | null
    link?: string | null
  } | null
  image?: {
    src?: string | null
    alt?: string | null
    width?: number | null
    height?: number | null
  } | null
}

type ServicesStackedAlternatingWithImagesBlockData = TinaContentSource & {
  showTopBorder?: boolean | null
  label?: string | null
  heading?: RichTextValue
  intro?: string | null
  services?: Array<ServiceItem | null> | null
}

const fallbackServiceImages = [
  installationImage,
  repairsImage,
  maintenanceImage,
  emergencyImage,
]
const wallpaperThemeColor = siteConfig.theme.wallpaperColor

export function ServicesStackedAlternatingWithImagesBlock({
  data,
}: {
  data: ServicesStackedAlternatingWithImagesBlockData
}) {
  return (
    <Section>
      <SectionIntroHeader
        data={data}
        showTopBorder={data.showTopBorder ?? false}
      />
      <div className='flex flex-col'>
        <SectionDividerLines />
        <div>
          {data.services?.map((service, index) => {
            if (!service) return null

            return (
              <div className='group' key={index}>
                <div className='relative group-first:hidden'>
                  <SectionDividerBlock />
                </div>
                <div className='relative'>
                  <SectionBorder />
                  <Container>
                    <div
                      className='[--img-extend:max(2rem,calc((min(100vw,96rem)-80rem)/2+2rem))]'
                      data-tina-field={tinaField(data, 'services', index)}
                    >
                      <div className='grid grid-flow-dense grid-cols-1 lg:grid-cols-2'>
                        <div className='flex max-w-2xl flex-col justify-center gap-6 pt-8 pb-10 text-balance sm:py-10 md:gap-7 lg:max-w-none lg:gap-10 lg:border-r lg:border-olive-950/7 lg:p-16 lg:pl-0 lg:group-even:col-start-2 lg:group-even:border-r-0 lg:group-even:border-l lg:group-even:pr-0 lg:group-even:pl-12'>
                          <div className='text-lg/8 text-olive-600 sm:text-[19px]/8'>
                            <h3
                              className='inline font-[550] text-olive-900'
                              data-tina-field={tinaField(service, 'title')}
                            >
                              {service.title}.
                            </h3>{' '}
                            <span
                              data-tina-field={tinaField(
                                service,
                                'description'
                              )}
                            >
                              {service.description}
                            </span>
                          </div>
                          {(service.action?.label || service.action?.link) && (
                            <div data-tina-field={tinaField(service, 'action')}>
                              <Link
                                href={service.action?.link ?? '#'}
                                className='inline-flex items-center gap-2 text-base/7 font-[550] text-primary-600 duration-200 ease-in-out hover:text-primary-500'
                              >
                                {service.action?.label ?? 'Learn more'}{' '}
                                <ChevronIcon />
                              </Link>
                            </div>
                          )}
                        </div>
                        <LightWallpaper
                          color={wallpaperThemeColor}
                          className='w-[calc(100%+(100vw-100%)/2)] rounded-tl-2xl border-t border-l border-olive-950/7 lg:w-[calc(100%+var(--img-extend))] lg:rounded-l-none lg:border-t-0 lg:border-l-0 lg:group-even:col-start-1 lg:group-even:-ml-[var(--img-extend)]'
                        >
                          <div
                            className='overflow-hidden rounded-l-2xl p-2 pr-0 md:p-3 lg:rounded-l-2xl lg:rounded-r-none lg:p-4 lg:pr-0 lg:group-even:rounded-l-none lg:group-even:rounded-r-2xl lg:group-even:pr-4 lg:group-even:pl-0'
                            data-tina-field={tinaField(service, 'image')}
                          >
                            <div className='overflow-hidden rounded-l-2xl [mask-image:linear-gradient(to_right,black_50%,transparent)] lg:rounded-l-2xl lg:rounded-r-none lg:[mask-image:linear-gradient(to_right,black_50%,transparent)] lg:group-even:rounded-l-none lg:group-even:rounded-r-2xl lg:group-even:[mask-image:linear-gradient(to_left,black_50%,transparent)]'>
                              <div className='relative aspect-2/1 size-full lg:aspect-5/3'>
                                <Image
                                  src={imageSrcOrFallback(
                                    service.image?.src,
                                    fallbackServiceImages[
                                      index % fallbackServiceImages.length
                                    ]
                                  )}
                                  alt={service.image?.alt ?? ''}
                                  fill
                                  sizes='(min-width: 1536px) 768px, (min-width: 1024px) 50vw, 100vw'
                                  className='pointer-events-none absolute inset-0 size-full object-cover'
                                />
                              </div>
                            </div>
                          </div>
                        </LightWallpaper>
                      </div>
                    </div>
                  </Container>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

export const servicesStackedAlternatingWithImagesBlockDoc = {
  category: 'features_services',
  description:
    'Stacked service list with alternating text and image layouts plus optional links. Use it for service index pages where each service deserves a short explanation and route to a detail page.',
  contentNotes: [
    'Works well with 4-6 services.',
    'Each service can include a Learn more link to a detail page.',
    'Use relevant service images where available; fallback images repeat by position.',
  ],
} satisfies BlockDoc

export const servicesStackedAlternatingWithImagesBlockSchema: Template = {
  name: 'servicesStackedAlternatingWithImages',
  label: 'Services Stacked Alternating With Images',
  ui: {
    previewSrc: '/block-previews/services-stacked-alternating-with-images.png',
    defaultItem: {
      showTopBorder: false,
      label: 'What we do',
      heading: richTextRoot(
        paragraphNode(
          textNode('Everything from quick fixes to '),
          textNode('full installations', { italic: true })
        )
      ),
      intro:
        'From routine maintenance to full system replacements, our licensed crews bring craftsmanship and clear communication to every visit.',
      services: [
        {
          title: 'Installation',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          action: {
            label: 'Learn more',
            link: '#',
          },
        },
        {
          title: 'Repairs',
          description:
            'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          action: {
            label: 'Learn more',
            link: '#',
          },
        },
        {
          title: 'Maintenance',
          description:
            'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
          action: {
            label: 'Learn more',
            link: '#',
          },
        },
        {
          title: 'Emergency service',
          description:
            'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est.',
          action: {
            label: 'Learn more',
            link: '#',
          },
        },
      ],
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
      label: 'Label',
      name: 'label',
    },
    highlightedHeadingField(),
    {
      type: 'string',
      label: 'Intro',
      name: 'intro',
      ui: {
        component: 'textarea',
      },
    },
    {
      type: 'object',
      list: true,
      name: 'services',
      label: 'Services',
      ui: {
        itemProps: (item) => ({
          label: item?.title || 'Service',
        }),
        defaultItem: {
          title: 'Service',
          description: 'Service description',
          action: {
            label: 'Learn more',
            link: '#',
          },
        },
      },
      fields: [
        {
          type: 'string',
          label: 'Title',
          name: 'title',
        },
        {
          type: 'string',
          label: 'Description',
          name: 'description',
          ui: {
            component: 'textarea',
          },
        },
        {
          type: 'object',
          label: 'Action',
          name: 'action',
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
    },
  ],
}
