import Image from 'next/image'
import { clsx } from 'clsx/lite'
import type { JSX } from 'react'
import type { Template } from 'tinacms'
import { tinaField } from 'tinacms/dist/react'
import { StaticTinaMarkdown } from 'tinacms/dist/rich-text/static'
import { Container } from '../elements/container'
import { Eyebrow } from '../elements/eyebrow'
import { Section, SectionBorder, SectionDividerLines } from '../shared/section'
import { SectionHeader } from '../elements/section-header'
import { Subheading } from '../elements/subheading'
import { Text } from '../elements/text'
import { SectionIntroHeader } from './section-intro-header'
import { IconCircleCheck3OutlineDuo18 } from 'nucleo-ui-outline-duo-18'
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
import type { BlockDoc } from './block-doc'

import defaultContentImage from '@/images/block-fallbacks/content-plumbing-hvac-faded-portrait.png'

// Tina passes `form` to custom fields at runtime, but the schema component type
// used here does not expose that documented prop.
const imageWithDimensionsField = ImageWithDimensionsField as never

type TinaContentSource = {
  _content_source?: {
    queryId: string
    path: Array<number | string>
  }
}

type MarkdownChildrenProps = { children: JSX.Element }
type MarkdownLinkProps = { url: string; children: JSX.Element }

type HeaderPresentationSettings = TinaContentSource & {
  style?: 'split' | 'stacked' | null
  showTopBorder?: boolean | null
}

type ContentTwoColumnWithRightImageBlockData = TinaContentSource & {
  headerPresentation?: HeaderPresentationSettings | null
  headerLayout?: 'split' | 'stacked' | null
  showTopBorder?: boolean | null
  label?: string | null
  heading?: RichTextValue
  intro?: string | null
  body?: RichTextValue
  photo?: {
    src?: string | null
    alt?: string | null
    fadeEdges?: boolean | null
    aspectRatio?: 'landscape' | 'portrait' | null
    width?: number | null
    height?: number | null
  } | null
}

