import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import client from '../../tina/__generated__/client'
import { SiteFrame } from '@/components/shared/site-frame'
import TinaClientPage from '@/components/tina/tina-client-page'
import {
  buildSeoMetadata,
  findFirstImage,
  type PageSeo,
} from '@/lib/page-metadata'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data } = await client.queries.page({
      relativePath: 'landing.mdx',
    })
    const page = data.page as {
      seo?: PageSeo | null
      blocks?: unknown
    }

    return buildSeoMetadata({
      pathname: '/',
      seo: page.seo,
      fallbackImage: findFirstImage(page.blocks),
    })
  } catch (error) {
    return {}
  }
}

export default async function Page() {
  let data

  try {
    data = await client.queries.page({
      relativePath: 'landing.mdx',
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
