import type { Template } from 'tinacms'
import { tinaField } from 'tinacms/dist/react'
import { Container } from '../elements/container'
import { ButtonLink, PlainButtonLink, SoftButtonLink } from '../elements/button'
import { LightWallpaper } from '../elements/wallpaper'
import { Section, SectionBorder, SectionDividerLines } from '../shared/section'
import { SectionHeader } from '../elements/section-header'
import { Subheading } from '../elements/subheading'
import { Text } from '../elements/text'
import { ChevronIcon } from '../icons/chevron-icon'
import {
  HighlightedHeadingMarkdown,
  highlightedHeadingField,
  paragraphNode,
  richTextRoot,
  textNode,
  type RichTextValue,
} from '../tina/fields/highlighted-heading'
import { siteConfig } from '@/lib/site-config'
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
  size?: string | null
  color?: string | null
  showChevron?: boolean | null
}

type DetailItem = TinaContentSource & {
  title?: string | null
  content?: string | null
}

export type CallToActionSimpleData = TinaContentSource & {
  heading?: RichTextValue
  subheadline?: string | null
  showTopBorder?: boolean | null
  primaryAction?: ActionData | null
  secondaryAction?: ActionData | null
  details?: Array<DetailItem | null> | null
}

export const callToActionSimpleDefaultItem: CallToActionSimpleData = {
  heading: richTextRoot(
    paragraphNode(
      textNode("Let's start with a "),
      textNode('free estimate', { italic: true }),
      textNode('.')
    )
  ) as RichTextValue,
  showTopBorder: false,
  subheadline:
    "Tell us about the job and we'll follow up with honest pricing, a clear timeline, and straight answers to your questions, usually within one business day.",
  primaryAction: {
    label: 'Get a free estimate',
    link: '#',
    style: 'button',
    color: 'primary',
    size: 'lg',
    showChevron: false,
  },
  secondaryAction: {
    label: 'Contact us',
    link: '#',
    style: 'plain',
    color: 'primary',
    size: 'lg',
    showChevron: true,
  },
  details: [
    {
      title: 'Springfield',
      content: '123 Main Street\nSpringfield, IL 62701',
    },
    {
      title: 'Madison',
      content: '456 Oak Avenue\nMadison, WI 53703',
    },
  ],
}
const wallpaperThemeColor = siteConfig.theme.wallpaperColor

export function hasCallToActionSimpleContent(
  data?: CallToActionSimpleData | null
) {
  return Boolean(
    data?.heading ||
    data?.subheadline ||
    data?.primaryAction?.label ||
    data?.secondaryAction?.label ||
    data?.details?.some((item) => item?.title || item?.content)
  )
}

export const callToActionSimpleFields = [
  highlightedHeadingField(),
  {
    type: 'boolean',
    label: 'Show Top Border',
    name: 'showTopBorder',
  },
  {
    type: 'string',
    label: 'Description',
    name: 'subheadline',
    ui: {
      component: 'textarea',
    },
  },
  {
    label: 'Primary Action',
    name: 'primaryAction',
    type: 'object',
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
      {
        label: 'Show Chevron',
        name: 'showChevron',
        type: 'boolean',
      },
    ],
  },
  {
    label: 'Secondary Action',
    name: 'secondaryAction',
    type: 'object',
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
      {
        label: 'Show Chevron',
        name: 'showChevron',
        type: 'boolean',
      },
    ],
  },
  {
    type: 'object',
    list: true,
    name: 'details',
    label: 'Bottom Details',
    description:
      'Optional address/hours area shown beneath the actions. Leave empty to hide it.',
    ui: {
      itemProps: (item) => ({
        label: item?.title || 'Detail',
      }),
      defaultItem: {
        title: 'Detail title',
        content: 'Detail content',
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
        label: 'Content',
        name: 'content',
        description: 'Use line breaks to create stacked lines.',
        ui: {
          component: 'textarea',
        },
      },
    ],
  },
] satisfies Template['fields']

