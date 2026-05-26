import { clsx } from 'clsx/lite'
import type { ReactNode } from 'react'
import type { Template } from 'tinacms'
import { tinaField } from 'tinacms/dist/react'
import { Container } from '../elements/container'
import { Eyebrow } from '../elements/eyebrow'
import { Heading } from '../elements/heading'
import { SectionHeader } from '../elements/section-header'
import { Subheading } from '../elements/subheading'
import { Text } from '../elements/text'
import { Section, SectionBorder, SectionDividerLines } from '../shared/section'
import {
  HighlightedHeadingMarkdown,
  highlightedHeadingField,
  paragraphNode,
  richTextRoot,
  textNode,
  type RichTextValue,
} from '../tina/fields/highlighted-heading'
import type { BlockDoc } from './block-doc'

type TinaContentSource = {
  _content_source?: {
    queryId: string
    path: Array<number | string>
  }
}

export type SectionIntroHeaderData = TinaContentSource & {
  size?: 'default' | 'large' | null
  showTopBorder?: boolean | null
  label?: string | null
  heading?: RichTextValue
  intro?: string | null
}

export function SectionIntroHeader({
  data,
  showTopBorder = true,
  action,
}: {
  data: SectionIntroHeaderData
  showTopBorder?: boolean
  action?: ReactNode
}) {
  if (!data.label && !data.heading && !data.intro && !action) return null

  const size = data.size === 'large' ? 'large' : 'default'

  return (
    <header className='relative'>
      <SectionBorder top={showTopBorder ? 'top-[2px]' : 'top-0'} />
      {showTopBorder ? <SectionDividerLines /> : null}
      <Container className='flex flex-col'>
        <SectionHeader
          className={clsx(size === 'large' && 'py-12 lg:gap-12')}
          asideClassName={clsx(
            size === 'large' && 'max-w-lg pl-1 lg:max-w-md lg:pl-0'
          )}
          eyebrow={
            data.label ? (
              <Eyebrow data-tina-field={tinaField(data, 'label')}>
                {data.label}
              </Eyebrow>
            ) : null
          }
          headline={
            data.heading ? (
              size === 'large' ? (
                <Heading
                  data-tina-field={tinaField(data, 'heading')}
                  className='max-w-3xl max-[1028px]:text-wrap sm:text-[60px]/18!'
                >
                  <HighlightedHeadingMarkdown content={data.heading} />
                </Heading>
              ) : (
                <Subheading
                  data-tina-field={tinaField(data, 'heading')}
                  className='max-w-2xl'
                >
                  <HighlightedHeadingMarkdown content={data.heading} />
                </Subheading>
              )
            ) : null
          }
          subheadline={
            data.intro ? (
              <Text
                className={clsx(
                  'text-left text-pretty',
                  size === 'default' && 'text-[15px]/5 lg:text-sm/6'
                )}
                data-tina-field={tinaField(data, 'intro')}
              >
                <p>{data.intro}</p>
              </Text>
            ) : null
          }
          action={action}
        />
      </Container>
    </header>
  )
}

export function SectionIntroHeaderBlock({
  data,
}: {
  data: SectionIntroHeaderData
}) {
  return (
    <Section>
      <SectionIntroHeader
        data={data}
        showTopBorder={data.showTopBorder ?? true}
      />
    </Section>
  )
}

export const sectionIntroHeaderBlockDoc = {
  category: 'hero_intro',
  description:
    'Standalone section header with eyebrow, highlighted heading, and short intro copy. Use it to introduce a page section or a simple page header when no hero image or CTA is needed.',
  contentNotes: [
    'Keep intro copy short; this block is a header, not a long prose section.',
    'Use the large size for page-level intros and default size for section intros.',
  ],
} satisfies BlockDoc

export const sectionIntroHeaderBlockSchema: Template = {
  name: 'sectionIntroHeader',
  label: 'Intro Header',
  ui: {
    previewSrc: '/block-previews/section-intro-header.png',
    defaultItem: {
      size: 'default',
      showTopBorder: true,
      label: 'Section label',
      heading: richTextRoot(
        paragraphNode(
          textNode('Write a focused headline with '),
          textNode('one emphasized phrase', { italic: true })
        )
      ),
      intro:
        'Add a short supporting paragraph that sets context for the section and helps visitors understand what comes next.',
    },
  },
  fields: [
    {
      type: 'string',
      label: 'Size',
      name: 'size',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Large',
          value: 'large',
        },
      ],
    },
    {
      type: 'boolean',
      label: 'Show Top Border',
      name: 'showTopBorder',
    },
    {
      type: 'string',
      label: 'Eyebrow',
      name: 'label',
    },
    highlightedHeadingField(),
    {
      type: 'string',
      label: 'Subheadline',
      name: 'intro',
      ui: {
        component: 'textarea',
      },
    },
  ],
}
