'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { tinaField, useTina } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import type { Blog_PostQuery } from '../../../tina/__generated__/types'
import { cn } from '@/lib/utils'
import {
  BlogPostCardGrid,
  type BlogPostCardItem,
} from '../shared/blog-post-card-grid'
import {
  CallToActionSimpleBlock,
  callToActionSimpleDefaultItem,
  hasCallToActionSimpleContent,
} from '../blocks/call-to-action-simple'
import { SectionDividerBlock } from '../blocks/section-divider'
import {
  paragraphNode,
  richTextRoot,
  textNode,
} from '../tina/fields/highlighted-heading'
import {
  SectionIntroHeader,
  type SectionIntroHeaderData,
} from '../blocks/section-intro-header'
import { Avatar } from '../elements/avatar'
import { Breadcrumb } from '../elements/breadcrumb'
import { PlainButtonLink } from '../elements/button'
import { Container } from '../elements/container'
import { Heading } from '../elements/heading'
import { ChevronIcon } from '../icons/chevron-icon'
import { Section, SectionBorder, SectionDividerLines } from '../shared/section'
import { Text } from '../elements/text'
import { TinaMarkdownLink } from './elements/tina-markdown-link'

type PostClientPageProps = {
  data: Blog_PostQuery
  variables: {
    relativePath: string
  }
  query: string
  relatedPosts?: BlogPostCardItem[]
}

