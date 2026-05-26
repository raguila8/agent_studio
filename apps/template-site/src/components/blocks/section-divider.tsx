import type { ComponentProps } from 'react'
import type { Template } from 'tinacms'
import { tinaField } from 'tinacms/dist/react'
import { Section, SectionBorder, SectionDividerLines } from '../shared/section'
import type { BlockDoc } from './block-doc'

const dividerSpacingClassNames = {
  compact: 'h-8 md:h-10 lg:h-12',
  default: 'h-12 md:h-14 lg:h-16',
} as const

function BlockSectionDivider({
  size = 'default',
  className,
  ...props
}: {
  size?: keyof typeof dividerSpacingClassNames
} & Omit<ComponentProps<'section'>, 'children'>) {
  return (
    <Section className={className} {...props}>
      <SectionBorder top='top-[2px]' bottom='bottom-[2px]' />
      <SectionDividerLines />
      <div className={dividerSpacingClassNames[size]} />
      <SectionDividerLines />
    </Section>
  )
}

export function SectionDividerBlock({
  data,
}: {
  data?: {
    size?: 'compact' | 'default' | null
  }
}) {
  return (
    <BlockSectionDivider
      size={data?.size === 'compact' ? 'compact' : 'default'}
      data-tina-field={data ? tinaField(data, 'size') : undefined}
    />
  )
}

export const sectionDividerBlockDoc = {
  category: 'utility',
  description:
    'Visual spacing and divider block used to separate adjacent content sections. Use it when page rhythm needs a deliberate break between reusable blocks.',
  contentNotes: [
    'Supports default and compact spacing.',
    'Do not use it as content; it only controls separation and rhythm.',
  ],
} satisfies BlockDoc

export const sectionDividerBlockSchema: Template = {
  name: 'sectionDivider',
  label: 'Section Divider',
  ui: {
    previewSrc: '/block-previews/section-divider.png',
    defaultItem: {
      size: 'default',
    },
  },
  fields: [
    {
      type: 'string',
      name: 'size',
      label: 'Size',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Compact',
          value: 'compact',
        },
      ],
    },
  ],
}