function getImageDimension(value: number | null | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

export function ContentTwoColumnWithRightImageBlock({
  data,
}: {
  data: ContentTwoColumnWithRightImageBlockData
}) {
  const headerStyle = data.headerPresentation?.style ?? data.headerLayout
  const showTopBorder =
    data.headerPresentation?.showTopBorder ?? data.showTopBorder ?? true
  const usesSplitHeader = headerStyle === 'split'
  const photoWidth = getImageDimension(data.photo?.width, 1122)
  const photoHeight = getImageDimension(data.photo?.height, 1402)
  const framedPhotoSizes =
    '(min-width: 1280px) 576px, (min-width: 1024px) calc((100vw - 8rem) / 2), (min-width: 768px) 672px, (min-width: 672px) 624px, calc(100vw - 3rem)'
  const blendedPhotoSizes =
    '(min-width: 1280px) 584px, (min-width: 1024px) calc((100vw - 7rem) / 2), (min-width: 512px) 512px, calc(100vw - 3rem)'

  const bodyComponents = {
    p: (props?: MarkdownChildrenProps) => <p>{props?.children}</p>,
    a: (props?: MarkdownLinkProps) => (
      <TinaMarkdownLink
        url={props?.url}
        className='text-primary-600/90 underline underline-offset-3 transition duration-100 ease-in-out hover:text-primary-600'
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

  const bodyContent = data.body ? (
    <div
      className={clsx(
        'grid grid-cols-1 lg:grid-cols-2',
        data.photo?.fadeEdges
          ? 'gap-0 lg:relative lg:gap-0!'
          : 'gap-12 lg:gap-16'
      )}
    >
      <div
        className={clsx(
          'mx-auto flex max-w-2xl flex-col gap-4 text-base/7 text-olive-700',
          data.photo?.fadeEdges && 'lg:py-16'
        )}
        data-tina-field={tinaField(data, 'body')}
      >
        <StaticTinaMarkdown content={data.body} components={bodyComponents} />
      </div>
      <div
        className={clsx(
          'w-full max-lg:order-first max-lg:mx-auto',
          data.photo?.fadeEdges
            ? 'max-lg:max-w-lg lg:absolute lg:inset-y-0 lg:right-0 lg:w-[calc((100%_-_3rem)/2)] lg:overflow-hidden'
            : 'max-lg:max-w-2xl'
        )}
      >
        {data.photo?.fadeEdges && data.photo?.src ? (
          // Blended PNGs include their own transparent feather, so preserve the
          // natural asset ratio on small screens. At lg+, the wrapper is capped
          // to the text column height so the image cannot make the row taller.
          <Image
            alt={data.photo.alt ?? ''}
            src={data.photo.src}
            width={photoWidth}
            height={photoHeight}
            sizes={blendedPhotoSizes}
            className='block h-auto w-full object-cover lg:h-full lg:object-contain'
          />
        ) : (
          <div
            className={clsx(
              'relative overflow-hidden rounded-xl shadow-md outline-1 -outline-offset-1 outline-black/10',
              data.photo?.aspectRatio === 'portrait'
                ? 'aspect-4/5'
                : 'aspect-3/2'
            )}
          >
            <Image
              alt={data.photo?.alt ?? ''}
              src={imageSrcOrFallback(data.photo?.src, defaultContentImage)}
              fill
              className='block object-cover'
              sizes={framedPhotoSizes}
            />
          </div>
        )}
      </div>
    </div>
  ) : null

  return (
    <Section className='[--img-extend:max(2rem,calc((min(100vw,96rem)-80rem)/2+2rem))]'>
      {usesSplitHeader ? (
        <>
          <SectionIntroHeader data={data} showTopBorder={showTopBorder} />
          {data.body && (
            <div className='relative'>
              <SectionBorder top='top-[2px]' />
              <SectionDividerLines />
              <Container
                className={clsx(data.photo?.fadeEdges ? '' : 'py-12 sm:py-16')}
              >
                {bodyContent}
              </Container>
            </div>
          )}
        </>
      ) : (
        <>
          <SectionBorder />
          <div className='py-16'>
            <Container className='flex flex-col gap-10 sm:gap-12'>
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
                subheadline={
                  data.intro ? (
                    <Text
                      className='text-pretty'
                      size='lg'
                      data-tina-field={tinaField(data, 'intro')}
                    >
                      {data.intro}
                    </Text>
                  ) : null
                }
              />
              {data.body ? bodyContent : null}
            </Container>
          </div>
        </>
      )}
    </Section>
  )
}

export const contentTwoColumnWithRightImageBlockDoc = {
  category: 'content',
  description:
    'Content section with header copy, rich text, and a right-side image that can be framed or edge-blended. Use it for service explanations, diagnostic detail, or approach sections that need visual support.',
  contentNotes: [
    'Always produce a prepared RGBA/transparent PNG for this block and set fadeEdges: true. The photo should dissolve softly into the page background, with the subject fully opaque near the center or right side and all outer edges feathered to transparency.',
    'Choose image orientation from the body copy length: use a landscape image when the rich-text body is less than 130 words; use a portrait image when the body is 130 words or more.',
    'Avoid hard rectangular crop lines, frames, shadows, or visible background color blocks. Generate the canvas in the chosen orientation and set width and height from the final asset.',
  ],
} satisfies BlockDoc

export const contentTwoColumnWithRightImageBlockSchema: Template = {
  name: 'contentTwoColumnWithRightImage',
  label: 'Content Two Column With Right Image',
  ui: {
    previewSrc: '/block-previews/content-two-column-with-right-image.png',
    defaultItem: {
      headerPresentation: {
        style: 'stacked',
        showTopBorder: true,
      },
      label: 'Why homeowners choose us',
      heading: richTextRoot(
        paragraphNode(
          textNode('Service you can '),
          textNode('count on', { italic: true })
        )
      ),
      intro:
        'From quick repairs to full installations, our licensed crews show up on time, work cleanly, and stand behind every job we complete.',
      body: richTextRoot(
        paragraphNode(
          textNode(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud '
          ),
          {
            type: 'a',
            url: '#',
            children: [textNode('exercitation ullamco laboris')],
          },
          textNode(
            ' nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
          )
        ),
        paragraphNode(
          textNode(
            'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium '
          ),
          {
            type: 'a',
            url: '#',
            children: [textNode('doloremque laudantium')],
          },
          textNode(
            ', totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
          )
        ),
        {
          type: 'ul',
          children: [
            {
              type: 'li',
              children: [
                paragraphNode(
                  textNode('Nemo enim ipsam voluptatem quia voluptas sit')
                ),
              ],
            },
            {
              type: 'li',
              children: [
                paragraphNode(
                  textNode(
                    'Aspernatur aut odit aut fugit sed quia consequuntur'
                  )
                ),
              ],
            },
            {
              type: 'li',
              children: [
                paragraphNode(
                  textNode(
                    'Magni dolores eos qui ratione voluptatem sequi nesciunt'
                  )
                ),
              ],
            },
            {
              type: 'li',
              children: [
                paragraphNode(
                  textNode(
                    'Neque porro quisquam est qui dolorem ipsum quia dolor sit'
                  )
                ),
              ],
            },
          ],
        }
      ),
      photo: {
        src: '/media/trades/plumbing-hvac-faded-portrait.png',
        alt: 'Plumbing and HVAC technician working near residential mechanical systems',
        fadeEdges: true,
        width: 1122,
        height: 1402,
      },
    },
  },
  fields: [
    {
      type: 'object',
      label: 'Header Presentation',
      name: 'headerPresentation',
      fields: [
        {
          type: 'string',
          label: 'Style',
          name: 'style',
          options: [
            {
              label: 'Stacked',
              value: 'stacked',
            },
            {
              label: 'Split',
              value: 'split',
            },
          ],
        },
        {
          type: 'boolean',
          label: 'Show Top Border',
          name: 'showTopBorder',
        },
      ],
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
      description: 'Image shown in the right column.',
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
          name: 'fadeEdges',
          label: 'Blend Edges',
          type: 'boolean',
          description:
            'Removes the frame for images with a baked-in transparent edge blend.',
        },
        {
          name: 'aspectRatio',
          label: 'Aspect Ratio',
          type: 'string',
          options: [
            { label: 'Landscape', value: 'landscape' },
            { label: 'Portrait', value: 'portrait' },
          ],
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