function renderAction(action?: ActionData | null) {
  if (!action?.label) return null

  const content = (
    <>
      {action.label}
      {action.showChevron ? <ChevronIcon /> : null}
    </>
  )

  if (action.style === 'soft') {
    return (
      <SoftButtonLink
        href={action.link ?? '#'}
        size={(action.size as 'md' | 'lg') ?? 'md'}
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
        color={
          (action.color as 'dark/light' | 'light' | 'primary') ?? 'primary'
        }
      >
        {content}
      </PlainButtonLink>
    )
  }

  return (
    <ButtonLink
      href={action.link ?? '#'}
      size={(action.size as 'md' | 'lg') ?? 'md'}
      color={
        (action.color as
          | 'dark/light'
          | 'light'
          | 'primary'
          | 'primary-light') ?? 'primary'
      }
    >
      {content}
    </ButtonLink>
  )
}

function renderDetailContent(content?: string | null) {
  if (!content) return null

  return content.split('\n').map((line, index, lines) => (
    <span key={index}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </span>
  ))
}

export function CallToActionSimpleBlock({
  data,
}: {
  data: CallToActionSimpleData
}) {
  const hasActions = data.primaryAction?.label || data.secondaryAction?.label
  const hasDetails = data.details?.some((item) => item?.title || item?.content)

  return (
    <Section>
      {data.showTopBorder ? <SectionDividerLines /> : null}
      <LightWallpaper color={wallpaperThemeColor}>
        <div className='py-16'>
          <SectionBorder />
          <Container className='flex flex-col gap-10'>
            <SectionHeader
              layout='stacked'
              className='max-w-4xl'
              headline={
                data.heading ? (
                  <Subheading data-tina-field={tinaField(data, 'heading')}>
                    <HighlightedHeadingMarkdown content={data.heading} />
                  </Subheading>
                ) : null
              }
              subheadline={
                data.subheadline ? (
                  <Text
                    className='flex max-w-3xl flex-col gap-4 text-pretty'
                    data-tina-field={tinaField(data, 'subheadline')}
                  >
                    <p>{data.subheadline}</p>
                  </Text>
                ) : null
              }
            />

            {hasActions ? (
              <div className='flex items-center gap-4 max-[414px]:flex-col max-[414px]:items-start'>
                {data.primaryAction?.label && (
                  <div data-tina-field={tinaField(data, 'primaryAction')}>
                    {renderAction(data.primaryAction)}
                  </div>
                )}
                {data.secondaryAction?.label && (
                  <div data-tina-field={tinaField(data, 'secondaryAction')}>
                    {renderAction(data.secondaryAction)}
                  </div>
                )}
              </div>
            ) : null}

            {hasDetails ? (
              <>
                <hr className='w-full max-w-2xl border-t border-olive-950/10' />
                <div className='grid w-full max-w-xl gap-6 min-[576px]:grid-cols-2 min-[576px]:gap-2'>
                  {data.details?.map((item, index) => {
                    if (!item || (!item.title && !item.content)) return null

                    return (
                      <div
                        key={index}
                        className='flex flex-col gap-1'
                        data-tina-field={tinaField(data, 'details', index)}
                      >
                        {item.title && (
                          <h3
                            className='text-sm font-semibold text-olive-950'
                            data-tina-field={tinaField(item, 'title')}
                          >
                            {item.title}
                          </h3>
                        )}
                        {item.content && (
                          <p
                            className='text-sm text-olive-700'
                            data-tina-field={tinaField(item, 'content')}
                          >
                            {renderDetailContent(item.content)}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            ) : null}
          </Container>
        </div>
      </LightWallpaper>
    </Section>
  )
}

export const callToActionSimpleBlockDoc = {
  category: 'cta',
  description:
    'Reusable CTA band with highlighted heading, supporting copy, primary and secondary actions, and optional detail columns. Use it near the end of pages to drive estimates, calls, or contact actions.',
  contentNotes: [
    'Best with one primary action and one secondary action.',
    'Bottom details support line breaks and are often used for addresses or hours.',
    'Use empty details when repeated address or hours content would be distracting.',
  ],
} satisfies BlockDoc

export const callToActionSimpleBlockSchema: Template = {
  name: 'callToActionSimple',
  label: 'Call To Action Simple',
  ui: {
    previewSrc: '/block-previews/call-to-action-simple.png',
    defaultItem: callToActionSimpleDefaultItem,
  },
  fields: callToActionSimpleFields,
}
