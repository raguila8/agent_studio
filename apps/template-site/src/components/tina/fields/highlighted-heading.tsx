import type { JSX } from 'react'
import type { TinaField } from 'tinacms'
import {
  StaticTinaMarkdown,
  type TinaMarkdownContent,
} from 'tinacms/dist/rich-text/static'
import { TinaMarkdownLink } from '../elements/tina-markdown-link'

export type RichTextValue = TinaMarkdownContent | TinaMarkdownContent[] | null
type MarkdownChildrenProps = { children: JSX.Element }

export const richTextRoot = (...children: Array<Record<string, unknown>>) => ({
  type: 'root',
  children,
})

export const paragraphNode = (...children: Array<Record<string, unknown>>) => ({
  type: 'p',
  children,
})

export const textNode = (
  text: string,
  marks?: Record<string, string | boolean | undefined>
) => ({
  text,
  ...marks,
})

export function HighlightedHeadingMarkdown({
  content,
}: {
  content: RichTextValue
}) {
  if (!content) return null

  return (
    <StaticTinaMarkdown
      content={content}
      components={{
        p: (props?: MarkdownChildrenProps) => <>{props?.children}</>,
        italic: (props?: MarkdownChildrenProps) => (
          <em className='mr-0.5 ml-1.5 text-primary-500'>{props?.children}</em>
        ),
        a: TinaMarkdownLink,
      }}
    />
  )
}

export function highlightedHeadingField({
  name = 'heading',
  label = 'Heading',
  description = 'Use italic in the toolbar to emphasize words.',
}: {
  name?: string
  label?: string
  description?: string
} = {}): TinaField {
  return {
    type: 'rich-text',
    label,
    name,
    description,
    overrides: {
      toolbar: ['italic'],
    },
  }
}
