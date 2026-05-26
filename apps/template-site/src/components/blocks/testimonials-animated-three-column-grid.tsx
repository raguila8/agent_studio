'use client'

import { clsx } from 'clsx/lite'
import { useEffect, useRef, useState } from 'react'
import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import { useInView } from 'motion/react'
import Image from 'next/image'
import type { Template } from 'tinacms'
import { tinaField } from 'tinacms/dist/react'
import { Container } from '../elements/container'
import { LightWallpaper } from '../elements/wallpaper'
import { RatingStars } from '../shared/RatingStars'
import { Section, SectionBorder, SectionDividerLines } from '../shared/section'
import { PageBlocksTestimonialsAnimatedThreeColumnGrid } from '../../../tina/__generated__/types'
import { SectionIntroHeader } from './section-intro-header'
import {
  highlightedHeadingField,
  paragraphNode,
  richTextRoot,
  textNode,
} from '../tina/fields/highlighted-heading'
import { ImageWithDimensionsField } from '../tina/inputs/image-with-dimensions'
import { imageSrcOrFallback } from '@/lib/images'
import type { BlockDoc } from './block-doc'
import celesteAvatar from '@/images/block-fallbacks/avatars/celeste-vandermark.jpg'
import courtneyAvatar from '@/images/block-fallbacks/avatars/courtney-henry.jpg'
import driesAvatar from '@/images/block-fallbacks/avatars/dries-vincent.jpg'
import emilyAvatar from '@/images/block-fallbacks/avatars/emily-selman.jpg'
import leonardAvatar from '@/images/block-fallbacks/avatars/leonard-krasner.jpg'
import marcusAvatar from '@/images/block-fallbacks/avatars/marcus-eldridge.jpg'
import michaelAvatar from '@/images/block-fallbacks/avatars/michael-foster.jpg'
import nolanAvatar from '@/images/block-fallbacks/avatars/nolan-sheffield.jpg'
import whitneyAvatar from '@/images/block-fallbacks/avatars/whitney-francis.jpg'

const avatarFallbacks = [
  celesteAvatar,
  courtneyAvatar,
  driesAvatar,
  emilyAvatar,
  leonardAvatar,
  marcusAvatar,
  michaelAvatar,
  nolanAvatar,
  whitneyAvatar,
]

// Tina passes `form` to custom fields at runtime, but the schema component type
// used here does not expose that documented prop.
const imageWithDimensionsField = ImageWithDimensionsField as never

type TestimonialItem =
  PageBlocksTestimonialsAnimatedThreeColumnGrid['testimonials'] extends
    | Array<infer Item>
    | null
    | undefined
    ? Item
    : never

