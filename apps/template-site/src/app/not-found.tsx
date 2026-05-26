import { SiteFrame } from '@/components/shared/site-frame'
import { Section, SectionBorder } from '@/components/shared/section'
import { Text } from '@/components/elements/text'
import { Heading } from '@/components/elements/heading'
import { Container } from '@/components/elements/container'
import { Eyebrow } from '@/components/elements/eyebrow'
import { ArrowNarrowRightIcon } from '@/components/icons/arrow-narrow-right-icon'
import Link from 'next/link'

export default function NotFound() {
  return (
    <SiteFrame>
      <Section>
        <SectionBorder />
        <Container>
          <div className='flex flex-col'>
            <header className='relative flex w-full flex-col py-12 sm:py-16'>
              <Eyebrow>404</Eyebrow>
              <Heading className='mt-4 max-w-5xl'>Page not found</Heading>

              <Text size='lg' className='mt-5 flex max-w-3xl flex-col gap-4'>
                Sorry, but the page you were looking for could not be found.
              </Text>
              <Link
                href='/'
                className='mt-6 inline-flex items-center gap-2.5 text-sm/6 font-medium text-olive-950 transition-colors duration-200 ease-out hover:text-primary-600'
              >
                Go back home <ArrowNarrowRightIcon />
              </Link>
            </header>
          </div>
        </Container>
      </Section>
    </SiteFrame>
  )
}
