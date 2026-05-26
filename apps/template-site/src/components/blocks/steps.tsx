import type { Template } from 'tinacms'
import { tinaField } from 'tinacms/dist/react'
import { Container } from '../elements/container'
import { Section, SectionBorder, SectionDividerLines } from '../shared/section'
import { SectionIntroHeader } from './section-intro-header'
import {
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

type StepsBlockData = TinaContentSource & {
  showTopBorder?: boolean | null
  label?: string | null
  heading?: RichTextValue
  intro?: string | null
  steps?: Array<StepItemData | null> | null
}

type StepItemData = TinaContentSource & {
  eyebrow?: string | null
  title?: string | null
  description?: string | null
}

function chunkSteps(steps?: Array<StepItemData | null> | null) {
  if (!steps?.length) return []

  const rows: Array<Array<StepItemData | null>> = []

  for (let i = 0; i < steps.length; i += 2) {
    rows.push(steps.slice(i, i + 2))
  }

  return rows
}

export function StepsBlock({ data }: { data: StepsBlockData }) {
  const rows = chunkSteps(data.steps)

  return (
    <Section id='how-it-works' className='scroll-mt-(--scroll-padding-top)'>
      <SectionIntroHeader
        data={data}
        showTopBorder={data.showTopBorder ?? true}
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
                {renderStepColumn(data, row[0], rowIndex * 2, 0)}
                <div className='bg-olive-950/7 max-lg:hidden' />
                {renderStepColumn(data, row[1], rowIndex * 2 + 1, 1)}
              </div>
            </Container>
          </div>
        ))}
      </div>
    </Section>
  )
}

export const stepsBlockDoc = {
  category: 'process',
  description:
    'Step-by-step process block for explaining how hiring, scheduling, or project delivery works. Use it when clarifying the customer journey will reduce friction before contact.',
  contentNotes: [
    'Steps are automatically numbered by position.',
    'Best with 3-6 steps; the current service pages use four.',
    'Avoid promising timing, pricing, or warranty details unless they are accurate for the client.',
  ],
} satisfies BlockDoc

function renderStepColumn(
  data: StepsBlockData,
  step: StepItemData | null | undefined,
  stepIndex: number,
  columnIndex: 0 | 1
) {
  if (!step) {
    return columnIndex === 0 ? <div key={`empty-${stepIndex}`} /> : null
  }

  return (
    <div
      key={stepIndex}
      className={
        columnIndex === 0
          ? 'py-10 md:py-14 lg:py-16 lg:pr-16'
          : 'relative py-10 md:py-14 lg:py-16 lg:pl-16'
      }
      data-tina-field={tinaField(data, 'steps', stepIndex)}
    >
      {columnIndex === 1 && (
        <>
          <div className='absolute top-0 left-1/2 w-screen -translate-x-1/2 border-t border-olive-950/7 lg:hidden' />
          <div className='absolute top-px left-1/2 w-screen -translate-x-1/2 border-t border-white lg:hidden' />
        </>
      )}
      <div className='flex max-w-2xl flex-col lg:max-w-none'>
        <div className='flex items-center gap-3 text-sm font-[550] tracking-wide text-primary-600'>
          <span>{`Step ${String(stepIndex + 1).padStart(2, '0')}`}</span>
          {step.eyebrow ? (
            <>
              <span
                className='text-base leading-none text-primary-600/80'
                aria-hidden='true'
              >
                •
              </span>
              <span data-tina-field={tinaField(step, 'eyebrow')}>
                {step.eyebrow}
              </span>
            </>
          ) : null}
        </div>
        <div className='mt-4 text-[17px]/7.5 text-olive-600'>
          <span
            className='inline font-[550] text-olive-900'
            data-tina-field={tinaField(step, 'title')}
          >
            {step.title}.
          </span>{' '}
          <span data-tina-field={tinaField(step, 'description')}>
            {step.description}
          </span>
        </div>
      </div>
    </div>
  )
}

export const stepsBlockSchema: Template = {
  name: 'steps',
  label: 'Steps',
  ui: {
    previewSrc: '/block-previews/steps.png',
    defaultItem: {
      showTopBorder: true,
      label: 'How it works',
      heading: richTextRoot(
        paragraphNode(
          textNode('From first call to '),
          textNode('final walkthrough', { italic: true })
        )
      ),
      intro:
        'Use this block to show homeowners what hiring your team looks like. A clear process up front builds trust before the first call.',
      steps: [
        {
          eyebrow: 'Quick first call',
          title: 'Reach out for a quote',
          description:
            'Call, text, or fill out a short form and share a few details about what is going on. A real person confirms the type of work, your address, and an appointment window that fits your schedule.',
        },
        {
          eyebrow: 'On-site assessment',
          title: 'Free evaluation and written estimate',
          description:
            'A technician arrives in a marked truck, walks the job with you, and leaves a flat-rate quote in writing. When more than one approach makes sense, options are laid out side by side so you can compare scope and price without any sales pressure.',
        },
        {
          eyebrow: 'Job day',
          title: 'Work done right the first time',
          description:
            'Once you approve a path forward, the crew shows up on time with the right parts and permits in hand. Floors and finishes get protected, and anything unexpected behind the wall, in the ceiling, or in the panel is explained before extra work begins.',
        },
        {
          eyebrow: 'Closing walkthrough',
          title: 'Final inspection and warranty',
          description:
            'Before the truck leaves, you walk the finished work together, watch everything get tested, and receive your written warranty and care notes. Follow-up support is one call away if anything ever needs attention.',
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
      label: 'Steps',
      name: 'steps',
      ui: {
        itemProps: (item) => ({
          label: item?.title || 'Step',
        }),
        defaultItem: {
          eyebrow: 'Step label',
          title: 'Step title',
          description: 'Step description',
        },
      },
      fields: [
        {
          type: 'string',
          label: 'Eyebrow',
          name: 'eyebrow',
        },
        {
          type: 'string',
          label: 'Title',
          name: 'title',
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
