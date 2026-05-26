import type { Template } from 'tinacms'
import { tinaField } from 'tinacms/dist/react'
import { Container } from '../elements/container'
import { Section, SectionBorder, SectionDividerLines } from '../shared/section'
import { NucleoIcon } from '../tina/icons/nucleo'
import { nucleoIconField } from '../tina/fields/nucleo-icon'
import {
  highlightedHeadingField,
  paragraphNode,
  richTextRoot,
  textNode,
  type RichTextValue,
} from '../tina/fields/highlighted-heading'
import { SectionIntroHeader } from './section-intro-header'
import type { BlockDoc } from './block-doc'

type TinaContentSource = {
  _content_source?: {
    queryId: string
    path: Array<number | string>
  }
}

type FeatureItem = TinaContentSource & {
  icon?: string | null
  headline?: string | null
  description?: string | null
}

type FeaturesTwoColumnBlockData = TinaContentSource & {
  showTopBorder?: boolean | null
  label?: string | null
  heading?: RichTextValue
  intro?: string | null
  features?: Array<FeatureItem | null> | null
}

function chunkFeatures(features?: Array<FeatureItem | null> | null) {
  if (!features?.length) return []

  const rows: Array<Array<FeatureItem | null>> = []

  for (let i = 0; i < features.length; i += 2) {
    rows.push(features.slice(i, i + 2))
  }

  return rows
}

export function FeaturesTwoColumnBlock({
  data,
}: {
  data: FeaturesTwoColumnBlockData
}) {
  const rows = chunkFeatures(data.features)

  return (
    <Section>
      <SectionIntroHeader
        data={data}
        showTopBorder={data.showTopBorder ?? false}
      />
      <SectionDividerLines />
      <div className='grid grid-cols-1'>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className='group relative'>
            <SectionBorder top={rowIndex > 0 ? 'top-[2px]' : 'top-0'} />
            <Container>
              <div className='group-first:hidden'>
                <SectionDividerLines />
              </div>
              <div className='grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr]'>
                {renderFeatureColumn(data, row[0], rowIndex * 2, 0)}
                <div className='bg-olive-950/7 max-lg:hidden' />
                {renderFeatureColumn(data, row[1], rowIndex * 2 + 1, 1)}
              </div>
            </Container>
          </div>
        ))}
      </div>
    </Section>
  )
}

export const featuresTwoColumnBlockDoc = {
  category: 'features_services',
  description:
    'Two-column feature list with larger icon treatments and room for fuller explanations. Use it when each benefit needs more persuasive detail than the compact icon grid allows.',
  contentNotes: [
    'Items are displayed in rows of two on large screens.',
    'Best with an even number of features, commonly four.',
    'Keep descriptions factual and avoid unverified guarantees or service claims.',
  ],
} satisfies BlockDoc

export const featuresTwoColumnBlockSchema: Template = {
  name: 'featuresTwoColumn',
  label: 'Features Two Column',
  ui: {
    previewSrc: '/block-previews/features-two-column.png',
    defaultItem: {
      showTopBorder: false,
      label: 'Why us',
      heading: richTextRoot(
        paragraphNode(
          textNode('Quality you can see, service you can '),
          textNode('count on', { italic: true })
        )
      ),
      intro:
        "Every job is handled by a licensed pro, priced upfront, and backed by a workmanship warranty. That's how home services should work.",
      features: [
        {
          icon: 'shieldCheck',
          headline: 'Licensed, insured, and code-compliant.',
          description:
            'Every technician on the crew is fully licensed, background-checked, and covered by liability insurance. Permits are pulled when the job calls for it, and every install meets local code, so the work stays protected long after we leave.',
        },
        {
          icon: 'heartHandshake',
          headline: 'Upfront pricing, in writing, before we start.',
          description:
            "You'll see the full cost of the job before any work begins. No hourly meters running in the background, no surprise add-ons at the end, no pressure to approve repairs on the spot. Just a clear scope, a clear price, and a clear decision.",
        },
        {
          icon: 'calendarClock',
          headline: "Same-day service when it can't wait.",
          description:
            'Burst pipes, dead breakers, no heat, leaks in the ceiling. None of it keeps business hours. We hold capacity open every day for emergency calls, and most issues get resolved the same day you reach out.',
        },
        {
          icon: 'awardCertificate',
          headline: 'Workmanship backed by a written warranty.',
          description:
            'Every repair and install is covered by a written workmanship warranty on top of manufacturer coverage. If something we touched fails within the warranty period, we come back and make it right. No fine print, no finger-pointing.',
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
          icon: 'lotus',
          headline: 'Feature headline',
          description: 'Feature description',
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
          name: 'description',
          ui: {
            component: 'textarea',
          },
        },
      ],
    },
  ],
}

function renderFeatureColumn(
  data: FeaturesTwoColumnBlockData,
  feature: FeatureItem | null | undefined,
  featureIndex: number,
  columnIndex: 0 | 1
) {
  if (!feature) {
    return columnIndex === 0 ? <div key={`empty-${featureIndex}`} /> : null
  }

  return (
    <div
      key={featureIndex}
      className={
        columnIndex === 0
          ? 'py-10 md:py-14 lg:py-16 lg:pr-16'
          : 'relative py-10 md:py-14 lg:py-16 lg:pl-16'
      }
      data-tina-field={tinaField(data, 'features', featureIndex)}
    >
      {columnIndex === 1 && (
        <>
          <div className='absolute top-0 left-1/2 w-screen -translate-x-1/2 border-t border-olive-950/7 lg:hidden' />
          <div className='absolute top-px left-1/2 w-screen -translate-x-1/2 border-t border-white lg:hidden' />
        </>
      )}
      <div className='flex max-w-2xl flex-col lg:max-w-none'>
        {feature.icon && (
          <div
            className='flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-primary-600/65 bg-linear-to-bl from-primary-400 to-primary-500 duotone-primary-light shadow-[0_2px_4px_0_rgba(0,0,0,0.04),0_1px_2px_-1px_rgba(0,0,0,0.08),rgba(227,215,212,0.2)] backdrop-blur-sm sm:size-10 sm:rounded-[10px] [&_img]:size-4.5 sm:[&_img]:size-5.5 [&_svg]:size-4.5 sm:[&_svg]:size-5'
            data-tina-field={tinaField(feature, 'icon')}
          >
            <NucleoIcon name={feature.icon} title='' aria-hidden='true' />
          </div>
        )}
        <h3
          className='mt-6 text-lg/8 font-[550] text-olive-900 sm:mt-7'
          data-tina-field={tinaField(feature, 'headline')}
        >
          {feature.headline}
        </h3>
        <div
          className='mt-1.5 text-lg/8 text-olive-600'
          data-tina-field={tinaField(feature, 'description')}
        >
          <p>{feature.description}</p>
        </div>
      </div>
    </div>
  )
}