type TableOfContentsItem = {
  id: string
  text: string
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
})
const headingScrollOffset = 140
const relatedPostsHeader: SectionIntroHeaderData = {
  label: 'Related articles',
  heading: richTextRoot(
    paragraphNode(
      textNode('Articles you '),
      textNode('might also like', { italic: true })
    )
  ) as SectionIntroHeaderData['heading'],
  intro:
    'Hand-picked from our archive on acupuncture, Chinese medicine, and whole-person care.',
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function PostClientPage(props: PostClientPageProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  })
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>(
    []
  )
  const [activeHeadingId, setActiveHeadingId] = useState('')

  const post = data.blog_post
  const postBody = post?._body
  const postCta = hasCallToActionSimpleContent(post?.cta)
    ? post?.cta
    : callToActionSimpleDefaultItem
  const relatedPosts = props.relatedPosts ?? []

  useEffect(() => {
    if (!postBody) {
      setTableOfContents([])
      setActiveHeadingId('')
      return
    }

    const contentElement = contentRef.current
    if (!contentElement) return

    const headings = Array.from(
      contentElement.querySelectorAll('h2')
    ) as HTMLHeadingElement[]

    const slugCounts = new Map<string, number>()
    const nextTableOfContents = headings
      .map((heading) => {
        const text = heading.textContent?.trim()
        if (!text) return null

        const baseSlug = slugifyHeading(text) || 'section'
        const slugCount = slugCounts.get(baseSlug) ?? 0
        slugCounts.set(baseSlug, slugCount + 1)

        const id = slugCount === 0 ? baseSlug : `${baseSlug}-${slugCount + 1}`
        heading.id = id

        return {
          id,
          text,
        } satisfies TableOfContentsItem
      })
      .filter((item): item is TableOfContentsItem => item !== null)

    setTableOfContents(nextTableOfContents)

    if (nextTableOfContents.length === 0) {
      setActiveHeadingId('')
      return
    }

    const updateActiveHeading = () => {
      let currentHeadingId = nextTableOfContents[0].id

      for (const heading of headings) {
        if (heading.getBoundingClientRect().top - headingScrollOffset <= 0) {
          currentHeadingId = heading.id
          continue
        }

        break
      }

      setActiveHeadingId(currentHeadingId)
    }

    updateActiveHeading()

    window.addEventListener('scroll', updateActiveHeading, { passive: true })
    window.addEventListener('resize', updateActiveHeading)

    return () => {
      window.removeEventListener('scroll', updateActiveHeading)
      window.removeEventListener('resize', updateActiveHeading)
    }
  }, [postBody])

  if (!post) return null

  const parsedDate = post.date ? new Date(post.date) : null
  const formattedDate =
    parsedDate && !Number.isNaN(parsedDate.getTime())
      ? dateFormatter.format(parsedDate)
      : ''
  const categorySlug = post.category?._sys.breadcrumbs.join('/')
  const categoryHref = categorySlug ? `/blog?category=${categorySlug}` : '/blog'

  const handleTableOfContentsClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    event.preventDefault()

    const heading = document.getElementById(id)
    if (!heading) return

    const top =
      heading.getBoundingClientRect().top + window.scrollY - headingScrollOffset

    window.history.pushState(null, '', `#${id}`)
    window.scrollTo({ top, behavior: 'smooth' })
    setActiveHeadingId(id)
  }

  return (
    <>
      <article>
        <Section>
          <SectionBorder />
          <Container>
            <div className='flex flex-col'>
              <header className='relative flex w-full flex-col py-12 sm:py-16'>
                <Breadcrumb
                  items={[
                    { label: 'Blog', href: '/blog' },
                    { label: post.category.name, href: categoryHref },
                  ]}
                />
                <Heading
                  className='mt-4 max-w-5xl sm:text-7xl/20!'
                  data-tina-field={tinaField(post, 'title')}
                >
                  {post.title}
                </Heading>

                {post.excerpt && (
                  <Text
                    size='lg'
                    className='mt-5 flex max-w-3xl flex-col gap-4'
                    data-tina-field={tinaField(post, 'excerpt')}
                  >
                    <TinaMarkdown
                      content={post.excerpt}
                      components={{ a: TinaMarkdownLink }}
                    />
                  </Text>
                )}

                {post.author && (
                  <div
                    className='mt-4 flex items-center gap-3'
                    data-tina-field={tinaField(post, 'author')}
                  >
                    {post.author.avatar && (
                      <Avatar src={post.author.avatar} alt={post.author.name} />
                    )}
                    <p className='text-sm/6 font-medium text-olive-700/90'>
                      {post.author.name}
                      {formattedDate && (
                        <>
                          <span
                            aria-hidden='true'
                            className='mx-3 text-olive-500'
                          >
                            ·
                          </span>
                          <span data-tina-field={tinaField(post, 'date')}>
                            {formattedDate}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                )}
              </header>
            </div>
          </Container>
        </Section>
        <Section>
          <SectionBorder top='top-[2px]' />
          <Container className='relative'>
            <SectionDividerLines />
            <div className='grid grid-cols-12'>
              <div className='col-span-12 py-10 sm:pt-12 sm:pb-16 lg:col-span-8 lg:pr-16'>
                {post.heroImg?.src && (
                  <div
                    className='w-full overflow-hidden rounded-2xl bg-white p-[1.5px] shadow-[0_0_0_1px_rgba(0,0,0,0.12),inset_0_0_0_4px_rgba(255,255,255,1),0_2px_4px_0_rgba(0,0,0,0.04)]'
                    data-tina-field={tinaField(post, 'heroImg')}
                  >
                    <Image
                      src={post.heroImg.src}
                      alt={post.heroImg.alt || post.title}
                      width={1600}
                      height={900}
                      priority
                      className='h-auto w-full rounded-[15px] object-cover'
                    />
                  </div>
                )}

                <div
                  ref={contentRef}
                  className='prose prose-lg mx-auto mt-10 w-full max-w-3xl sm:mt-12 [&_h2]:scroll-mt-36 lg:[&_h2]:scroll-mt-32'
                  data-tina-field={tinaField(post, '_body')}
                >
                  <TinaMarkdown
                    content={postBody}
                    components={{ a: TinaMarkdownLink }}
                  />
                </div>
              </div>
              {tableOfContents.length > 0 && (
                <aside className='col-span-4 hidden border-l border-olive-950/7 py-10 pl-8 sm:py-12 lg:block lg:pl-12'>
                  <nav className='sticky top-28'>
                    <h3 className='font-display text-[22px] font-[550] text-olive-950'>
                      Table of Contents
                    </h3>
                    <ul className='mt-3 space-y-1.5'>
                      {tableOfContents.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            onClick={(event) =>
                              handleTableOfContentsClick(event, item.id)
                            }
                            className={cn(
                              "relative block text-sm/6 text-olive-700 transition-colors before:pointer-events-none before:absolute before:inset-y-0 before:-left-[calc(2rem+1px)] before:hidden before:w-px before:bg-primary-500 before:content-[''] lg:before:-left-[calc(3rem+1px)]",
                              activeHeadingId === item.id
                                ? 'font-medium text-primary-600 before:block'
                                : 'hover:text-olive-900'
                            )}
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </aside>
              )}
            </div>
          </Container>
        </Section>
      </article>
      {relatedPosts.length > 0 && (
        <>
          <SectionDividerBlock />
          <Section>
            <SectionIntroHeader
              data={relatedPostsHeader}
              showTopBorder={false}
              action={
                <PlainButtonLink href='/blog' color='primary'>
                  See all articles
                  <ChevronIcon />
                </PlainButtonLink>
              }
            />
            <div className='relative'>
              <SectionBorder top='top-[2px]' />
              <SectionDividerLines />
              <Container className='py-12 sm:py-16'>
                <BlogPostCardGrid posts={relatedPosts} />
              </Container>
            </div>
          </Section>
        </>
      )}
      {postCta && post.showSectionDividerBeforeCta ? (
        <div data-tina-field={tinaField(post, 'showSectionDividerBeforeCta')}>
          <SectionDividerBlock />
        </div>
      ) : null}
      {postCta && <CallToActionSimpleBlock data={postCta} />}
    </>
  )
}
