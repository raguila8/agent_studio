import Image from 'next/image'
import type { JSX } from 'react'
import type { Template } from 'tinacms'
import { tinaField } from 'tinacms/dist/react'
import { StaticTinaMarkdown } from 'tinacms/dist/rich-text/static'
import { Container } from '../elements/container'
import { Eyebrow } from '../elements/eyebrow'
import { Section, SectionBorder } from '../shared/section'
import { SectionHeader } from '../elements/section-header'
import { Subheading } from '../elements/subheading'
import { LightWallpaper } from '../elements/wallpaper'
import {
  HighlightedHeadingMarkdown,
  highlightedHeadingField,
  paragraphNode,
  richTextRoot,
  textNode,
  type RichTextValue,
} from '../tina/fields/highlighted-heading'
import { TinaMarkdownLink } from '../tina/elements/tina-markdown-link'
import { ImageWithDimensionsField } from '../tina/inputs/image-with-dimensions'
import { imageSrcOrFallback } from '@/lib/images'
import { siteConfig } from '@/lib/site-config'
import type { BlockDoc } from './block-doc'
import { IconCircleCheck3OutlineDuo18 } from 'nucleo-ui-outline-duo-18'

import founderImage from '@/images/block-fallbacks/home-services-contractor-portrait.png'
import founderMobileImage from '@/images/block-fallbacks/home-services-contractor-mobile.png'

// Tina passes `form` to custom fields at runtime, but the schema component type
// used here does not expose that documented prop.
const imageWithDimensionsField = ImageWithDimensionsField as never
const wallpaperThemeColor = siteConfig.theme.wallpaperColor

type TinaContentSource = {
  _content_source?: {
    queryId: string
    path: Array<number | string>
  }
}

type MarkdownChildrenProps = { children: JSX.Element }
type MarkdownLinkProps = { url: string; children: JSX.Element }

type ContentSplitWithPortraitBlockData = TinaContentSource & {
  label?: string | null
  heading?: RichTextValue
  body?: RichTextValue
  photo?: {
    src?: string | null
    alt?: string | null
    width?: number | null
    height?: number | null
  } | null
  mobilePhoto?: {
    src?: string | null
    alt?: string | null
    width?: number | null
    height?: number | null
  } | null
}

function getImageDimension(value: number | null | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

export function ContentSplitWithPortraitBlock({
  data,
}: {
  data: ContentSplitWithPortraitBlockData
}) {
  const photoWidth = getImageDimension(data.photo?.width, 941)
  const photoHeight = getImageDimension(data.photo?.height, 1672)
  const mobilePhotoWidth = getImageDimension(data.mobilePhoto?.width, 1619)
  const mobilePhotoHeight = getImageDimension(data.mobilePhoto?.height, 971)

  const bodyComponents = {
    p: (props?: MarkdownChildrenProps) => <p>{props?.children}</p>,
    a: (props?: MarkdownLinkProps) => (
      <TinaMarkdownLink
        url={props?.url}
        className='text-primary-600 underline underline-offset-3'
      >
        {props?.children}
      </TinaMarkdownLink>
    ),
    ul: (props?: MarkdownChildrenProps) => (
      <ul className='flex flex-col gap-3'>{props?.children}</ul>
    ),
    li: (props?: MarkdownChildrenProps) => (
      <li className='flex items-center gap-2.5 [&_p]:m-0 [&_p]:inline'>
        <span className='mt-0.5 shrink-0 duotone-primary [&_svg]:size-[18px]'>
          <IconCircleCheck3OutlineDuo18 aria-hidden='true' />
        </span>
        <span>{props?.children}</span>
      </li>
    ),
  }

  return (
    <Section className='[--img-extend:max(2rem,calc((min(100vw,96rem)-80rem)/2+2rem))]'>
      <SectionBorder />
      <Container>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_2fr]'>
          <div className='flex flex-col justify-center p-6 sm:p-10 lg:border-r lg:border-olive-950/7 lg:p-16 lg:pl-0 xl:py-24'>
            <SectionHeader
              layout='stacked'
              eyebrow={
                data.label ? (
                  <Eyebrow data-tina-field={tinaField(data, 'label')}>
                    {data.label}
                  </Eyebrow>
                ) : null
              }
              headline={
                data.heading ? (
                  <Subheading
                    className='mt-2'
                    data-tina-field={tinaField(data, 'heading')}
                  >
                    <HighlightedHeadingMarkdown content={data.heading} />
                  </Subheading>
                ) : null
              }
            />
            <div
              className='mt-6 mb-2 aspect-5/3 w-full overflow-hidden rounded-2xl lg:hidden [&_img]:size-full [&_img]:object-cover'
              data-tina-field={tinaField(data, 'mobilePhoto')}
            >
              <Image
                src={imageSrcOrFallback(
                  data.mobilePhoto?.src,
                  founderMobileImage
                )}
                alt={data.mobilePhoto?.alt ?? 'Home services contractor'}
                width={mobilePhotoWidth}
                height={mobilePhotoHeight}
                sizes='(min-width: 768px) 640px, (min-width: 672px) 544px, (min-width: 640px) calc(100vw - 8rem), calc(100vw - 6rem)'
              />
            </div>
            {data.body && (
              <div
                className='mt-5 flex flex-col gap-4 text-base/7 text-olive-700'
                data-tina-field={tinaField(data, 'body')}
              >
                <StaticTinaMarkdown
                  content={data.body}
                  components={bodyComponents}
                />
              </div>
            )}
          </div>
          <LightWallpaper
            color={wallpaperThemeColor}
            className='relative hidden max-lg:border-t max-lg:border-olive-950/7 lg:-mr-[var(--img-extend)] lg:block lg:w-[calc(100%+var(--img-extend))]'
          >
            <div className='absolute inset-0 p-6 sm:p-10 lg:p-4 xl:p-10'>
              <div
                className='size-full overflow-hidden rounded-3xl [&_img]:size-full [&_img]:object-cover [&_img]:object-[center_25%]'
                data-tina-field={tinaField(data, 'photo')}
              >
                <Image
                  src={imageSrcOrFallback(data.photo?.src, founderImage)}
                  alt={data.photo?.alt ?? 'Home services contractor'}
                  width={photoWidth}
                  height={photoHeight}
                  sizes='(min-width: 1536px) 646px, (min-width: 1440px) 598px, (min-width: 1280px) 518px, (min-width: 1200px) 486px, (min-width: 1024px) 456px, 100vw'
                  className='size-full object-cover object-top'
                />
              </div>
            </div>
          </LightWallpaper>
        </div>
      </Container>
    </Section>
  )
}