type ImageWithDimensions = {
  src?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

type AnimatedTestimonial = {
  quote: ReactNode
  img?: ReactNode
  name: ReactNode
  byline: ReactNode
  rating?: number
}

function getImageDimension(value: number | null | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

function TestimonialCard({
  quote,
  img,
  name,
  byline,
  rating = 5,
  className,
  animationDelay = '0s',
}: AnimatedTestimonial & { className?: string; animationDelay?: string }) {
  return (
    <LightWallpaper
      color='custom'
      className={clsx(
        'animate-fade-in rounded-lg p-0 opacity-0 *:last:h-full',
        className
      )}
      style={{ animationDelay }}
    >
      <figure className='flex h-full flex-col justify-between gap-10 rounded-md bg-primary-100/25 p-6 text-sm/7 text-olive-950'>
        <div className='flex flex-col gap-3'>
          <RatingStars
            rating={rating}
            starClassName='size-3.5 text-primary-500'
          />
          <blockquote
            className={`relative flex flex-col gap-4 *:first:before:absolute *:first:before:inline *:first:before:-translate-x-full *:first:before:content-['\u201C'] *:last:after:inline *:last:after:content-['\u201D']`}
          >
            {quote}
          </blockquote>
        </div>
        <figcaption
          className={clsx(
            img
              ? 'flex items-center gap-4'
              : 'flex flex-col items-start text-left'
          )}
        >
          {img && (
            <div className='flex size-12 overflow-hidden rounded-full outline -outline-offset-1 outline-black/5 *:size-full *:object-cover'>
              {img}
            </div>
          )}
          <div>
            <p className='font-semibold'>{name}</p>
            <p className='text-olive-700'>{byline}</p>
          </div>
        </figcaption>
      </figure>
    </LightWallpaper>
  )
}

function splitArray<T>(array: Array<T>, numParts: number) {
  const result: Array<Array<T>> = []
  for (let i = 0; i < array.length; i++) {
    const index = i % numParts
    if (!result[index]) {
      result[index] = []
    }
    result[index].push(array[i])
  }
  return result
}

function ReviewColumn({
  reviews,
  className,
  reviewClassName,
  msPerPixel = 0,
}: {
  reviews: Array<AnimatedTestimonial>
  className?: string
  reviewClassName?: (reviewIndex: number) => string
  msPerPixel?: number
}) {
  const sequenceRef = useRef<HTMLDivElement>(null)
  const [marqueeDistance, setMarqueeDistance] = useState(0)
  const duration = `${marqueeDistance * msPerPixel}ms`

  useEffect(() => {
    if (!sequenceRef.current) return

    const resizeObserver = new window.ResizeObserver(() => {
      setMarqueeDistance(sequenceRef.current?.offsetHeight ?? 0)
    })

    resizeObserver.observe(sequenceRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const renderReview = (review: AnimatedTestimonial, reviewIndex: number) => (
    <TestimonialCard
      key={reviewIndex}
      animationDelay={`${(reviewIndex % 6) * 0.1}s`}
      className={reviewClassName?.(reviewIndex)}
      {...review}
    />
  )

  return (
    <div
      className={clsx(
        marqueeDistance > 0 && 'animate-marquee',
        'py-6',
        className
      )}
      style={
        {
          '--marquee-distance': `${marqueeDistance}px`,
          '--marquee-duration': duration,
        } as CSSProperties
      }
    >
      <div ref={sequenceRef} className='flex flex-col gap-3 pb-3'>
        {reviews.map((review, reviewIndex) =>
          renderReview(review, reviewIndex)
        )}
      </div>
      <div aria-hidden='true' className='flex flex-col gap-3 pb-3'>
        {reviews.map((review, reviewIndex) =>
          renderReview(review, reviewIndex)
        )}
      </div>
    </div>
  )
}

function ReviewGrid({ testimonials }: { testimonials: AnimatedTestimonial[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.4 })
  const columns = splitArray(testimonials, 3)
  const column1 = columns[0]
  const column2 = columns[1]
  const column3 = splitArray(columns[2] ?? [], 2)

  return (
    <div
      ref={containerRef}
      className='relative -mx-4 grid h-196 max-h-[150vh] grid-cols-1 items-start gap-3 overflow-hidden px-4 md:grid-cols-2 lg:grid-cols-3'
    >
      {isInView && (
        <>
          <ReviewColumn
            reviews={[
              ...(column1 ?? []),
              ...column3.flat(),
              ...(column2 ?? []),
            ]}
            reviewClassName={(reviewIndex) =>
              clsx(
                reviewIndex >=
                  (column1?.length ?? 0) + (column3[0]?.length ?? 0) &&
                  'md:hidden',
                reviewIndex >= (column1?.length ?? 0) && 'lg:hidden'
              )
            }
            msPerPixel={20}
          />
          <ReviewColumn
            reviews={[...(column2 ?? []), ...(column3[1] ?? [])]}
            className='hidden md:block'
            reviewClassName={(reviewIndex) =>
              reviewIndex >= (column2?.length ?? 0) ? 'lg:hidden' : ''
            }
            msPerPixel={30}
          />
          <ReviewColumn
            reviews={column3.flat()}
            className='hidden lg:block'
            msPerPixel={20}
          />
        </>
      )}
      <div className='pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-olive-100' />
      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-olive-100' />
    </div>
  )
}

function TestimonialAnimatedThreeColumnGrid({
  testimonials,
  className,
  ...props
}: {
  testimonials: AnimatedTestimonial[]
} & Omit<ComponentProps<'section'>, 'children'>) {
  return (
    <section className={clsx(className)} {...props}>
      <div className='relative'>
        <SectionBorder top='top-[2px]' />
        <SectionDividerLines />
        <Container>
          <ReviewGrid testimonials={testimonials} />
        </Container>
      </div>
    </section>
  )
}

function mapTestimonial(
  testimonial: TestimonialItem,
  index: number,
  data: PageBlocksTestimonialsAnimatedThreeColumnGrid
): AnimatedTestimonial | null {
  if (!testimonial) return null

  const testimonialImage = testimonial.image as ImageWithDimensions | null
  const imageWidth = getImageDimension(testimonialImage?.width, 160)
  const imageHeight = getImageDimension(testimonialImage?.height, 160)
  const imageSrc = imageSrcOrFallback(
    testimonialImage?.src,
    avatarFallbacks[index % avatarFallbacks.length]
  )

  return {
    quote: (
      <p data-tina-field={tinaField(data, 'testimonials', index)}>
        {testimonial.quote}
      </p>
    ),
    img: (
      <span data-tina-field={tinaField(testimonial, 'image')}>
        <Image
          src={imageSrc}
          alt={testimonialImage?.alt ?? ''}
          width={imageWidth}
          height={imageHeight}
          sizes='48px'
          className='bg-white/75'
        />
      </span>
    ),
    name: (
      <span data-tina-field={tinaField(testimonial, 'name')}>
        {testimonial.name}
      </span>
    ),
    byline: (
      <span data-tina-field={tinaField(testimonial, 'byline')}>
        {testimonial.byline}
      </span>
    ),
    rating: testimonial.rating ?? 5,
  }
}

export function TestimonialsAnimatedThreeColumnGridBlock({
  data,
}: {
  data: PageBlocksTestimonialsAnimatedThreeColumnGrid
}) {
  const testimonials =
    data.testimonials
      ?.map((testimonial, index) => mapTestimonial(testimonial, index, data))
      .filter((testimonial): testimonial is AnimatedTestimonial =>
        Boolean(testimonial)
      ) ?? []

  return (
    <Section id='testimonials' className='scroll-mt-(--scroll-padding-top)'>
      <SectionIntroHeader data={data} />
      <TestimonialAnimatedThreeColumnGrid testimonials={testimonials} />
    </Section>
  )
}

export const testimonialsAnimatedThreeColumnGridBlockDoc = {
  category: 'testimonials',
  description:
    'Animated multi-column testimonial grid for showing a larger body of customer reviews. Use it on landing pages or high-proof pages where several short reviews are available.',
  contentNotes: [
    'Add at least 6 testimonials so the animated grid stays balanced.',
    'The current landing page uses 9 testimonials.',
    'Ratings default to 5 when omitted, so author real ratings deliberately.',
    'Use only verified or approved testimonial content.',
  ],
} satisfies BlockDoc

export const testimonialsAnimatedThreeColumnGridBlockSchema: Template = {
  name: 'testimonialsAnimatedThreeColumnGrid',
  label: 'Testimonials Animated Three Column Grid',
  ui: {
    previewSrc: '/block-previews/testimonials-animated-three-column-grid.png',
    defaultItem: {
      label: 'Reviews',
      heading: richTextRoot(
        paragraphNode(
          textNode('Real reviews from '),
          textNode('real homeowners', { italic: true })
        )
      ),
      intro:
        "These are real reviews from the homeowners we've worked with. We're proud of the work and grateful for the kind words.",
      testimonials: [
        {
          quote:
            'Our furnace died on the coldest day of the year, and I expected the whole experience to be miserable. The crew showed up the same afternoon I called, walked me through three options with the prices in writing, and had heat back in the house before bedtime. No upsell pressure, no surprises on the invoice.',
          image: { alt: 'Celeste Vandermark' },
          name: 'Celeste Vandermark',
          byline: 'Furnace replacement',
          rating: 5,
        },
        {
          quote:
            'Got three quotes for upgrading our electrical panel and theirs was not the cheapest, but they were the only ones who took the time to actually explain what needed to happen and why. Permits pulled, inspection passed on the first visit, everything cleaned up at the end of the day.',
          image: { alt: 'Courtney Henry' },
          name: 'Courtney Henry',
          byline: 'Panel upgrade',
          rating: 5,
        },
        {
          quote:
            'Had water dripping through the kitchen ceiling after a storm. They came out the next morning, found the issue within about twenty minutes, and fixed it on the same visit. Two months later we had another big storm and not a drop. Honest people doing good work.',
          image: { alt: 'Dries Vincent' },
          name: 'Dries Vincent',
          byline: 'Roof leak repair',
          rating: 5,
        },
        {
          quote:
            'Hot water went out on a Friday night. I called expecting to wait until Monday, and they had someone here Saturday morning. The technician explained what was wrong with the old unit, walked through my options, and gave me a flat price before he started. Installed and tested in a few hours.',
          image: { alt: 'Emily Selman' },
          name: 'Emily Selman',
          byline: 'Water heater replacement',
          rating: 5,
        },
        {
          quote:
            'Replaced our entire AC system last summer. The estimator was on time, the install crew was clean and respectful, and the work was permitted and inspected exactly like they said it would be. System has been running quietly and efficiently ever since.',
          image: { alt: 'Leonard Krasner' },
          name: 'Leonard Krasner',
          byline: 'AC system install',
          rating: 5,
        },
        {
          quote:
            'Main sewer line backed up the day before we were hosting Thanksgiving. They had a tech here within two hours, cleared the line, and ran a camera through to confirm it was actually fixed and not just temporarily flowing. Saved the holiday.',
          image: { alt: 'Marcus Eldridge' },
          name: 'Marcus Eldridge',
          byline: 'Emergency drain cleaning',
          rating: 5,
        },
        {
          quote:
            'We bought an older house with knob-and-tube wiring that needed to go. Big job, and they were the only contractor who scoped it honestly instead of pretending it could be done in a weekend. Stayed on schedule, on budget, and the inspector had nothing to flag.',
          image: { alt: 'Michael Foster' },
          name: 'Michael Foster',
          byline: 'Whole-home rewire',
          rating: 5,
        },
        {
          quote:
            'Replaced the entire roof on our two-story home in about three days. They put tarps over all the landscaping, swept the property twice, and ran a magnet over the driveway to catch loose nails. Warranty paperwork was in my inbox before the crew left.',
          image: { alt: 'Nolan Sheffield' },
          name: 'Nolan Sheffield',
          byline: 'Full roof replacement',
          rating: 5,
        },
        {
          quote:
            "We've used them for HVAC tune-ups, a kitchen faucet replacement, and one emergency call when our breaker box was making sounds it should not have. Every time, the techs are on time, the pricing is what they quoted, and the work holds up.",
          image: { alt: 'Whitney Francis' },
          name: 'Whitney Francis',
          byline: 'Annual maintenance plan',
          rating: 5,
        },
      ],
    },
  },
  fields: [
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
      name: 'testimonials',
      label: 'Testimonials',
      description:
        'Add at least 6 testimonials so the animated three-column grid stays balanced.',
      ui: {
        itemProps: (item) => ({
          label: item?.name || 'Testimonial',
        }),
        defaultItem: {
          quote: 'Testimonial quote',
          name: 'Customer name',
          byline: 'Service received',
          rating: 5,
        },
      },
      fields: [
        {
          type: 'string',
          label: 'Quote',
          name: 'quote',
          required: true,
          ui: {
            component: 'textarea',
          },
        },
        {
          type: 'object',
          label: 'Image',
          name: 'image',
          fields: [
            {
              name: 'src',
              label: 'Image Source',
              type: 'image',
              ui: {
                component: imageWithDimensionsField,
              },
            },
            {
              name: 'alt',
              label: 'Alt Text',
              type: 'string',
            },
            {
              name: 'width',
              label: 'Image Width',
              type: 'number',
              ui: {
                component: 'hidden',
              },
            },
            {
              name: 'height',
              label: 'Image Height',
              type: 'number',
              ui: {
                component: 'hidden',
              },
            },
          ],
        },
        {
          type: 'string',
          label: 'Name',
          name: 'name',
          required: true,
        },
        {
          type: 'string',
          label: 'Byline',
          name: 'byline',
          required: true,
        },
        {
          type: 'number',
          label: 'Rating',
          name: 'rating',
          required: true,
        },
      ],
    },
  ],
}
