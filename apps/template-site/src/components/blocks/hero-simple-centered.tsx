import Image from 'next/image'
import type { Template } from 'tinacms'
import { tinaField } from 'tinacms/dist/react'
import { StaticTinaMarkdown } from 'tinacms/dist/rich-text/static'
import {
  ButtonLink,
  PlainButtonLink,
  SoftButtonLink,
} from '@/components/elements/button'
import { ArrowNarrowRightIcon } from '@/components/icons/arrow-narrow-right-icon'
import { imageSrcOrFallback } from '@/lib/images'
import defaultAvatar from '@/images/perry.png'
import { Container } from '../elements/container'
import { Eyebrow } from '../elements/eyebrow'
import { Heading } from '../elements/heading'
import {
  HighlightedHeadingMarkdown,
  highlightedHeadingField,
  paragraphNode,
  richTextRoot,
  textNode,
  type RichTextValue,
} from '../tina/fields/highlighted-heading'
import { TinaMarkdownLink } from '../tina/elements/tina-markdown-link'
import { Section, SectionBorder, SectionDividerLine } from '../shared/section'
import type { BlockDoc } from './block-doc'

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

type ActionSize = 'md' | 'lg'
type PlainActionColor = 'dark/light' | 'light' | 'primary'
type ButtonActionColor = PlainActionColor | 'primary-light'

type ImageData = {
  src?: string | null
  alt?: string | null
} | null

type FooterData =
  | (TinaContentSource & {
      founderName?: string | null
      label?: string | null
      avatar?: ImageData
    })
  | null

type HeroSimpleCenteredBlockData = TinaContentSource & {
  label?: string | null
  heading?: RichTextValue
  body?: RichTextValue
  actions?: Array<ActionData | null> | null
  footer?: FooterData
}

function getActionSize(size?: string | null): ActionSize {
  return size === 'lg' ? 'lg' : 'md'
}

function getPlainActionColor(color?: string | null): PlainActionColor {
  if (color === 'light') return 'dark/light'
  if (color === 'primary-light') return 'primary'
  if (color === 'primary') return 'primary'
  return 'dark/light'
}

function getButtonActionColor(color?: string | null): ButtonActionColor {
  if (color === 'light' || color === 'primary-light') return 'primary'
  if (color === 'dark/light') return 'dark/light'
  return 'primary'
}

function renderAction(action?: ActionData | null) {
  if (!action?.label) return null

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
        size={getActionSize(action.size)}
      >
        {content}
      </SoftButtonLink>
    )
  }

  if (action.style === 'plain') {
    return (
      <PlainButtonLink
        href={action.link ?? '#'}
        size={getActionSize(action.size)}
        color={getPlainActionColor(action.color)}
      >
        {content}
      </PlainButtonLink>
    )
  }

  return (
    <ButtonLink
      href={action.link ?? '#'}
      size={getActionSize(action.size)}
      color={getButtonActionColor(action.color)}
    >
      {content}
    </ButtonLink>
  )
}

