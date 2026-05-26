import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import client from '../../../tina/__generated__/client'
import { SiteFrame } from '@/components/shared/site-frame'
import TinaClientPage from '@/components/tina/tina-client-page'
import {
  buildSeoMetadata,
  findFirstImage,
  type PageSeo,
} from '@/lib/page-metadata'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ urlSegments: string[] }>
}): Promise<Metadata> {
  const resolvedParams = await params

  if (resolvedParams.urlSegments[0] === '.well-known') {
    return {}
  }

  const filepath = resolvedParams.urlSegments.join('/')

  try {
    const { data } = await client.queries.page({
      relativePath: `${filepath}.mdx`,
    })
    const page = data.page as {
      title?: string | null
      seo?: PageSeo | null
      blocks?: unknown
    }

    return buildSeoMetadata({
      pathname: `/${filepath}`,
      seo: page.seo,
      fallbackTitle: page.title,
      fallbackImage: findFirstImage(page.blocks),
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

  if (resolvedParams.urlSegments[0] === '.well-known') {
    notFound()
  }

  if (filepath === 'landing') {
    redirect('/')
  }

  let data
  try {
    data = await client.queries.page({
      relativePath: `${filepath}.mdx`,
    })
  } catch (error) {
    notFound()
  }

  return (
    <SiteFrame>
      <TinaClientPage {...data} dataKey='page' />
    </SiteFrame>
  )
}

export async function generateStaticParams() {
  let pages = await client.queries.pageConnection()
  const allPages = pages

  if (!allPages.data.pageConnection.edges) {
    return []
  }

  while (pages.data.pageConnection.pageInfo.hasNextPage) {
    pages = await client.queries.pageConnection({
      after: pages.data.pageConnection.pageInfo.endCursor,
    })

    if (!pages.data.pageConnection.edges) {
      break
    }

    allPages.data.pageConnection.edges.push(...pages.data.pageConnection.edges)
  }

  const params = allPages.data?.pageConnection.edges
    .map((edge) => ({
      urlSegments: edge?.node?._sys.breadcrumbs || [],
    }))
    .filter((x) => x.urlSegments.length >= 1)
    .filter((x) => !x.urlSegments.every((x) => x === 'landing'))
    .filter((x) => !x.urlSegments.every((x) => x === 'home')) // exclude the home page

  return params
}
