'use client'

import { clsx } from 'clsx/lite'
import { AnimatePresence, motion } from 'motion/react'
import type { JSX } from 'react'
import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { GroupFieldPlugin, type Template } from 'tinacms'
import { tinaField } from 'tinacms/dist/react'
import { StaticTinaMarkdown } from 'tinacms/dist/rich-text/static'
import { Eyebrow } from '../elements/eyebrow'
import { IconCircleCaretRightOutlineDuo18 } from 'nucleo-ui-outline-duo-18'
import { SectionHeader } from '../elements/section-header'
import { Subheading } from '../elements/subheading'
import { Text } from '../elements/text'
import {
  HighlightedHeadingMarkdown,
  highlightedHeadingField,
  paragraphNode,
  richTextRoot,
  textNode,
  type RichTextValue,
} from '../tina/fields/highlighted-heading'
import { TinaMarkdownLink } from '../tina/elements/tina-markdown-link'
import { Section, SectionBorder, SectionDividerLines } from '../shared/section'
import { Wallpaper } from '../elements/wallpaper'
import { SectionIntroHeader } from './section-intro-header'
import type { BlockDoc } from './block-doc'

type TinaContentSource = {
  _content_source?: {
    queryId: string
    path: Array<number | string>
  }
}

type MarkdownChildrenProps = { children: JSX.Element }
type MarkdownLinkProps = { url: string; children: JSX.Element }

type FaqVideoData = {
  src?: string | null
  poster?: string | null
}

type FaqItemData = TinaContentSource & {
  question?: string | null
  answer?: RichTextValue
  showVideo?: boolean | null
  video?: FaqVideoData | null
}

type FaqsTwoColumnAccordionBlockData = TinaContentSource & {
  stackHeader?: boolean | null
  showTopBorder?: boolean | null
  label?: string | null
  heading?: RichTextValue
  intro?: string | null
  faqs?: Array<FaqItemData | null> | null
}

type FaqVideoFrameHandle = {
  play: () => void
}

type FaqVideoFrameProps = {
  src?: string | null
  poster?: string | null
  className?: string
}