export function HeroSimpleCenteredBlock({
  data,
}: {
  data: HeroSimpleCenteredBlockData
}) {
  const hasActions = data.actions?.some((action) => action?.label)

  return (
    <Section>
      <SectionDividerLine color='white' />
      <SectionBorder top='top-px' />
      <div className='py-16'>
        <Container className='flex flex-col items-center'>
          {data.label ? (
            <Eyebrow data-tina-field={tinaField(data, 'label')}>
              {data.label}
            </Eyebrow>
          ) : null}
          {data.heading ? (
            <Heading
              className='mt-3 max-w-5xl text-center'
              data-tina-field={tinaField(data, 'heading')}
            >
              <HighlightedHeadingMarkdown content={data.heading} />
            </Heading>
          ) : null}
          {data.body ? (
            <div
              className='prose prose-lg mx-auto mt-8 w-full max-w-3xl text-center'
              data-tina-field={tinaField(data, 'body')}
            >
              <StaticTinaMarkdown
                content={data.body}
                components={{ a: TinaMarkdownLink }}
              />
            </div>
          ) : null}
          {hasActions ? (
            <div className='mt-10 flex flex-wrap items-center justify-center gap-4'>
              {data.actions?.map((action, index) => {
                if (!action?.label) return null

                return (
                  <div
                    key={index}
                    data-tina-field={tinaField(data, 'actions', index)}
                  >
                    {renderAction(action)}
                  </div>
                )
              })}
            </div>
          ) : null}
          {data.footer?.founderName || data.footer?.label ? (
            <div className='mt-12 flex flex-col items-center sm:mt-14'>
              {data.footer?.founderName ? (
                <div
                  className='font-signature text-5xl leading-none text-olive-950 sm:text-6xl'
                  data-tina-field={tinaField(data.footer, 'founderName')}
                >
                  {data.footer.founderName}
                </div>
              ) : null}
              <div
                className='mt-6 size-12 shrink-0 overflow-hidden rounded-full outline -outline-offset-1 outline-black/5 sm:mt-8'
                data-tina-field={tinaField(data.footer, 'avatar')}
              >
                <Image
                  src={imageSrcOrFallback(
                    data.footer?.avatar?.src,
                    defaultAvatar
                  )}
                  alt={data.footer?.avatar?.alt ?? ''}
                  width={96}
                  height={96}
                  className='size-full object-cover'
                />
              </div>
              {data.footer?.founderName ? (
                <p
                  className='mt-3 text-sm font-semibold text-olive-950'
                  data-tina-field={tinaField(data.footer, 'founderName')}
                >
                  {data.footer.founderName}
                </p>
              ) : null}
              {data.footer?.label ? (
                <p
                  className='mt-1 text-sm text-olive-700'
                  data-tina-field={tinaField(data.footer, 'label')}
                >
                  {data.footer.label}
                </p>
              ) : null}
            </div>
          ) : null}
        </Container>
      </div>
    </Section>
  )
}

export const heroSimpleCenteredBlockDoc = {
  category: 'hero_intro',
  description:
    'Centered text hero for pages that need a clean introduction without a large background image. Use it for overview or about-style pages where the copy should lead.',
  contentNotes: [
    'Works well with one or two actions beneath the intro copy.',
    'Only use the optional founder/footer fields when the person, role, and image are real and approved.',
  ],
} satisfies BlockDoc

export const heroSimpleCenteredBlockSchema: Template = {
  name: 'heroSimpleCentered',
  label: 'Hero Simple Centered',
  ui: {
    previewSrc: '/block-previews/hero-simple-centered.png',
    defaultItem: {
      label: 'About us',
      heading: richTextRoot(
        paragraphNode(
          textNode('Write your headline here '),
          textNode('in your own words.', { italic: true })
        )
      ),
      body: richTextRoot(
        paragraphNode(
          textNode(
            'Salami ham shankle kevin filet round hock cow ribeye hamburger porchetta swine. Prosciutto tongue drumstick short venison ham doner bone.'
          )
        )
      ),
      actions: [
        {
          label: 'Request free estimate',
          link: '#',
          style: 'button',
          color: 'primary',
          size: 'lg',
          showChevron: false,
        },
        {
          label: 'Learn more',
          link: '#',
          style: 'plain',
          color: 'dark/light',
          size: 'lg',
          showChevron: true,
        },
      ],
    },
  },
  fields: [
    {
      type: 'string',
      label: 'Eyebrow',
      name: 'label',
    },
    highlightedHeadingField({
      name: 'heading',
      label: 'Headline',
      description: 'Use italic in the toolbar to highlight a word or phrase.',
    }),
    {
      type: 'rich-text',
      label: 'Subheadline',
      name: 'body',
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
          color: 'primary',
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
      label: 'Footer',
      name: 'footer',
      description:
        'Optional centered signature with avatar, name, and role shown below the actions.',
      fields: [
        {
          type: 'string',
          label: 'Founder name',
          name: 'founderName',
          description:
            'Shown as the signature (in script) and next to the avatar.',
        },
        {
          type: 'object',
          label: 'Avatar',
          name: 'avatar',
          description: 'Circular headshot shown next to the founder name.',
          fields: [
            {
              name: 'src',
              label: 'Image source',
              type: 'image',
            },
            {
              name: 'alt',
              label: 'Alt text',
              type: 'string',
            },
          ],
        },
        {
          type: 'string',
          label: 'Label',
          name: 'label',
          description: 'Role or subtitle shown under the founder name.',
        },
      ],
    },
  ],
}
