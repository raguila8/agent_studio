'use client'

import { tinaField, useTina } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import type { LegalPageQuery } from '../../../tina/__generated__/types'
import { Container } from '../elements/container'
import { Heading } from '../elements/heading'
import { Text } from '../elements/text'
import { Section, SectionBorder, SectionDividerLines } from '../shared/section'
import { TinaMarkdownLink } from './elements/tina-markdown-link'

type LegalClientPageProps = {
  data: LegalPageQuery
  variables: {
    relativePath: string
  }
  query: string
}

export default function LegalClientPage(props: LegalClientPageProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  })

  const page = data.legalPage

  if (!page) return null

  return (
    <article>
      <Section>
        <SectionBorder />
        <Container>
          <header className='relative flex w-full flex-col items-center gap-6 py-12 sm:py-16'>
            <Heading
              className='max-w-5xl text-center'
              data-tina-field={tinaField(page, 'heading')}
            >
              {page.heading}
            </Heading>
            {page.subheading && (
              <Text
                size='lg'
                className='flex max-w-xl flex-col gap-4 text-center'
                data-tina-field={tinaField(page, 'subheading')}
              >
                {page.subheading}
              </Text>
            )}
          </header>
        </Container>
      </Section>
      <Section>
        <SectionBorder top='top-[2px]' />
        <Container>
          <SectionDividerLines />
          <div
            className='prose prose-lg mx-auto w-full max-w-3xl py-10 sm:py-12 lg:py-16'
            data-tina-field={tinaField(page, '_body')}
          >
            <TinaMarkdown
              content={page._body}
              components={{ a: TinaMarkdownLink }}
            />
          </div>
        </Container>
      </Section>
    </article>
  )
}
