import type { JSX } from 'react'
import type { Template } from 'tinacms'
import { tinaField } from 'tinacms/dist/react'
import { StaticTinaMarkdown } from 'tinacms/dist/rich-text/static'
import { Container } from '../elements/container'
import { Section, SectionBorder, SectionDividerLines } from '../shared/section'
import { SectionIntroHeader } from './section-intro-header'
import { IconCircleCheck3OutlineDuo18 } from 'nucleo-ui-outline-duo-18'
import {
  highlightedHeadingField,
  paragraphNode,
  richTextRoot,
  textNode,
  type RichTextValue,
} from '../tina/fields/highlighted-heading'
import { TinaMarkdownLink } from '../tina/elements/tina-markdown-link'
import type { BlockDoc } from './block-doc'

type TinaContentSource = {
  _content_source?: {
    queryId: string
    path: Array<number | string>
  }
}

type MarkdownChildrenProps = { children: JSX.Element }
type MarkdownLinkProps = { url: string; children: JSX.Element }

type ContentTwoColumnSimpleColumns = TinaContentSource & {
  left?: RichTextValue
  right?: RichTextValue
}

type ContentTwoColumnSimpleBlockData = TinaContentSource & {
  label?: string | null
  heading?: RichTextValue
  intro?: string | null
  content?: ContentTwoColumnSimpleColumns | null
}

export function ContentTwoColumnSimpleBlock({
  data,
}: {
  data: ContentTwoColumnSimpleBlockData
}) {
  const markdownComponents = {
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

  return (
    <Section>
      <SectionIntroHeader data={data} />
      {data.content && (
        <div className='relative'>
          <SectionBorder top='top-[2px]' />
          <SectionDividerLines />
          <Container>
            <div
              className='grid grid-cols-1 gap-4 py-12 text-base/7 text-olive-700 sm:py-16 md:grid-cols-2 md:gap-16'
              data-tina-field={tinaField(data, 'content')}
            >
              {data.content?.left && (
                <div
                  data-tina-field={tinaField(data.content, 'left')}
                  className='flex flex-col gap-4 text-base/7 text-olive-700'
                >
                  <StaticTinaMarkdown
                    content={data.content.left}
                    components={markdownComponents}
                  />
                </div>
              )}
              {data.content?.right && (
                <div
                  data-tina-field={tinaField(data.content, 'right')}
                  className='flex flex-col gap-4 text-base/7 text-olive-700'
                >
                  <StaticTinaMarkdown
                    content={data.content.right}
                    components={markdownComponents}
                  />
                </div>
              )}
            </div>
          </Container>
        </div>
      )}
    </Section>
  )
}

export const contentTwoColumnSimpleBlockDoc = {
  category: 'content',
  description:
    'Two-column prose block for explaining a topic in more detail after an intro header. Use it when copy benefits from side-by-side context, supporting explanation, or short checkmarked lists.',
  contentNotes: [
    'Both columns support rich text; unordered lists render as checkmarked items.',
    'Works best with balanced left and right column lengths.',
  ],
} satisfies BlockDoc

export const contentTwoColumnSimpleBlockSchema: Template = {
  name: 'contentTwoColumnSimple',
  label: 'Content Two Column Simple',
  ui: {
    previewSrc: '/block-previews/content-two-column-simple.png',
    defaultItem: {
      label: 'Built for homeowners',
      heading: richTextRoot(
        paragraphNode(
          textNode('Skilled work, '),
          textNode('honest pricing', { italic: true }),
          textNode(', no surprises')
        )
      ),
      intro:
        'From quick repairs to full installations, every job is handled by licensed professionals who treat your home with care and stand behind their work.',
      content: {
        left: richTextRoot(
          paragraphNode(
            textNode(
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nulla vitae elit libero, a pharetra augue. Donec sed odio dui, fusce dapibus tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod.'
            )
          ),
          paragraphNode(
            textNode(
              'Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Sed posuere consectetur est at lobortis. Nullam quis risus eget urna mollis ornare vel eu leo. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus, fusce dapibus tellus ac cursus commodo nibh est, ut maximus sapien luctus eget.'
            )
          )
        ),
        right: richTextRoot(
          paragraphNode(
            textNode(
              'Donec ullamcorper nulla non metus auctor fringilla porttitor at eget quam libero:'
            )
          ),
          {
            type: 'ul',
            children: [
              {
                type: 'li',
                children: [
                  paragraphNode(
                    textNode(
                      'Cras mattis consectetur purus sit amet fermentum, nullam quis risus eget urna mollis ornare'
                    )
                  ),
                ],
              },
              {
                type: 'li',
                children: [
                  paragraphNode(
                    textNode(
                      'Sed posuere consectetur est at lobortis, aenean eu leo quam pellentesque ornare sem lacinia quam venenatis vestibulum mauris massa vivamus aliquet elit ac nisl ornare vel'
                    )
                  ),
                ],
              },
              {
                type: 'li',
                children: [
                  paragraphNode(
                    textNode(
                      'Curabitur blandit tempus porttitor, vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor at eget metus magna mollis euismod commodo luctus nisi erat porttitor'
                    )
                  ),
                ],
              },
            ],
          },
          paragraphNode(
            textNode(
              'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum nunc velit dictum, ut maximus sapien luctus eget at lobortis.'
            )
          )
        ),
      },
    },
  },
  fields: [
    {
      type: 'string',
      label: 'Eyebrow',
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
      label: 'Content',
      name: 'content',
      fields: [
        {
          type: 'rich-text',
          label: 'Left Column',
          name: 'left',
          description:
            'Supports paragraphs and unordered lists. List items render with the content-split-with-portrait checkmark style.',
        },
        {
          type: 'rich-text',
          label: 'Right Column',
          name: 'right',
          description:
            'Supports paragraphs and unordered lists. List items render with the content-split-with-portrait checkmark style.',
        },
      ],
    },
  ],
}
