import type { TinaField } from 'tinacms'

type AnnouncementBadgeFieldOptions = {
  name?: string
  label?: string
  includeVariant?: boolean
  defaultItem?: {
    text?: string
    href?: string
    cta?: string
    variant?: 'normal' | 'overlay'
    rating?: number
    stars?: number
  }
}

export function announcementBadgeField({
  name = 'eyebrow',
  label = 'Eyebrow',
  includeVariant = true,
  defaultItem,
}: AnnouncementBadgeFieldOptions = {}): TinaField {
  const fields: TinaField[] = [
    {
      type: 'string',
      label: 'Text',
      name: 'text',
    },
    {
      type: 'string',
      label: 'Link',
      name: 'href',
    },
    {
      type: 'string',
      label: 'CTA',
      name: 'cta',
    },
    {
      type: 'number',
      label: 'Rating',
      name: 'rating',
    },
    {
      type: 'number',
      label: 'Stars',
      name: 'stars',
    },
  ]

  if (includeVariant) {
    fields.push({
      type: 'string',
      label: 'Variant',
      name: 'variant',
      options: [
        { label: 'Overlay', value: 'overlay' },
        { label: 'Normal', value: 'normal' },
      ],
    })
  }

  return {
    type: 'object',
    label,
    name,
    ui: {
      defaultItem: {
        text: 'Rated five stars by 100+ clients',
        href: '#',
        cta: 'Read reviews',
        rating: 5,
        stars: 5,
        ...(includeVariant ? { variant: 'overlay' } : {}),
        ...defaultItem,
      },
    },
    fields,
  }
}
