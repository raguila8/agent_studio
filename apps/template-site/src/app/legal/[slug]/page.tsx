import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import client from '../../../../tina/__generated__/client'
import { SiteFrame } from '@/components/shared/site-frame'
import LegalClientPage from '@/components/tina/legal-client-page'
import { buildSeoMetadata, type PageSeo } from '@/lib/page-metadata'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  try {
    const { data } = await client.queries.legalPage({
      relativePath: `${slug}.mdx`,
    })
    const legalPage = data.legalPage as {
      heading?: string | null
      subheading?: string | null
      seo?: PageSeo | null
    }

    return buildSeoMetadata({
      pathname: `/legal/${slug}`,
      seo: legalPage.seo,
      fallbackTitle: legalPage.heading,
      fallbackDescription: legalPage.subheading,
    })
  } catch (error) {
    return {}
  }
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let data

  try {
    data = await client.queries.legalPage({
      relativePath: `${slug}.mdx`,
    })
  } catch (error) {
    notFound()
  }

  return (
    <SiteFrame>
      <LegalClientPage {...data} />
    </SiteFrame>
  )
}

export async function generateStaticParams() {
  const data = await client.queries.legalPageConnection()

  return (
    data.data.legalPageConnection.edges?.flatMap((edge) => {
      const filename = edge?.node?._sys?.filename

      return filename ? [{ slug: filename }] : []
    }) ?? []
  )
}
