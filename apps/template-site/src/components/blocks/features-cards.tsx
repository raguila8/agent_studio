import type { Template } from 'tinacms'
import type { JSX } from 'react'
import { tinaField } from 'tinacms/dist/react'
import { StaticTinaMarkdown } from 'tinacms/dist/rich-text/static'
import { Container } from '../elements/container'
import { Section, SectionBorder, SectionDividerLines } from '../shared/section'
import { SectionIntroHeader } from './section-intro-header'
import {
  highlightedHeadingField,
  paragraphNode,
  richTextRoot,
  textNode,
  type RichTextValue,
} from '../tina/fields/highlighted-heading'
import { TinaMarkdownLink } from '../tina/elements/tina-markdown-link'
import { LightWallpaper } from '../elements/wallpaper'
import { ImageWithDimensionsField } from '../tina/inputs/image-with-dimensions'
import Image from 'next/image'
import installationFallback from '@/images/block-fallbacks/feature-card-installation.jpg'
import repairsFallback from '@/images/block-fallbacks/feature-card-repairs.jpg'
import maintenanceFallback from '@/images/block-fallbacks/feature-card-maintenance.jpg'
import emergencyFallback from '@/images/block-fallbacks/feature-card-emergency.jpg'
import { imageSrcOrFallback } from '@/lib/images'
import type { BlockDoc } from './block-doc'

const cardFallbacks = [
  installationFallback,
  repairsFallback,
  maintenanceFallback,
  emergencyFallback,
]

// Tina passes `form` to custom fields at runtime, but the schema component type
// used here does not expose that documented prop.
const imageWithDimensionsField = ImageWithDimensionsField as never

type TinaContentSource = {
  _content_source?: {
    queryId: string
    path: Array<number | string>
  }
}

type FeaturesCardsBlockData = TinaContentSource & {
  showTopBorder?: boolean | null
  label?: string | null
  heading?: RichTextValue
  intro?: string | null
  cards?: Array<FeatureItemData | null> | null
}

type FeatureItemData = TinaContentSource & {
  eyebrow?: string | null
  title?: string | null
  description?: RichTextValue
  image?: {
    src?: string | null
    alt?: string | null
    width?: number | null
    height?: number | null
  } | null
}

