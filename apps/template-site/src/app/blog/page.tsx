import { Container } from '@/components/elements/container'
import { Heading } from '@/components/elements/heading'
import type { Metadata } from 'next'
import {
  Section,
  SectionBorder,
  SectionDividerLines,
} from '@/components/shared/section'
import { Text } from '@/components/elements/text'
import { Eyebrow } from '@/components/elements/eyebrow'
import { LightWallpaper } from '@/components/elements/wallpaper'
import { notFound } from 'next/navigation'
import { SiteFrame } from '@/components/shared/site-frame'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import { clsx } from 'clsx/lite'
import {
  CallToActionSimpleBlock,
  callToActionSimpleDefaultItem,
} from '@/components/blocks/call-to-action-simple'
import { TinaMarkdownLink } from '@/components/tina/elements/tina-markdown-link'
import { SectionDividerBlock } from '@/components/blocks/section-divider'
import { buildSeoMetadata } from '@/lib/page-metadata'
import client from '../../../tina/__generated__/client'

const MAX_CATEGORY_FILTERS = 5

export const revalidate = 300

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

async function getAllBlogPosts() {
  let result = await client.queries.blog_postConnection()
  const edges = [...(result.data.blog_postConnection.edges ?? [])]

  while (result.data.blog_postConnection.pageInfo.hasNextPage) {
    result = await client.queries.blog_postConnection({
      after: result.data.blog_postConnection.pageInfo.endCursor,
    })
    if (result.data.blog_postConnection.edges) {
      edges.push(...result.data.blog_postConnection.edges)
    }
  }

  const posts = edges.flatMap((edge) => (edge?.node ? [edge.node] : []))

  return posts.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0
    const dateB = b.date ? new Date(b.date).getTime() : 0
    return dateB - dateA
  })
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const posts = await getAllBlogPosts()

    return buildSeoMetadata({
      pathname: '/blog',
      seo: {
        title: 'Acupuncture & Chinese Medicine Blog | Whole Healthy Family',
        description:
          'Read clinically grounded articles from Whole Healthy Family on acupuncture, Chinese herbal medicine, chronic pain, sleep, digestion, anxiety, and whole-person care.',
      },
      fallbackImage: posts[0]?.heroImg,
    })
  } catch (error) {
    return buildSeoMetadata({
      pathname: '/blog',
      seo: {
        title: 'Acupuncture & Chinese Medicine Blog | Whole Healthy Family',
        description:
          'Read clinically grounded articles from Whole Healthy Family on acupuncture, Chinese herbal medicine, chronic pain, sleep, digestion, anxiety, and whole-person care.',
      },
    })
  }
}

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams

  const page =
    'page' in resolvedSearchParams
      ? typeof resolvedSearchParams.page === 'string' &&
        parseInt(resolvedSearchParams.page) > 1
        ? parseInt(resolvedSearchParams.page)
        : notFound()
      : 1

  const category =
    typeof resolvedSearchParams.category === 'string'
      ? resolvedSearchParams.category
      : undefined

  const posts = await getAllBlogPosts()

  const categoryCounts = new Map<
    string,
    { name: string; slug: string; count: number }
  >()
  for (const post of posts) {
    const slug = post.category?._sys.breadcrumbs.join('/')
    const name = post.category?.name
    if (!slug || !name) continue
    const existing = categoryCounts.get(slug)
    if (existing) {
      existing.count += 1
    } else {
      categoryCounts.set(slug, { name, slug, count: 1 })
    }
  }
  const topCategories = Array.from(categoryCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, MAX_CATEGORY_FILTERS)

  const isFiltered = Boolean(category)
  const filteredPosts = isFiltered
    ? posts.filter(
        (post) => post.category?._sys.breadcrumbs.join('/') === category
      )
    : posts

  const featuredPost = !isFiltered ? filteredPosts[0] : undefined
  const featuredHref = featuredPost
    ? `/blog/${featuredPost._sys.breadcrumbs.join('/')}`
    : null
  const featuredDate =
    featuredPost?.date && !Number.isNaN(new Date(featuredPost.date).getTime())
      ? dateFormatter.format(new Date(featuredPost.date))
      : ''
  const restPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts

  return (
    <SiteFrame>
      <Section>
        <SectionBorder />
        <Container>
          <div className='flex flex-col'>
            <header className='relative flex w-full flex-col py-12 sm:py-16'>
              <Eyebrow>Blog</Eyebrow>
              <Heading className='mt-3 max-w-6xl max-[1028px]:text-wrap sm:text-[60px]/18!'>
                <span className=''>
                  Learn how acupuncture and Chinese medicine{' '}
                  <em className='mr-0.5 ml-1.5 text-primary-500'>
                    help your body heal
                  </em>
                </span>
              </Heading>
            </header>
          </div>
        </Container>
      </Section>
      {featuredPost && featuredHref && (
        <Section className='group transition-all duration-300 ease-out hover:bg-olive-200/35'>
          <Link
            href={featuredHref}
            className='absolute inset-0'
            aria-label={featuredPost.title}
          ></Link>
          <SectionBorder top='top-[2px]' />
          <Container>
            <SectionDividerLines />
            <div className='grid grid-cols-1 lg:grid-cols-2 lg:divide-x lg:divide-olive-950/7'>
              <div className='pointer-events-none pt-12 lg:py-12 lg:pr-12'>
                <div className='block'>
                  {featuredPost.heroImg?.src ? (
                    <div className='w-full overflow-hidden rounded-2xl bg-white p-[1.5px] shadow-[0_0_0_1px_rgba(0,0,0,0.12),inset_0_0_0_4px_rgba(255,255,255,1),0_2px_4px_0_rgba(0,0,0,0.04)]'>
                      <Image
                        src={featuredPost.heroImg.src}
                        alt={featuredPost.heroImg.alt || featuredPost.title}
                        width={1600}
                        height={1000}
                        priority
                        className='aspect-16/10 h-auto w-full rounded-[15px] object-cover transition-transform duration-500 ease-out group-hover:scale-105'
                      />
                    </div>
                  ) : (
                    <div className='aspect-16/10 w-full rounded-2xl bg-olive-100' />
                  )}
                </div>
              </div>
              <div className='flex flex-col justify-between gap-10 pt-10 pb-14 lg:py-12 lg:pl-12'>
                <div className='flex flex-col'>
                  {featuredPost.category?.name && (
                    <p className='text-sm/6 text-primary-600'>
                      {featuredPost.category.name}
                    </p>
                  )}
                  <Link href={featuredHref}>
                    <h2 className='mt-5 text-2xl/8.5 font-[450] tracking-tight text-olive-950 transition-colors sm:text-[28px]/9'>
                      {featuredPost.title}
                    </h2>
                  </Link>
                  {featuredPost.excerpt && (
                    <Text
                      size='md'
                      className='mt-3 flex max-w-2xl flex-col gap-4 text-olive-700/90'
                    >
                      <TinaMarkdown
                        content={featuredPost.excerpt}
                        components={{ a: TinaMarkdownLink }}
                      />
                    </Text>
                  )}
                </div>
                <div className='flex items-end justify-between gap-4'>
                  {featuredDate && (
                    <p className='text-sm/6 text-olive-700'>{featuredDate}</p>
                  )}
                  <Link
                    href={featuredHref}
                    className='inline-flex items-center gap-0.5 text-sm/6 font-medium text-olive-950 transition-colors duration-200 ease-out group-hover:text-primary-600'
                  >
                    Read
                    <ChevronRightIcon className='size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5' />
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      )}
      <Section>
        <SectionBorder />
        <Container>
          <SectionDividerLines />
          <div className='py-8'>
            <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between lg:gap-6'>
              <h2 className='text-xl/8 font-[450] tracking-tight text-olive-950'>
                Recent articles
              </h2>
              {topCategories.length > 0 && (
                <nav
                  aria-label='Filter posts by category'
                  className='-mx-2 -my-2 flex min-w-0 flex-nowrap items-center gap-1 overflow-x-auto px-2 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
                >
                  {[
                    { name: 'All articles', slug: '' as string },
                    ...topCategories,
                  ].map((item) => {
                    const isActive =
                      item.slug === '' ? !category : item.slug === category
                    const href =
                      item.slug === '' ? '/blog' : `/blog?category=${item.slug}`
                    return (
                      <Link
                        key={item.slug || 'all'}
                        href={href}
                        className={clsx(
                          'inline-flex shrink-0 items-center rounded-full border-transparent px-3.5 py-1.5 text-sm/6 font-[450] transition-colors',
                          isActive
                            ? 'border border-white bg-olive-200/90 text-olive-950 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.08),0_2px_4px_0px_rgba(0,0,0,0.01)] transition-all duration-200 ease-in-out hover:bg-olive-200/75'
                            : 'border-0 text-olive-700 hover:text-olive-950'
                        )}
                      >
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>
              )}
            </div>
          </div>
          <SectionDividerLines />
        </Container>
      </Section>
      <Section className='pt-12 pb-16'>
        <SectionBorder />
        <Container>
          {restPosts.length === 0 ? (
            <div className='pb-16 lg:pb-24'>
              <Text size='md' className='text-olive-700'>
                No posts found in this category yet.
              </Text>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6'>
              {restPosts.map((post) => {
                const href = `/blog/${post._sys.breadcrumbs.join('/')}`
                const date =
                  post.date && !Number.isNaN(new Date(post.date).getTime())
                    ? dateFormatter.format(new Date(post.date))
                    : ''

                return (
                  <LightWallpaper
                    key={post.id}
                    color='custom'
                    className='rounded-xl p-0 *:last:h-full'
                  >
                    <Link
                      href={href}
                      className='group flex h-full flex-col rounded-md bg-primary-100/45 p-2 text-olive-950 transition-colors hover:bg-primary-100/40'
                    >
                      {post.heroImg?.src ? (
                        <div className='w-full overflow-hidden rounded-xl bg-white p-[1.5px] shadow-[0_0_0_1px_rgba(0,0,0,0.12),inset_0_0_0_4px_rgba(255,255,255,1),0_2px_4px_0_rgba(0,0,0,0.04)]'>
                          <Image
                            src={post.heroImg.src}
                            alt={post.heroImg.alt || post.title}
                            width={800}
                            height={500}
                            className='aspect-16/10 h-auto w-full rounded-[11px] object-cover transition-transform duration-500 ease-out group-hover:scale-105'
                          />
                        </div>
                      ) : (
                        <div className='aspect-16/10 w-full rounded-xl bg-olive-100' />
                      )}
                      <div className='flex flex-1 flex-col px-3 pt-5 pb-4 sm:px-5 sm:pt-6'>
                        <div className='flex flex-col gap-2.5'>
                          {post.category?.name && (
                            <p className='text-sm/6 font-[450] text-primary-600'>
                              {post.category.name}
                            </p>
                          )}
                          <h3 className='text-[17px] font-medium tracking-tight text-olive-800'>
                            {post.title}
                          </h3>
                        </div>
                        <div className='mt-auto flex items-end justify-between gap-4 pt-6'>
                          {date && (
                            <p className='text-sm/6 text-olive-700'>{date}</p>
                          )}
                          <span className='inline-flex items-center gap-0.5 text-sm/6 font-medium text-olive-950 transition-colors duration-200 ease-out group-hover:text-primary-600'>
                            Read
                            <ChevronRightIcon className='size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5' />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </LightWallpaper>
                )
              })}
            </div>
          )}
        </Container>
      </Section>
      <SectionDividerBlock />
      <CallToActionSimpleBlock data={callToActionSimpleDefaultItem} />
    </SiteFrame>
  )
}