const FaqVideoFrame = forwardRef<FaqVideoFrameHandle, FaqVideoFrameProps>(
  function FaqVideoFrame({ src, poster, className }, ref) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [hasPlayed, setHasPlayed] = useState(false)

    const handlePlay = () => {
      const video = videoRef.current
      if (!video) return

      void video
        .play()
        .then(() => setHasPlayed(true))
        .catch(() => undefined)
    }

    useImperativeHandle(ref, () => ({ play: handlePlay }))

    if (!src) return null

    return (
      <div
        className={`relative mx-auto w-full max-w-md text-olive-950/14 ${className ?? ''}`}
      >
        <div className='relative w-full overflow-hidden p-6'>
          <video
            aria-hidden='true'
            autoPlay
            loop
            muted
            playsInline
            poster='/media/videos/liquid-02-bg-poster.jpg'
            preload='auto'
            className='absolute inset-0 h-full w-full object-cover opacity-30'
          >
            <source src='/media/videos/liquid-02-bg.webm' type='video/webm' />
            <source src='/media/videos/liquid-02-bg.mp4' type='video/mp4' />
          </video>
          <Wallpaper
            color='primary'
            aria-hidden='true'
            className='pointer-events-none absolute! inset-0 opacity-60'
          />
          <div className='relative w-full overflow-hidden rounded-xl bg-white p-[1.5px] shadow-[0_0_0_1px_color-mix(in_oklch,var(--color-primary-700)_22%,transparent),inset_0_0_0_4px_rgba(255,255,255,1),0_2px_4px_0_rgba(0,0,0,0.04)]'>
            <div className='group relative overflow-hidden rounded-[11px]'>
              <video
                ref={videoRef}
                className='aspect-9/16 h-auto w-full object-cover'
                controls={hasPlayed}
                controlsList='nofullscreen'
                disablePictureInPicture
                preload='metadata'
                poster={poster ?? undefined}
                onPlay={() => setHasPlayed(true)}
              >
                <source src={src} type='video/mp4' />
              </video>
              {!hasPlayed ? (
                <button
                  type='button'
                  onClick={handlePlay}
                  aria-label='Watch the answer'
                  className='absolute inset-0 flex cursor-pointer items-center justify-center'
                >
                  <span
                    aria-hidden='true'
                    className='absolute inset-0 bg-black/20'
                  />
                  <span
                    aria-hidden='true'
                    className='absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-primary-300/50 [animation-duration:5s]'
                  />
                  <span className='relative flex size-16 items-center justify-center rounded-full bg-primary-300/40 backdrop-blur-sm transition duration-100 ease-linear group-hover:bg-primary-300/60'>
                    <svg
                      width='16'
                      height='16'
                      viewBox='0 0 16 16'
                      fill='none'
                      aria-hidden='true'
                      className='size-5 text-white'
                    >
                      <path
                        d='M2.19995 2.86327C2.19995 1.61155 3.57248 0.844595 4.63851 1.50061L12.9856 6.63731C14.0009 7.26209 14.0009 8.73784 12.9856 9.36262L4.63851 14.4993C3.57247 15.1553 2.19995 14.3884 2.19995 13.1367V2.86327Z'
                        fill='currentColor'
                      />
                    </svg>
                  </span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
        <div
          aria-hidden='true'
          className='pointer-events-none absolute top-0 -right-3 -left-3 h-px bg-current'
        />
        <div
          aria-hidden='true'
          className='pointer-events-none absolute -right-3 bottom-0 -left-3 h-px bg-current'
        />
        <div
          aria-hidden='true'
          className='pointer-events-none absolute -top-3 -bottom-3 left-0 w-px bg-current'
        />
        <div
          aria-hidden='true'
          className='pointer-events-none absolute -top-3 right-0 -bottom-3 w-px bg-current'
        />
      </div>
    )
  }
)

function FaqItem({
  item,
  index,
  data,
  isOpen,
  showBottomBorder,
  onToggle,
  onPlayVideo,
}: {
  item: FaqItemData
  index: number
  data: FaqsTwoColumnAccordionBlockData
  isOpen: boolean
  showBottomBorder: boolean
  onToggle: () => void
  onPlayVideo: () => void
}) {
  const autoId = useId()
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const [isMobileVideoOpen, setIsMobileVideoOpen] = useState(false)
  const hasVideo = Boolean(item.showVideo && item.video?.src)

  useEffect(() => {
    if (!isMobileVideoOpen) return

    const video = mobileVideoRef.current

    document.body.style.overflow = 'hidden'
    void video?.play().catch(() => undefined)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMobileVideo()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      video?.pause()
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileVideoOpen])

  const closeMobileVideo = () => {
    const video = mobileVideoRef.current

    if (video) {
      video.pause()
      video.currentTime = 0
    }

    setIsMobileVideoOpen(false)
  }

  const handleAnswerVideoPlay = () => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 1024px)').matches
    ) {
      onPlayVideo()
      return
    }

    setIsMobileVideoOpen(true)
  }

  const mobileVideoModal =
    typeof document !== 'undefined'
      ? createPortal(
          <AnimatePresence>
            {hasVideo && isMobileVideoOpen ? (
              <motion.div
                className='fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/65 px-4 py-6 backdrop-blur-sm sm:px-6'
                role='dialog'
                aria-modal='true'
                aria-label='Watch the answer'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                onClick={closeMobileVideo}
              >
                <motion.div
                  className='relative w-fit max-w-[calc(100vw-2rem)] rounded-xl shadow-2xl ring-1 ring-white/20'
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.97 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <video
                    ref={mobileVideoRef}
                    className='block h-auto max-h-[min(78vh,42rem)] max-w-[calc(100vw-2rem)] rounded-xl object-contain'
                    controls
                    controlsList='nofullscreen'
                    disablePictureInPicture
                    autoPlay
                    playsInline
                    poster={item.video?.poster ?? undefined}
                    preload='metadata'
                    onEnded={closeMobileVideo}
                  >
                    <source
                      src={item.video?.src ?? undefined}
                      type='video/mp4'
                    />
                  </video>
                  <button
                    type='button'
                    onClick={closeMobileVideo}
                    aria-label='Close video'
                    className='absolute top-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-black/55 text-2xl/none text-white backdrop-blur-sm transition hover:bg-black/70'
                  >
                    &times;
                  </button>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body
        )
      : null

  return (
    <div
      id={autoId}
      data-tina-field={tinaField(data, 'faqs', index)}
      className={clsx(
        'group relative transition-all duration-200 ease-in-out',
        isOpen ? 'bg-white/40' : 'hover:bg-olive-200/40',
        showBottomBorder &&
          "before:pointer-events-none before:absolute before:right-0 before:bottom-0 before:left-0 before:h-px before:bg-olive-950/7 before:content-[''] after:pointer-events-none after:absolute after:right-0 after:-bottom-px after:left-0 after:h-px after:bg-white after:content-['']"
      )}
    >
      <button
        type='button'
        id={`${autoId}-question`}
        aria-controls={`${autoId}-answer`}
        aria-expanded={isOpen}
        onClick={onToggle}
        className={clsx(
          'relative flex w-full cursor-pointer items-start justify-between gap-6 border-t border-white pt-8 pb-8 text-left text-base/7 font-medium text-olive-800',
          index === 0 && 'lg:border-t-0!'
        )}
      >
        <div className='mx-auto flex w-full max-w-2xl cursor-pointer items-start justify-between gap-6 px-6 text-left md:max-w-3xl lg:mx-0 lg:max-w-none lg:px-8 xl:px-12'>
          <span data-tina-field={tinaField(item, 'question')}>
            {item.question}
          </span>
          <motion.svg
            width={13}
            height={13}
            viewBox='0 0 13 13'
            fill='none'
            stroke='currentColor'
            strokeWidth={1}
            className='h-lh shrink-0 text-olive-800'
            aria-hidden='true'
          >
            <path d='M12.5 6.5H0.5' strokeLinecap='round' />
            <motion.path
              d='M6.5 0.5V12.5'
              strokeLinecap='round'
              animate={{ rotate: isOpen ? 90 : 0 }}
              style={{ transformOrigin: '6.5px 6.5px' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
          </motion.svg>
        </div>
      </button>
      <motion.div
        id={`${autoId}-answer`}
        role='region'
        aria-labelledby={`${autoId}-question`}
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
          marginTop: isOpen ? '-1rem' : 0,
        }}
        className='overflow-hidden'
      >
        <div
          className='mx-auto flex w-full max-w-2xl flex-col gap-2 px-6 pb-8 text-[15px]/7 text-olive-700 md:max-w-3xl lg:mx-0 lg:max-w-none lg:pr-12 lg:pl-8 xl:pl-12'
          data-tina-field={tinaField(item, 'answer')}
        >
          {item.answer ? (
            <StaticTinaMarkdown
              content={item.answer}
              components={{
                p: (props?: MarkdownChildrenProps) => <p>{props?.children}</p>,
                ul: (props?: MarkdownChildrenProps) => (
                  <ul className='list-disc space-y-2 pl-5'>
                    {props?.children}
                  </ul>
                ),
                ol: (props?: MarkdownChildrenProps) => (
                  <ol className='list-decimal space-y-2 pl-5'>
                    {props?.children}
                  </ol>
                ),
                a: (props?: MarkdownLinkProps) => (
                  <TinaMarkdownLink
                    url={props?.url}
                    className='text-primary-600 underline underline-offset-3'
                  >
                    {props?.children}
                  </TinaMarkdownLink>
                ),
              }}
            />
          ) : null}
          {hasVideo ? (
            <button
              type='button'
              onClick={handleAnswerVideoPlay}
              className='mt-3 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-primary-300/20 px-4 py-1.5 text-sm/5 font-medium text-primary-600 transition duration-100 ease-linear hover:bg-primary-300/35'
            >
              <IconCircleCaretRightOutlineDuo18
                title=''
                aria-hidden='true'
                className='size-4.5 shrink-0 duotone-primary'
              />
              Watch the answer
            </button>
          ) : null}
          {mobileVideoModal}
        </div>
      </motion.div>
    </div>
  )
}

const GroupFieldComponent = GroupFieldPlugin.Component

type TinaGroupFieldProps = Parameters<typeof GroupFieldComponent>[0]
type ConditionalFaqVideoFieldProps = {
  input: { name: string }
  form?: {
    getFieldState: (fieldName: string) => { value?: unknown } | undefined
  }
}

function getSiblingFieldName(fieldName: string, siblingName: string) {
  const path = fieldName.split('.')
  path[path.length - 1] = siblingName
  return path.join('.')
}

function ConditionalFaqVideoField(props: ConditionalFaqVideoFieldProps) {
  if (!props.form) return null

  const showVideoFieldName = getSiblingFieldName(props.input.name, 'showVideo')
  const showVideo = props.form.getFieldState(showVideoFieldName)?.value

  return showVideo ? (
    <GroupFieldComponent {...(props as TinaGroupFieldProps)} />
  ) : null
}

export function FaqsTwoColumnAccordionBlock({
  data,
}: {
  data: FaqsTwoColumnAccordionBlockData
}) {
  const hasIntro = Boolean(data.intro)
  const stackHeader = data.stackHeader ?? false
  const showTopBorder = data.showTopBorder ?? true
  const hasFaqVideo = Boolean(
    data.faqs?.some((item) => item?.showVideo && item.video?.src)
  )
  const desktopVideoRef = useRef<FaqVideoFrameHandle>(null)
  const [openItem, setOpenItem] = useState<number | null>(0)

  const toggleItem = (index: number) => {
    setOpenItem((current) => (current === index ? null : index))
  }

  const openFaq = openItem !== null ? data.faqs?.[openItem] : null
  const openFaqVideo =
    openFaq && openFaq.showVideo && openFaq.video?.src ? openFaq.video : null
  const showFaqItemsBottomBorder = hasFaqVideo && openItem !== null
  const visibleFaqItems =
    data.faqs
      ?.map((item, index) => ({ item, index }))
      .filter((entry): entry is { item: FaqItemData; index: number } =>
        Boolean(entry.item?.question && entry.item.answer)
      ) ?? []

  const header = (
    <SectionHeader
      layout='stacked'
      eyebrow={
        data.label ? (
          <Eyebrow data-tina-field={tinaField(data, 'label')}>
            {data.label}
          </Eyebrow>
        ) : null
      }
      headline={
        data.heading ? (
          <Subheading data-tina-field={tinaField(data, 'heading')}>
            <HighlightedHeadingMarkdown content={data.heading} />
          </Subheading>
        ) : null
      }
      subheadline={
        hasIntro ? (
          <Text
            className='flex text-pretty'
            data-tina-field={tinaField(data, 'intro')}
          >
            <p>{data.intro}</p>
          </Text>
        ) : null
      }
    />
  )

  const faqItems = (
    <div
      className={clsx(
        'relative divide-y divide-olive-950/7 pr-px',
        'border-t border-olive-950/7 lg:border-t-0',
        (!stackHeader || hasFaqVideo) && 'lg:border-l lg:border-olive-950/7'
      )}
    >
      {visibleFaqItems.map(({ item, index }, visibleIndex) => {
        return (
          <FaqItem
            key={index}
            item={item}
            index={index}
            data={data}
            isOpen={openItem === index}
            showBottomBorder={
              showFaqItemsBottomBorder &&
              visibleIndex === visibleFaqItems.length - 1
            }
            onToggle={() => toggleItem(index)}
            onPlayVideo={() => desktopVideoRef.current?.play()}
          />
        )
      })}
    </div>
  )

  if (stackHeader) {
    return (
      <Section className=''>
        <SectionIntroHeader data={data} showTopBorder={showTopBorder} />
        <div className='relative'>
          <SectionBorder top='top-[2px]' />
          <div className='hidden lg:block'>
            <SectionDividerLines />
          </div>
          <div
            className={clsx(
              'lg:grid',
              hasFaqVideo ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
            )}
          >
            {hasFaqVideo ? (
              <div className='mx-auto hidden w-full max-w-2xl flex-col px-6 py-12 md:max-w-3xl lg:mr-0 lg:ml-auto lg:flex lg:max-w-160 lg:py-16 lg:pr-12 lg:pl-8 xl:pr-16 2xl:pr-24'>
                <div className='lg:sticky lg:top-24'>
                  {openFaqVideo ? (
                    <motion.div
                      key={openFaqVideo.src ?? undefined}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className='hidden lg:block'
                    >
                      <FaqVideoFrame
                        ref={desktopVideoRef}
                        src={openFaqVideo.src}
                        poster={openFaqVideo.poster}
                      />
                    </motion.div>
                  ) : null}
                </div>
              </div>
            ) : null}
            {faqItems}
          </div>
        </div>
      </Section>
    )
  }

  return (
    <Section className=''>
      {showTopBorder ? <SectionDividerLines /> : null}
      <SectionBorder />
      <div className='lg:grid lg:grid-cols-2'>
        <div className='mx-auto flex w-full max-w-2xl flex-col px-6 py-12 md:max-w-3xl lg:mr-0 lg:ml-auto lg:max-w-160 lg:py-16 lg:pr-12 lg:pl-8 xl:pr-16 2xl:pr-24'>
          <div className='lg:sticky lg:top-24'>
            {header}
            {openFaqVideo ? (
              <motion.div
                key={openFaqVideo.src ?? undefined}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className='mt-16 hidden lg:block'
              >
                <FaqVideoFrame
                  ref={desktopVideoRef}
                  src={openFaqVideo.src}
                  poster={openFaqVideo.poster}
                />
              </motion.div>
            ) : null}
          </div>
        </div>
        {faqItems}
      </div>
    </Section>
  )
}

export const faqsTwoColumnAccordionBlockDoc = {
  category: 'faq',
  description:
    'Accordion FAQ section with header copy and expandable answers, optionally with answer videos. Use it for common buying, scheduling, pricing, warranty, or service-scope questions.',
  contentNotes: [
    'FAQ items require both a question and answer to render.',
    'Answers support paragraphs, lists, and links.',
    'Optional videos require an MP4 source and should be used sparingly.',
    'Avoid legal, warranty, financing, or emergency-response claims unless confirmed for the client.',
  ],
} satisfies BlockDoc

export const faqsTwoColumnAccordionBlockSchema: Template = {
  name: 'faqsTwoColumnAccordion',
  label: 'FAQs Two Column Accordion',
  ui: {
    previewSrc: '/block-previews/faqs-two-column-accordion.png',
    defaultItem: {
      stackHeader: false,
      showTopBorder: true,
      label: 'FAQs',
      heading: richTextRoot(
        paragraphNode(
          textNode('Answers before you '),
          textNode('pick up the phone', { italic: true })
        )
      ),
      intro:
        'The questions homeowners ask us most often, from scheduling and pricing to licensing, warranties, and what to expect on the day of service.',
      faqs: [
        {
          question: 'Are you licensed, bonded, and insured?',
          answer: richTextRoot(
            paragraphNode(
              textNode(
                'Yes. Our team is fully licensed in every state we serve, bonded for your protection, and carries comprehensive liability and workers compensation insurance. We are happy to share documentation on request.'
              )
            )
          ),
        },
        {
          question: 'Do you offer free estimates?',
          answer: richTextRoot(
            paragraphNode(
              textNode(
                'We provide free, no-obligation estimates for most projects. After a quick visit to assess the work, you will get a clear, written quote with transparent pricing, so there are no surprises once the job begins.'
              )
            )
          ),
        },
        {
          question: 'How quickly can you respond to emergencies?',
          answer: richTextRoot(
            paragraphNode(
              textNode(
                'We offer same-day and 24/7 emergency service throughout our service area. In most cases, a technician can be at your door within a few hours of your call.'
              )
            )
          ),
        },
        {
          question: 'What areas do you service?',
          answer: richTextRoot(
            paragraphNode(
              textNode(
                'We serve homeowners and businesses across the surrounding metro area. If you are not sure whether your address is covered, give us a call and we will let you know right away.'
              )
            )
          ),
        },
        {
          question: 'Do you stand behind your work with a warranty?',
          answer: richTextRoot(
            paragraphNode(
              textNode(
                'Absolutely. All of our workmanship is backed by a written warranty, and we honor every manufacturer warranty on the parts and equipment we install. If something is not right, we make it right.'
              )
            )
          ),
        },
        {
          question: 'What payment options and financing do you accept?',
          answer: richTextRoot(
            paragraphNode(
              textNode(
                'We accept all major credit cards, checks, and electronic payments. For larger projects, we also offer flexible financing plans with approved credit so you can move forward without putting it off.'
              )
            )
          ),
        },
      ],
    },
  },
  fields: [
    {
      type: 'boolean',
      label: 'Stack Header',
      name: 'stackHeader',
      description:
        'Show the eyebrow, heading, and intro above the FAQs instead of in the left column.',
    },
    {
      type: 'boolean',
      label: 'Show Top Border',
      name: 'showTopBorder',
    },
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
      description: 'Short supporting copy shown below the heading.',
      ui: {
        component: 'textarea',
      },
    },
    {
      type: 'object',
      list: true,
      name: 'faqs',
      label: 'FAQs',
      ui: {
        itemProps: (item) => ({
          label: item?.question || 'FAQ',
        }),
        defaultItem: {
          question: 'FAQ question',
          answer: richTextRoot(paragraphNode(textNode('FAQ answer'))),
          showVideo: false,
        },
      },
      fields: [
        {
          type: 'string',
          label: 'Question',
          name: 'question',
          required: true,
        },
        {
          type: 'rich-text',
          label: 'Answer',
          name: 'answer',
          description:
            'Supports paragraphs, lists, and links inside the accordion panel.',
          required: true,
        },
        {
          type: 'boolean',
          label: 'Show Video',
          name: 'showVideo',
        },
        {
          type: 'object',
          label: 'Video',
          name: 'video',
          ui: {
            component: ConditionalFaqVideoField,
          },
          fields: [
            {
              type: 'image',
              label: 'Video',
              name: 'src',
              description: 'Select the MP4 file from the media library.',
            },
            {
              type: 'image',
              label: 'Poster Image',
              name: 'poster',
            },
          ],
        },
      ],
    },
  ],
}