export const contentSplitWithPortraitBlockDoc = {
  category: 'content',
  description:
    'Narrative split section with prose on the left and a portrait-style image area on the right. Use it for founder, team, approach, or credibility storytelling that benefits from a person or crew image.',
  contentNotes: [
    'Desktop and mobile photos can be authored separately.',
    'Lists render as checkmarked items.',
    'Avoid founder, credential, experience, or certification claims unless verified.',
  ],
} satisfies BlockDoc

export const contentSplitWithPortraitBlockSchema: Template = {
  name: 'contentSplitWithPortrait',
  label: 'Content Split with Portrait',
  ui: {
    previewSrc: '/block-previews/content-split-with-portrait.png',
    defaultItem: {
      label: 'Meet the owner',
      heading: richTextRoot(
        paragraphNode(
          textNode('Get to know '),
          textNode('your local expert', { italic: true })
        )
      ),
      body: richTextRoot(
        paragraphNode(
          textNode(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Before building this company, our founder spent years in the field — pulling wire, running service calls, climbing roofs — learning the trade the hard way. That background never went away. It shaped everything about how the team works today and the standard every job is held to.'
          )
        ),
        paragraphNode(
          textNode(
            'For over 20 years, that same hands-on commitment has shown up on every job site. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. The team studies new techniques, trains continuously, and shows up on time — every time — because that is what neighbors and homeowners deserve.'
          )
        ),
        {
          type: 'ul',
          children: [
            {
              type: 'li',
              children: [
                paragraphNode(
                  textNode('Fully licensed, bonded, and insured contractor')
                ),
              ],
            },
            {
              type: 'li',
              children: [
                paragraphNode(
                  textNode('20+ years of hands-on experience in the trade')
                ),
              ],
            },
            {
              type: 'li',
              children: [
                paragraphNode(
                  textNode(
                    'Manufacturer-certified and continuously trained on the latest systems'
                  )
                ),
              ],
            },
            {
              type: 'li',
              children: [
                paragraphNode(
                  textNode(
                    'Trusted by homeowners and businesses across the region'
                  )
                ),
              ],
            },
          ],
        }
      ),
    },
  },
  fields: [
    {
      type: 'string',
      label: 'Label',
      name: 'label',
    },
    highlightedHeadingField(),
    {
      type: 'rich-text',
      label: 'Body',
      name: 'body',
      description:
        'Supports paragraphs and unordered lists. List items render with the content-split-with-portrait checkmark style.',
    },
    {
      type: 'object',
      label: 'Photo',
      name: 'photo',
      description: 'Desktop image shown in the right column.',
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
    {
      type: 'object',
      label: 'Mobile Photo',
      name: 'mobilePhoto',
      description: 'Mobile image shown beneath the heading.',
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