export function FeaturesCardsBlock({ data }: { data: FeaturesCardsBlockData }) {
  const descriptionComponents = {
    p: (props?: { children: JSX.Element }) => <p>{props?.children}</p>,
    a: (props?: { url: string; children: JSX.Element }) => (
      <TinaMarkdownLink
        url={props?.url}
        className='text-primary-600 underline underline-offset-3'
      >
        {props?.children}
      </TinaMarkdownLink>
    ),
  }

  return (
    <Section>
      <SectionIntroHeader
        data={data}
        showTopBorder={data.showTopBorder ?? true}
      />
      <SectionDividerLines />

      <div className='relative'>
        <SectionBorder />
        <Container className='relative'>
          <div className='grid grid-cols-1 gap-4 py-12 sm:py-16 lg:grid-cols-2 lg:gap-12'>
            {data.cards?.map((feature, featureIndex) => {
              if (!feature) {
                return null
              }

              return (
                <LightWallpaper
                  key={featureIndex}
                  color='custom'
                  className='animate-fade-in rounded-xl p-0 opacity-0 *:last:h-full'
                >
                  <div className='flex h-full flex-col rounded-md bg-primary-100/25 p-0 text-sm/7 text-olive-950'>
                    <div
                      className='relative aspect-video overflow-hidden rounded-sm [mask-image:linear-gradient(to_bottom,black_50%,rgba(0,0,0,0.3)_85%,transparent)] 2xl:h-72'
                      data-tina-field={tinaField(feature, 'image')}
                    >
                      <Image
                        className='size-full object-cover object-top'
                        src={imageSrcOrFallback(
                          feature.image?.src,
                          cardFallbacks[featureIndex % cardFallbacks.length]
                        )}
                        alt={feature.image?.alt ?? ''}
                        fill
                        sizes='(min-width: 1280px) 584px, (min-width: 1024px) calc((100vw - 7rem) / 2), (min-width: 768px) 720px, (min-width: 672px) 624px, calc(100vw - 3rem)'
                      />
                    </div>
                    <div>
                      {feature.eyebrow ? (
                        <div className='flex items-center gap-2.5 px-6 pt-6 sm:px-10 sm:pt-8 lg:px-8 lg:pt-7'>
                          <span
                            className='text-sm/5 font-medium text-primary-600'
                            data-tina-field={tinaField(feature, 'eyebrow')}
                          >
                            {feature.eyebrow}
                          </span>
                        </div>
                      ) : null}
                      <div className='flex flex-col px-6 pt-2.5 pb-6 sm:px-10 sm:pb-10 lg:px-8 lg:pb-8'>
                        <h3
                          data-tina-field={tinaField(feature, 'title')}
                          className='text-lg font-medium tracking-tight text-olive-800 lg:text-xl'
                        >
                          {feature.title}
                        </h3>

                        <div
                          className='mt-2 flex flex-col gap-4 text-base/7.5 text-olive-600'
                          data-tina-field={tinaField(feature, 'description')}
                        >
                          {feature.description ? (
                            <StaticTinaMarkdown
                              content={feature.description}
                              components={descriptionComponents}
                            />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </LightWallpaper>
              )
            })}
          </div>
        </Container>
      </div>
    </Section>
  )
}

export const featuresCardsBlockDoc = {
  category: 'features_services',
  description:
    'Image-card grid for highlighting major services, capabilities, or benefit groups. Use it when each item needs a visual, eyebrow label, title, and short supporting copy.',
  contentNotes: [
    'Currently used on the landing page for four primary service cards.',
    'Use consistent image style and accurate alt text across cards.',
    'Keep card copy concise so card heights stay manageable.',
  ],
} satisfies BlockDoc

export const featuresCardsBlockSchema: Template = {
  name: 'featuresCards',
  label: 'Features Cards',
  ui: {
    previewSrc: '/block-previews/featured-cards.png',
    defaultItem: {
      showTopBorder: true,
      label: 'Services',
      heading: richTextRoot(
        paragraphNode(
          textNode('How we get the job '),
          textNode('done right', { italic: true })
        )
      ),
      intro:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam quis nostrud exercitation.',
      cards: [
        {
          eyebrow: 'Installation',
          title: 'Done right the first time, every time',
          description: richTextRoot(
            paragraphNode(
              textNode(
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
              )
            )
          ),
          image: {
            alt: 'Feature image',
          },
        },
        {
          eyebrow: 'Repairs',
          title: 'Quick response when you need it most',
          description: richTextRoot(
            paragraphNode(
              textNode(
                'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
              )
            )
          ),
          image: {
            alt: 'Feature image',
          },
        },
        {
          eyebrow: 'Maintenance',
          title: 'Catch problems before they become emergencies',
          description: richTextRoot(
            paragraphNode(
              textNode(
                'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
              )
            )
          ),
          image: {
            alt: 'Feature image',
          },
        },
        {
          eyebrow: 'Emergency service',
          title: "Available when it can't wait",
          description: richTextRoot(
            paragraphNode(
              textNode(
                'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.'
              )
            )
          ),
          image: {
            alt: 'Feature image',
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
      label: 'Features',
      name: 'cards',
      ui: {
        itemProps: (item) => ({
          label: item?.title || 'Feature',
        }),
        defaultItem: {
          eyebrow: 'Eyebrow text',
          title: 'Feature title',
          description: richTextRoot(
            paragraphNode(textNode('Feature description'))
          ),
          image: {
            alt: 'Feature image',
          },
        },
      },
      fields: [
        {
          type: 'string',
          label: 'Eyebrow',
          name: 'eyebrow',
        },
        {
          type: 'string',
          label: 'Title',
          name: 'title',
        },
        {
          type: 'rich-text',
          label: 'Description',
          name: 'description',
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
