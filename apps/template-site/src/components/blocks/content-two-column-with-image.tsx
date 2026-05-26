import Image from 'next/image'
import type { JSX } from 'react'
import type { Template } from 'tinacms'
import { tinaField } from 'tinacms/dist/react'
import { StaticTinaMarkdown } from 'tinacms/dist/rich-text/static'
import { Container } from '../elements/container'
import { Section, SectionBorder, SectionDividerLines } from '../shared/section'
import { SectionHeader } from '../elements/section-header'
import { Subheading } from '../elements/subheading'
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

import tradesToolsImage from '@/images/block-fallbacks/content-trades-tools-workbench.jpg'

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

type ContentTwoColumnWithImageBlockData = TinaContentSource & {
  heading?: RichTextValue
  description?: RichTextValue
  photo?: {
    src?: string | null
    alt?: string | null
    width?: number | null
    height?: number | null
  } | null
}

function getImageDimension(value: number | null | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

export function ContentTwoColumnWithImageBlock({
  data,
}: {
  data: ContentTwoColumnWithImageBlockData
}) {
  const imageWidth = getImageDimension(data.photo?.width, 1800)
  const imageHeight = getImageDimension(data.photo?.height, 1600)

  const descriptionComponents = {
    p: (props?: MarkdownChildrenProps) => <p>{props?.children}</p>,
    a: (props?: MarkdownLinkProps) => (
      <TinaMarkdownLink
        url={props?.url}
        className='font-medium text-olive-950 underline decoration-olive-300 underline-offset-4'
      >
        {props?.children}
      </TinaMarkdownLink>
    ),
    ul: (props?: MarkdownChildrenProps) => (
      <ul className='list-disc space-y-2 pl-5'>{props?.children}</ul>
    ),
    ol: (props?: MarkdownChildrenProps) => (
      <ol className='list-decimal space-y-2 pl-5'>{props?.children}</ol>
    ),
    blockquote: (props?: MarkdownChildrenProps) => (
      <blockquote className='border-l-2 border-olive-200 pl-4 italic'>
        {props?.children}
      </blockquote>
    ),
  }

  return (
    <Section>
      <SectionBorder top='top-[2px]' />
      <SectionDividerLines />
      <Container className='py-16'>
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
          <div className='flex flex-col gap-8'>
            <SectionHeader
              layout='stacked'
              headline={
                <Subheading data-tina-field={tinaField(data, 'heading')}>
                  <HighlightedHeadingMarkdown content={data.heading ?? null} />
                </Subheading>
              }
            />
            <div
              className='flex flex-1 overflow-hidden rounded-xl outline -outline-offset-1 outline-black/5 *:object-cover'
              data-tina-field={tinaField(data, 'photo')}
            >
              <Image
                className='aspect-2/1 size-full object-cover'
                src={imageSrcOrFallback(data.photo?.src, tradesToolsImage)}
                width={imageWidth}
                height={imageHeight}
                sizes='(min-width: 1280px) 584px, (min-width: 1024px) calc((100vw - 7rem) / 2), (min-width: 768px) 720px, (min-width: 672px) 624px, calc(100vw - 3rem)'
                alt={data.photo?.alt ?? ''}
              />
            </div>
          </div>

          <div
            className='flex max-w-2xl flex-col gap-4 text-base/7 text-olive-700'
            data-tina-field={tinaField(data, 'description')}
          >
            {data.description && (
              <StaticTinaMarkdown
                content={data.description}
                components={descriptionComponents}
              />
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export const contentTwoColumnWithImageBlockDoc = {
  category: 'content',
  description:
    'Two-column content section with a heading and image on the left and rich text on the right. Use it for story or problem-framing sections where one strong image supports longer copy.',
  contentNotes: [
    'Use a landscape-oriented image with accurate alt text.',
    'The right column supports paragraphs, links, lists, and blockquotes.',
  ],
} satisfies BlockDoc

export const contentTwoColumnWithImageBlockSchema: Template = {
  name: 'contentTwoColumnWithImage',
  label: 'Content Two Column With Image',
  ui: {
    previewSrc: '/block-previews/content-two-column-with-image.png',
    defaultItem: {
      heading: richTextRoot(
        paragraphNode(
          textNode('Stop settling for '),
          textNode('good enough', { italic: true })
        )
      ),
      description: richTextRoot(
        paragraphNode(
          textNode(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
          )
        ),
        paragraphNode(
          textNode(
            'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis. Et quasi architecto beatae vitae dicta sunt explicabo.'
          )
        ),
        paragraphNode(textNode('Nemo enim ipsam voluptatem.')),
        paragraphNode(
          textNode(
            'Quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet. Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt. Ut labore et dolore magnam aliquam quaerat voluptatem.'
          )
        )
      ),
    },
  },
  fields: [
    highlightedHeadingField(),
    {
      type: 'rich-text',
      label: 'Description',
      name: 'description',
      description: 'Markdown content rendered in the right column.',
    },
    {
      type: 'object',
      label: 'Photo',
      name: 'photo',
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
