import { clsx } from 'clsx/lite'
import Image from 'next/image'
import type { Template } from 'tinacms'
import { tinaField } from 'tinacms/dist/react'
import { StaticTinaMarkdown } from 'tinacms/dist/rich-text/static'
import { imageSrcOrFallback } from '@/lib/images'
import marcusAvatar from '@/images/block-fallbacks/avatars/marcus-eldridge.jpg'
import { Container } from '../elements/container'
import {
  paragraphNode,
  richTextRoot,
  textNode,
  type RichTextValue,
} from '../tina/fields/highlighted-heading'
import { TinaMarkdownLink } from '../tina/elements/tina-markdown-link'
import { ImageWithDimensionsField } from '../tina/inputs/image-with-dimensions'
import { Section, SectionBorder } from '../shared/section'
import type { BlockDoc } from './block-doc'

// Tina passes `form` to custom fields at runtime, but the schema component type
// used here does not expose that documented prop.
const imageWithDimensionsField = ImageWithDimensionsField as never

type TinaContentSource = {
  _content_source?: {
    queryId: string
    path: Array<number | string>
  }
}

type TestimonialWithLargeQuoteBlockData = TinaContentSource & {
  quote?: RichTextValue
  image?: {
    src?: string | null
    alt?: string | null
    width?: number | null
    height?: number | null
  } | null
  name?: string | null
  byline?: string | null
}

function getImageDimension(value: number | null | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

export function TestimonialWithLargeQuoteBlock({
  data,
}: {
  data: TestimonialWithLargeQuoteBlockData
}) {
  const imageSrc = imageSrcOrFallback(data.image?.src, marcusAvatar)
  const hasImage = Boolean(imageSrc)
  const imageWidth = getImageDimension(data.image?.width, 96)
  const imageHeight = getImageDimension(data.image?.height, 96)

  return (
    <Section className='pt-16 pb-14'>
      <SectionBorder />
      <Container>
        <figure className='text-olive-950'>
          <blockquote
            className="mx-auto flex max-w-240 flex-col gap-4 text-center font-display text-[2rem]/12 tracking-tight text-pretty *:first:before:content-['“'] *:last:after:content-['”'] sm:text-5xl/16"
            data-tina-field={tinaField(data, 'quote')}
          >
            {data.quote ? (
              <StaticTinaMarkdown
                content={data.quote}
                components={{ a: TinaMarkdownLink }}
              />
            ) : null}
          </blockquote>
          <figcaption
            className={clsx(
              'flex flex-col items-center',
              hasImage ? 'mt-16' : 'mt-10'
            )}
          >
            {imageSrc ? (
              <div
                className='flex size-12 overflow-hidden rounded-full outline -outline-offset-1 outline-black/5 *:size-full *:object-cover'
                data-tina-field={tinaField(data, 'image')}
              >
                <Image
                  src={imageSrc}
                  alt={data.image?.alt ?? ''}
                  width={imageWidth}
                  height={imageHeight}
                  sizes='48px'
                />
              </div>
            ) : null}
            {data.name ? (
              <p
                className={clsx(
                  'text-center text-sm/6 font-semibold',
                  hasImage ? 'mt-4' : undefined
                )}
                data-tina-field={tinaField(data, 'name')}
              >
                {data.name}
              </p>
            ) : null}
            {data.byline ? (
              <p
                className='text-center text-sm/6 text-olive-700'
                data-tina-field={tinaField(data, 'byline')}
              >
                {data.byline}
              </p>
            ) : null}
          </figcaption>
        </figure>
      </Container>
    </Section>
  )
}

export const testimonialWithLargeQuoteBlockDoc = {
  category: 'testimonials',
  description:
    'Single large testimonial quote with optional avatar, name, and byline. Use it as a focused proof point between content sections or near the end of a service page.',
  contentNotes: [
    'A single paragraph quote works best.',
    'Use real customer quotes only with permission or approved source material.',
    'Name, byline, rating context, and image alt text should not imply facts that are not verified.',
  ],
} satisfies BlockDoc

export const testimonialWithLargeQuoteBlockSchema: Template = {
  name: 'testimonialWithLargeQuote',
  label: 'Testimonial With Large Quote',
  ui: {
    previewSrc: '/block-previews/testimonial-with-large-quote.png',
    defaultItem: {
      quote: richTextRoot(
        paragraphNode(
          textNode(
            'Called Friday afternoon expecting voicemail, and a real person answered. They were out the next morning, gave us a clear price before starting any work, and finished the job in a single visit. Honest, professional, and respectful of our home from start to finish.'
          )
        )
      ),
      image: { alt: 'Marcus Eldridge' },
      name: 'Marcus Eldridge',
      byline: 'Emergency service call',
    },
  },
  fields: [
    {
      type: 'rich-text',
      label: 'Quote',
      name: 'quote',
      description:
        'Rendered as the large centered testimonial quote. A single paragraph works best.',
      required: true,
    },
    {
      type: 'object',
      label: 'Image',
      name: 'image',
      description: 'Optional circular headshot shown above the name.',
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
      type: 'string',
      label: 'Name',
      name: 'name',
      required: true,
    },
    {
      type: 'string',
      label: 'Byline',
      name: 'byline',
      required: true,
    },
  ],
}
