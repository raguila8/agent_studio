'use client'

import { Blocks } from '@/components/blocks'
import { useTina } from 'tinacms/dist/react'
import type { Page, PageQuery } from '../../../tina/__generated__/types'

type PageLike = Omit<Page, 'id' | '_sys' | '_values'>

type TinaClientPageProps = {
  data: {
    page: PageQuery['page']
  }
  variables: {
    relativePath: string
  }
  query: string
  dataKey: 'page'
}

export default function TinaClientPage(props: TinaClientPageProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  })
  const entry = data.page as PageLike | null | undefined

  if (!entry) {
    return null
  }

  return <Blocks {...entry} />
}
