import type { ComponentProps } from 'react'
import { clsx } from 'clsx/lite'
import { Text } from '@/components/elements/text'
import { siteConfig } from '@/lib/site-config'
import {
  IconPinAOutlineDuo18,
  IconPinBOutlineDuo18,
} from 'nucleo-ui-outline-duo-18'

const locationPinIcons = [IconPinAOutlineDuo18, IconPinBOutlineDuo18]

export function OfficeLocations({
  className,
  showTitle = true,
  showDescription = true,
  showPinIcons = false,
  title = 'Our locations',
  description = 'Stop in for a consultation or appointment.',
  titleField,
  descriptionField,
  ...props
}: Omit<ComponentProps<'div'>, 'title'> & {
  showTitle?: boolean
  showDescription?: boolean
  showPinIcons?: boolean
  title?: string | null
  description?: string | null
  titleField?: string
  descriptionField?: string
}) {
  if (!siteConfig.locations.length) return null

  const hasTitle = showTitle && Boolean(title)
  const hasDescription = showDescription && Boolean(description)
  const hasIntro = hasTitle || hasDescription

  return (
    <div className={clsx(className)} {...props}>
      {hasTitle && (
        <h2
          className='text-base font-medium text-olive-950'
          data-tina-field={titleField}
        >
          {title}
        </h2>
      )}
      {hasDescription && (
        <Text
          size='md'
          className='mt-4.5 text-olive-700'
          data-tina-field={descriptionField}
        >
          {description}
        </Text>
      )}
      <ul
        role='list'
        className={clsx(
          'grid grid-cols-1 gap-8 sm:grid-cols-2',
          hasIntro && 'mt-8'
        )}
      >
        {siteConfig.locations.map((office, index) => {
          const PinIcon = locationPinIcons[index]

          return (
            <li key={office.displayName}>
              <address className='text-sm/6 text-olive-700 not-italic'>
                <div className='flex items-start gap-3.25 text-olive-950'>
                  {showPinIcons && PinIcon && (
                    <div className='flex size-3.25 h-lh items-center'>
                      <span className='duotone-primary [&_svg]:size-4.5'>
                        <PinIcon title='' aria-hidden='true' />
                      </span>
                    </div>
                  )}
                  <strong className='font-[550] text-olive-950'>
                    {office.displayName}
                  </strong>
                </div>
                {office.streetAddress ? (
                  <div className={clsx(showPinIcons && 'mt-1.5')}>
                    {office.streetAddress}
                  </div>
                ) : null}
              </address>
              <ul className='mt-4 space-y-1 text-sm/6 text-olive-700'>
                {office.hours.map((hour) => (
                  <li key={hour}>{hour}</li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
