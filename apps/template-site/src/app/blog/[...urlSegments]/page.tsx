import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import client from '../../../../tina/__generated__/client'
import { SiteFrame } from '@/components/shared/site-frame'
import PostClientPage from '@/components/tina/post-client-page'
import type { BlogPostCardItem } from '@/components/shared/blog-post-card-grid'
import {
  buildSeoMetadata,
  getPlainText,
  type PageSeo,
  type SeoImage,
} from '@/lib/page-metadata'

export const revalidate = 300

const RELATED_POST_LIMIT = 3

export async function generateMetadata({
  params,
}: {
  params: Promise<{ urlSegments: string[] }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const filepath = resolvedParams.urlSegments.join('/')

  try {
    const { data } = await client.queries.blog_post({
      relativePath: `${filepath}.mdx`,
    })
    const post = data.blog_post as {
      title?: string | null
      excerpt?: unknown
      heroImg?: SeoImage | null
      seo?: PageSeo | null
    }

    return buildSeoMetadata({
      pathname: `/blog/${filepath}`,
      seo: post.seo,
      fallbackTitle: post.title,
      fallbackDescription: getPlainText(post.excerpt),
      fallbackImage: post.heroImg,
    })
  } catch (error) {
    return {}
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ urlSegments: string[] }>
}) {
  const resolvedParams = await params
  const filepath = resolvedParams.urlSegments.join('/')

  let data
  try {
    data = await client.queries.blog_post({
      relativePath: `${filepath}.mdx`,
    })
  } catch (error) {
    notFound()
  }

  const post = data.data.blog_post

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedBlogPosts({
    currentPostId: post.id,
    currentCategorySlug: post.category?._sys.breadcrumbs.join('/') ?? null,
  })

  return (
    <SiteFrame>
      <PostClientPage {...data} relatedPosts={relatedPosts} />
    </SiteFrame>
  )
}

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

    if (dateA !== dateB) {
      return dateB - dateA
    }

    return a.title.localeCompare(b.title)
  })
}

async function getRelatedBlogPosts({
  currentPostId,
  currentCategorySlug,
}: {
  currentPostId: string
  currentCategorySlug: string | null
}): Promise<BlogPostCardItem[]> {
  const posts = await getAllBlogPosts()
  const otherPosts = posts.filter((post) => post.id !== currentPostId)
  const sameCategoryPosts = otherPosts.filter(
    (post) => post.category?._sys.breadcrumbs.join('/') === currentCategorySlug
  )
  const fallbackPosts = otherPosts.filter(
    (post) => post.category?._sys.breadcrumbs.join('/') !== currentCategorySlug
  )

  return [...sameCategoryPosts, ...fallbackPosts]
    .slice(0, RELATED_POST_LIMIT)
    .map((post) => ({
      id: post.id,
      title: post.title,
      slug: post._sys.breadcrumbs.join('/'),
      date: post.date ?? null,
      heroImg: post.heroImg
        ? {
            src: post.heroImg.src ?? null,
            alt: post.heroImg.alt ?? null,
            width: post.heroImg.width ?? null,
            height: post.heroImg.height ?? null,
          }
        : null,
      categoryName: post.category?.name ?? null,
    }))
}

export async function generateStaticParams() {
  let posts = await client.queries.blog_postConnection()
  const allPosts = posts

  if (!allPosts.data.blog_postConnection.edges) {
    return []
  }

  while (posts.data.blog_postConnection.pageInfo.hasNextPage) {
    posts = await client.queries.blog_postConnection({
      after: posts.data.blog_postConnection.pageInfo.endCursor,
    })

    if (!posts.data.blog_postConnection.edges) {
      break
    }

    allPosts.data.blog_postConnection.edges.push(
      ...posts.data.blog_postConnection.edges
    )
  }

  const params = allPosts.data?.blog_postConnection.edges
    .map((edge) => ({
      urlSegments: edge?.node?._sys.breadcrumbs || [],
    }))
    .filter((x) => x.urlSegments.length >= 1)

  return params
}
