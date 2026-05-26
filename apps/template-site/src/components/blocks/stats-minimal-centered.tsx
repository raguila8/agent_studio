import { clsx } from 'clsx/lite'
import type { Template } from 'tinacms'
import { tinaField } from 'tinacms/dist/react'
import { Container } from '../elements/container'
import {
  Section,
  SectionBorder,
  SectionDividerLines,
  defaultSectionSize,
  sectionSizeField,
  type SectionSize,
} from '../shared/section'
import { LightWallpaper, Wallpaper } from '../elements/wallpaper'
import { siteConfig } from '@/lib/site-config'
import type { BlockDoc } from './block-doc'

type TinaContentSource = {
  _content_source?: {
    queryId: string
    path: Array<number | string>
  }
}

type StatItemData = TinaContentSource & {
  value?: string | null
  label?: string | null
}

type BackgroundVariant = 'dark' | 'light'

const defaultBackgroundVariant: BackgroundVariant = 'light'
const wallpaperThemeColor = siteConfig.theme.wallpaperColor

type StatsMinimalCenteredBlockData = TinaContentSource & {
  backgroundVariant?: BackgroundVariant | null
  sectionSize?: SectionSize | null
  stats?: Array<StatItemData | null> | null
}

function getColumnClass(count: number) {
  const clamped = Math.min(Math.max(count, 1), 6)
  return {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
  }[clamped]
}

export function StatsMinimalCenteredBlock({
  data,
}: {
  data: StatsMinimalCenteredBlockData
}) {
  const backgroundVariant =
    data.backgroundVariant === 'dark' ? 'dark' : defaultBackgroundVariant
  const isLightBackground = backgroundVariant === 'light'
  const WallpaperComponent = isLightBackground ? LightWallpaper : Wallpaper
  const wallpaperColor = isLightBackground ? wallpaperThemeColor : 'primary'

  const stats = (data.stats ?? []).filter((item): item is StatItemData =>
    Boolean(item?.value || item?.label)
  )
  const columnClass = getColumnClass(stats.length)

  return (
    <Section size={data.sectionSize ?? defaultSectionSize}>
      <SectionBorder top='top-[2px]' />
      <SectionDividerLines />
      <WallpaperComponent color={wallpaperColor}>
        <Container className='py-16'>
          <dl
            className={clsx(
              'grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2',
              columnClass
            )}
          >
            {data.stats?.map((item, index) => {
              if (!item?.value && !item?.label) return null

              return (
                <div
                  key={index}
                  className='flex flex-col-reverse gap-3 text-center'
                  data-tina-field={tinaField(data, 'stats', index)}
                >
                  <dt
                    className={clsx(
                      'text-base font-[450]',
                      isLightBackground ? 'text-olive-800' : 'text-white/85'
                    )}
                    data-tina-field={tinaField(item, 'label')}
                  >
                    {item.label}
                  </dt>
                  <dd
                    className={clsx(
                      'font-display text-5xl tracking-tight md:text-6xl',
                      isLightBackground ? 'text-primary-600' : 'text-white'
                    )}
                    data-tina-field={tinaField(item, 'value')}
                  >
                    {item.value}
                  </dd>
                </div>
              )
            })}
          </dl>
        </Container>
      </WallpaperComponent>
    </Section>
  )
}

export const statsMinimalCenteredBlockDoc = {
  category: 'trust_proof',
  description:
    'Centered stats band for a small set of credibility metrics. Use it when the client has verified numbers that help establish scale, experience, or availability.',
  contentNotes: [
    'Best with 3-4 stats, though the layout supports up to six.',
    'Only use metrics that can be substantiated, such as years in business, jobs completed, ratings, or response coverage.',
  ],
} satisfies BlockDoc

export const statsMinimalCenteredBlockSchema: Template = {
  name: 'statsMinimalCentered',
  label: 'Stats Minimal Centered',
  ui: {
    previewSrc: '/block-previews/stats-minimal-centered.png',
    defaultItem: {
      backgroundVariant: defaultBackgroundVariant,
      sectionSize: defaultSectionSize,
      stats: [
        { value: '25+', label: 'Years serving the community' },
        { value: '10,000+', label: 'Jobs completed' },
        { value: '4.9', label: 'Average customer rating' },
        { value: '24/7', label: 'Emergency service available' },
      ],
    },
  },
  fields: [
    sectionSizeField(),
    {
      type: 'string',
      label: 'Background variant',
      name: 'backgroundVariant',
      options: [
        { label: 'Light wallpaper', value: 'light' },
        { label: 'Dark wallpaper', value: 'dark' },
      ],
    },
    {
      type: 'object',
      list: true,
      name: 'stats',
      label: 'Stats',
      ui: {
        itemProps: (item) => ({
          label: item?.value
            ? `${item.value}${item.label ? ` — ${item.label}` : ''}`
            : item?.label || 'Stat',
        }),
        defaultItem: {
          value: '100+',
          label: 'Stat label',
        },
      },
      fields: [
        {
          type: 'string',
          label: 'Value',
          name: 'value',
        },
        {
          type: 'string',
          label: 'Label',
          name: 'label',
        },
      ],
    },
  ],
}
