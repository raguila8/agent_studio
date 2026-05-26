import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import type { Template } from 'tinacms'
import { tinaField } from 'tinacms/dist/react'
import { nucleoIconField } from '../tina/fields/nucleo-icon'
import { NucleoIcon } from '../tina/icons/nucleo'
import { Container } from '../elements/container'
import { Section, SectionBorder, SectionDividerLines } from '../shared/section'
import type { BlockDoc } from './block-doc'

type TinaContentSource = {
  _content_source?: {
    queryId: string
    path: Array<number | string>
  }
}

type TrustBarItemData = TinaContentSource & {
  icon?: string | null
  text?: string | null
}

type TrustBarBlockData = TinaContentSource & {
  items?: Array<TrustBarItemData | null> | null
}

function TrustBar({
  children,
  className,
  columns = 5,
  ...props
}: ComponentProps<'div'> & {
  columns?: 1 | 2 | 3 | 4 | 5
}) {
  const largeLayoutClass = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2 lg:gap-x-32',
    3: 'lg:grid-cols-3 lg:gap-x-32',
    4: 'lg:grid-cols-4 lg:gap-x-8',
    5: 'lg:grid-cols-5',
  }[columns]

  return (
    <div
      className={clsx(
        'grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 sm:gap-x-5',
        largeLayoutClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function TrustBarItem({
  icon,
  text,
  className,
  ...props
}: {
  icon?: ReactNode
  text: ReactNode
} & ComponentProps<'div'>) {
  return (
    <div className={clsx('flex items-start gap-3', className)} {...props}>
      {icon && (
        <div className='mt-0.5 shrink-0 duotone-primary [&_svg]:size-[18px]'>
          {icon}
        </div>
      )}
      <span className='text-[13px]/5 font-medium text-olive-700'>{text}</span>
    </div>
  )
}

export function TrustBarBlock({ data }: { data: TrustBarBlockData }) {
  const items = data.items?.filter((item): item is TrustBarItemData =>
    Boolean(item)
  )
  const columns = Math.min(Math.max(items?.length ?? 0, 1), 5) as
    | 1
    | 2
    | 3
    | 4
    | 5

  return (
    <Section>
      <SectionBorder top='top-[2px]' />
      <SectionDividerLines />
      <Container className='py-12 max-sm:px-4 sm:py-14 lg:py-16'>
        <TrustBar className='w-full' columns={columns}>
          {data.items?.map((item, index) => {
            if (!item) return null

            return (
              <TrustBarItem
                key={index}
                data-tina-field={tinaField(data, 'items', index)}
                icon={
                  item.icon ? (
                    <span data-tina-field={tinaField(item, 'icon')}>
                      <NucleoIcon
                        name={item.icon}
                        title=''
                        aria-hidden='true'
                        className='size-[18px]'
                      />
                    </span>
                  ) : null
                }
                text={
                  <span data-tina-field={tinaField(item, 'text')}>
                    {item.text}
                  </span>
                }
              />
            )
          })}
        </TrustBar>
      </Container>
    </Section>
  )
}

export const trustBarBlockDoc = {
  category: 'trust_proof',
  description:
    'Compact horizontal trust-marker strip with icons and short text. Use it near the top of a page or between major sections to reinforce credibility without interrupting the flow.',
  contentNotes: [
    'Supports 1-5 columns; current pages commonly use four or five items.',
    'Keep each item short enough to scan in one line or two.',
    'Verify licensing, insurance, review, warranty, and emergency-service claims before publishing.',
  ],
} satisfies BlockDoc

export const trustBarBlockSchema: Template = {
  name: 'trustBar',
  label: 'Trust Bar',
  ui: {
    previewSrc: '/block-previews/trustbar.png',
    defaultItem: {
      items: [
        {
          icon: 'shieldCheck',
          text: 'Fully licensed, bonded, and insured for your protection.',
        },
        {
          icon: 'awardCertificate',
          text: '20+ years serving local homeowners and businesses.',
        },
        {
          icon: 'graduationCap',
          text: 'Certified, background-checked technicians on every job.',
        },
        {
          icon: 'calendarClock',
          text: '24/7 emergency service when you need it most.',
        },
        {
          icon: 'heartHandshake',
          text: 'Workmanship guaranteed with upfront, honest pricing.',
        },
      ],
    },
  },
  fields: [
    {
      type: 'object',
      list: true,
      name: 'items',
      label: 'Items',
      ui: {
        itemProps: (item) => ({
          label: item?.text || 'Trust item',
        }),
        defaultItem: {
          icon: 'badgeCheck',
          text: 'Trust bar item',
        },
      },
      fields: [
        nucleoIconField(),
        {
          type: 'string',
          label: 'Text',
          name: 'text',
          ui: {
            component: 'textarea',
          },
        },
      ],
    },
  ],
}
