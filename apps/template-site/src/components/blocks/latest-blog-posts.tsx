'use client'

import { useEffect, useState } from 'react'
import type { Template } from 'tinacms'
import { tinaField } from 'tinacms/dist/react'
import client from '../../../tina/__generated__/client'
import { Container } from '../elements/container'
import { Text } from '../elements/text'
import { PlainButtonLink } from '../elements/button'
import { LightWallpaper } from '../elements/wallpaper'
import { Section, SectionBorder, SectionDividerLines } from '../shared/section'
import { ChevronIcon } from '../icons/chevron-icon'
import {
  highlightedHeadingField,
  paragraphNode,
  richTextRoot,
  textNode,
  type RichTextValue,
} from '../tina/fields/highlighted-heading'
import {
  BlogPostCardGrid,
  type BlogPostCardItem,
} from '../shared/blog-post-card-grid'
import { SectionIntroHeader } from './section-intro-header'
import type { BlockDoc } from './block-doc'

type TinaContentSource = {
  _content_source?: {
    queryId: string
    path: Array<number | string>
  }
}

type ActionData = TinaContentSource & {
  label?: string | null
  link?: string | null
}

type LatestBlogPostsBlockData = TinaContentSource & {
  showTopBorder?: boolean | null
  label?: string | null
  heading?: RichTextValue
  intro?: string | null
  action?: ActionData | null
}

const POST_LIMIT = 3

async function fetchLatestPosts(): Promise<BlogPostCardItem[]> {
  const result = await client.queries.blog_postConnection()
  const edges = [...(result.data.blog_postConnection.edges ?? [])]

  return edges
    .flatMap((edge) => (edge?.node ? [edge.node] : []))
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      return dateB - dateA
    })
    .slice(0, POST_LIMIT)
    .map((post) => {
      const heroImg = post.heroImg as BlogPostCardItem['heroImg']

      return {
        id: post.id,
        title: post.title,
        slug: post._sys.breadcrumbs.join('/'),
        date: post.date ?? null,
        heroImg: heroImg
          ? {
              src: heroImg.src ?? null,
              alt: heroImg.alt ?? null,
              width: heroImg.width ?? null,
              height: heroImg.height ?? null,
            }
          : null,
        categoryName: post.category?.name ?? null,
      }
    })
}

export function LatestBlogPostsBlock({
  data,
}: {
  data: LatestBlogPostsBlockData
}) {
  const [posts, setPosts] = useState<BlogPostCardItem[] | null>(null)
  const showTopBorder = data.showTopBorder ?? true

  useEffect(() => {
    let active = true
    fetchLatestPosts()
      .then((result) => {
        if (active) setPosts(result)
      })
      .catch(() => {
        if (active) setPosts([])
      })
    return () => {
      active = false
    }
  }, [])

  const hasHeaderContent =
    data.label || data.heading || data.intro || data.action?.label

  return (
    <Section>
      {hasHeaderContent && (
        <SectionIntroHeader
          data={data}
          showTopBorder={showTopBorder}
          action={
            data.action?.label ? (
              <div data-tina-field={tinaField(data, 'action')}>
                <PlainButtonLink href={data.action.link ?? '#'} color='primary'>
                  {data.action.label}
                  <ChevronIcon />
                </PlainButtonLink>
              </div>
            ) : null
          }
        />
      )}
      <div className='relative'>
        <SectionBorder top='top-[2px]' />
        <SectionDividerLines />
        <Container className='py-12 sm:py-16'>
          {posts === null ? (
            <PostSkeletonGrid />
          ) : posts.length === 0 ? (
            <Text size='md' className='text-olive-700'>
              No posts to show yet.
            </Text>
          ) : (
            <BlogPostCardGrid posts={posts} />
          )}
        </Container>
      </div>
    </Section>
  )
}

export const latestBlogPostsBlockDoc = {
  category: 'resources',
  description:
    'Latest-posts section that fetches and displays the three most recent blog posts with an optional header and archive link. Use it when a page should surface current resources without manually selecting posts.',
  contentNotes: [
    'Always shows up to 3 posts sorted by post date.',
    'If there are no posts, the block renders an empty-state message.',
    'Use the action link for the blog or resource index.',
  ],
} satisfies BlockDoc

function PostSkeletonGrid() {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6'>
      {Array.from({ length: POST_LIMIT }).map((_, index) => (
        <LightWallpaper
          key={index}
          color='custom'
          className='rounded-xl p-0 *:last:h-full'
        >
          <div className='flex h-full flex-col rounded-md bg-primary-100/25 p-2'>
            <div className='aspect-16/10 w-full animate-pulse rounded-xl bg-olive-100' />
            <div className='flex flex-1 flex-col gap-3 px-3 pt-5 pb-4 sm:px-5 sm:pt-6'>
              <div className='h-4 w-20 animate-pulse rounded bg-olive-200' />
              <div className='h-5 w-3/4 animate-pulse rounded bg-olive-200' />
              <div className='mt-auto pt-6'>
                <div className='h-4 w-24 animate-pulse rounded bg-olive-200' />
              </div>
            </div>
          </div>
        </LightWallpaper>
      ))}
    </div>
  )
}

export const latestBlogPostsBlockSchema: Template = {
  name: 'latestBlogPosts',
  label: 'Latest Blog Posts',
  ui: {
    previewSrc: '/block-previews/latest-blog-posts.png',
    defaultItem: {
      showTopBorder: true,
      label: 'From the blog',
      heading: richTextRoot(
        paragraphNode(
          textNode('Read our '),
          textNode('latest articles', { italic: true })
        )
      ),
      intro:
        'Leberkas chuck hock steak kielbasa chicken venison mignon kevin meatball steak shankle meatball. Pork chuck tenderloin andouille doner biltong turducken beef sirloin.',
      action: {
        label: 'See all articles',
        link: '/blog',
      },
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
      label: 'Action',
      name: 'action',
      ui: {
        defaultItem: {
          label: 'See all articles',
          link: '/blog',
        },
      },
      fields: [
        {
          type: 'string',
          label: 'Label',
          name: 'label',
        },
        {
          type: 'string',
          label: 'Link',
          name: 'link',
        },
      ],
    },
  ],
}
