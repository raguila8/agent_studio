import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import type { Template } from 'tinacms'
import { tinaField } from 'tinacms/dist/react'
import { Container } from '../elements/container'
import { Section, SectionBorder, SectionDividerLines } from '../shared/section'
import { nucleoIconField } from '../tina/fields/nucleo-icon'
import {
  highlightedHeadingField,
  paragraphNode,
  richTextRoot,
  textNode,
  type RichTextValue,
} from '../tina/fields/highlighted-heading'
import { NucleoIcon } from '../tina/icons/nucleo'
import { SectionIntroHeader } from './section-intro-header'
import type { BlockDoc } from './block-doc'

type TinaContentSource = {
  _content_source?: {
    queryId: string
    path: Array<number | string>
  }
}

type FeatureItemData = TinaContentSource & {
  icon?: string | null
  headline?: string | null
  subheadline?: string | null
}

type FeaturesIconGridBlockData = TinaContentSource & {
  headerPresentation?: {
    showTopBorder?: boolean | null
  } | null
  showTopBorder?: boolean | null
  label?: string | null
  heading?: RichTextValue
  intro?: string | null
  features?: Array<FeatureItemData | null> | null
}

function Feature({
  icon,
  headline,
  subheadline,
  className,
  ...props
}: {
  icon?: ReactNode
  headline: ReactNode
  subheadline: ReactNode
} & ComponentProps<'div'>) {
  return (
    <div
      className={clsx('flex flex-col gap-1.5 text-sm/7', className)}
      {...props}
    >
      <div className='flex items-start gap-3.25 text-olive-950'>
        {icon && <div className='flex size-3.25 h-lh items-center'>{icon}</div>}
        <h3 className='font-[550]'>{headline}</h3>
      </div>
      <div className='flex flex-col gap-4 text-olive-700'>{subheadline}</div>
    </div>
  )
}

export function FeaturesIconGridBlock({
  data,
}: {
  data: FeaturesIconGridBlockData
}) {
  const showTopBorder =
    data.showTopBorder ?? data.headerPresentation?.showTopBorder ?? true
  const visibleFeatures =
    data.features?.filter((feature) =>
      Boolean(feature?.headline || feature?.subheadline || feature?.icon)
    ) ?? []
  const hasFeatures = visibleFeatures.length > 0
  const useThreeColumns = [3, 5, 6].includes(visibleFeatures.length)
  const largeColumnsClass = useThreeColumns
    ? 'lg:grid-cols-3'
    : 'lg:grid-cols-4'

  return (
    <Section>
      <SectionIntroHeader data={data} showTopBorder={showTopBorder} />
      {hasFeatures ? (
        <div className='relative'>
          <SectionBorder top='top-[2px]' />
          <SectionDividerLines />
          <Container className='py-12 sm:py-16'>
            <div
              className={`grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 ${largeColumnsClass} lg:gap-8 xl:gap-10`}
            >
              {data.features?.map((feature, index) => {
                if (
                  !feature?.headline &&
                  !feature?.subheadline &&
                  !feature?.icon
                ) {
                  return null
                }

                return (
                  <Feature
                    key={index}
                    data-tina-field={tinaField(data, 'features', index)}
                    icon={
                      feature.icon ? (
                        <span
                          className='duotone-primary [&_svg]:size-4'
                          data-tina-field={tinaField(feature, 'icon')}
                        >
                          <NucleoIcon
                            name={feature.icon}
                            title=''
                            aria-hidden='true'
                          />
                        </span>
                      ) : null
                    }
                    headline={
                      <span data-tina-field={tinaField(feature, 'headline')}>
                        {feature.headline}
                      </span>
                    }
                    subheadline={
                      feature.subheadline ? (
                        <p data-tina-field={tinaField(feature, 'subheadline')}>
                          {feature.subheadline}
                        </p>
                      ) : null
                    }
                  />
                )
              })}
            </div>
          </Container>
        </div>
      ) : null}
    </Section>
  )
}

export const featuresIconGridBlockDoc = {
  category: 'features_services',
  description:
    'Compact icon grid for service scopes, benefits, standards, or common job types. Use it when visitors need to scan several short items quickly.',
  contentNotes: [
    'Works especially well with 3, 5, 6, or 8 items.',
    'Keep each item to a short headline and one concise description.',
    'Verify credentials, availability, ratings, and warranty claims before using them as feature copy.',
  ],
} satisfies BlockDoc

export const featuresIconGridBlockSchema: Template = {
  name: 'featuresIconGrid',
  label: 'Features Icon Grid',
  ui: {
    previewSrc: '/block-previews/features-icon-grid.png',
    defaultItem: {
      showTopBorder: true,
      label: 'Why homeowners choose us',
      heading: richTextRoot(
        paragraphNode(
          textNode('Service homeowners can '),
          textNode('count on', { italic: true })
        )
      ),
      intro:
        'Use this section to share what makes your team different. Customers are not just hiring a service. They are letting someone into their home, and the standards behind the work matter just as much as the work itself.',
      features: [
        {
          icon: 'shieldCheck',
          headline: 'Licensed, bonded, and insured',
          subheadline:
            'Every job is backed by the credentials, coverage, and accountability you should expect from a professional crew working on your property.',
        },
        {
          icon: 'hourglassStart',
          headline: 'Fast response when it matters',
          subheadline:
            'Leaks, outages, and storm damage do not wait. Same-day and emergency appointments keep small problems from turning into expensive ones.',
        },
        {
          icon: 'badgeCheck',
          headline: 'Upfront pricing with no surprises',
          subheadline:
            'Customers see the full cost before any work begins. No hidden fees, no pressure, and no guessing what the final invoice will look like.',
        },
        {
          icon: 'awardCertificate',
          headline: 'Workmanship guaranteed in writing',
          subheadline:
            'Every install and repair is covered by a clear written warranty, so customers know the job is supported long after the truck leaves.',
        },
        {
          icon: 'heartHandshake',
          headline: 'A local team that stands behind the work',
          subheadline:
            'Friendly technicians treat your home with respect, walk through the finished work, and answer any questions before they head out.',
        },
        {
          icon: 'stars',
          headline: 'A reputation built on five-star reviews',
          subheadline:
            'Years of happy customers and steady word of mouth from neighbors who trust the team enough to recommend it to friends and family.',
        },
      ],
    },
  },
  fields: [
    {
      type: 'boolean',
      label: 'Show Top Border',
      name: 'showTopBorder',
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
      type: 'object',
      list: true,
      name: 'features',
      label: 'Features',
      ui: {
        itemProps: (item) => ({
          label: item?.headline || 'Feature',
        }),
        defaultItem: {
          icon: 'leaf',
          headline: 'Feature headline',
          subheadline: 'Feature description',
        },
      },
      fields: [
        nucleoIconField(),
        {
          type: 'string',
          label: 'Headline',
          name: 'headline',
        },
        {
          type: 'string',
          label: 'Description',
          name: 'subheadline',
          ui: {
            component: 'textarea',
          },
        },
      ],
    },
  ],
}
