import { AnnouncementBadge } from '@/components/elements/announcement-badge'

export type TinaAnnouncementBadgeData = {
  text?: string | null
  href?: string | null
  cta?: string | null
  variant?: string | null
  rating?: number | null
  stars?: number | null
}

export function TinaAnnouncementBadge({
  data,
  tinaFieldName,
  starClassName = 'size-3.5 text-[#e67e25]',
  textElement,
}: {
  data?: TinaAnnouncementBadgeData | null
  tinaFieldName?: string
  starClassName?: string
  textElement?: 'span' | 'h2'
}) {
  if (!data?.text) return null

  return (
    <div data-tina-field={tinaFieldName}>
      <AnnouncementBadge
        href={data.href ?? '#'}
        text={data.text}
        cta={data.cta ?? 'Learn more'}
        variant={data.variant === 'normal' ? 'normal' : 'overlay'}
        rating={typeof data.rating === 'number' ? data.rating : undefined}
        stars={typeof data.stars === 'number' ? data.stars : undefined}
        starClassName={starClassName}
        textElement={textElement}
      />
    </div>
  )
}
