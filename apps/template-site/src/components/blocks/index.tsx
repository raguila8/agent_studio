import { tinaField } from 'tinacms/dist/react'
import { Page, PageBlocks } from '../../../tina/__generated__/types'
import { CallToActionSimpleBlock } from './call-to-action-simple'
import { ContactInfoWithFormBlock } from './contact-info-with-form'
import { ContentTwoColumnSimpleBlock } from './content-two-column-simple'
import { ContentTwoColumnWithImageBlock } from './content-two-column-with-image'
import { ContentTwoColumnWithRightImageBlock } from './content-two-column-with-right-image'
import { FaqsTwoColumnAccordionBlock } from './faqs-two-column-accordion'
import { FeaturesIconGridBlock } from './features-icon-grid'
import { FeaturesTwoColumnBlock } from './features-two-column'
import { ContentSplitWithPortraitBlock } from './content-split-with-portrait'
import { HeroSimpleCenteredBlock } from './hero-simple-centered'
import { LatestBlogPostsBlock } from './latest-blog-posts'
import { WallpaperHeroWithImageBlock } from './wallpaper-hero-with-image'
import { HeroWithBackgroundOverlay } from './hero-with-background-overlay'
import { SectionDividerBlock } from './section-divider'
import { SectionIntroHeaderBlock } from './section-intro-header'
import { ServicesStackedAlternatingWithImagesBlock } from './services-stacked-alternating-with-images'
import { StatsMinimalCenteredBlock } from './stats-minimal-centered'
import { StepsBlock } from './steps'
import { FeaturesCardsBlock } from './features-cards'
import { TestimonialWithLargeQuoteBlock } from './testimonial-with-large-quote'
import { TestimonialsAnimatedThreeColumnGridBlock } from './testimonials-animated-three-column-grid'
import { TrustBarBlock } from './trust-bar'

type BlocksEntry = Omit<Page, 'id' | '_sys' | '_values'>

type SharedBlock = PageBlocks

export const Blocks = (props: BlocksEntry) => {
  if (!props.blocks) return null
  return (
    <>
      {props.blocks.map(function (block, i) {
        if (!block) return null

        return (
          <div key={i} data-tina-field={tinaField(block)}>
            <Block {...block} />
          </div>
        )
      })}
    </>
  )
}

const Block = (block: SharedBlock) => {
  switch (getBlockTypeName(block.__typename)) {
    case 'HeroWithBackgroundOverlay':
      return <HeroWithBackgroundOverlay data={block as any} />
    case 'WallpaperHeroWithImage':
      return <WallpaperHeroWithImageBlock data={block as any} />
    case 'HeroSimpleCentered':
      return <HeroSimpleCenteredBlock data={block as any} />
    case 'TrustBar':
      return <TrustBarBlock data={block as any} />
    case 'ContentTwoColumnWithImage':
      return <ContentTwoColumnWithImageBlock data={block as any} />
    case 'ContentTwoColumnWithRightImage':
      return <ContentTwoColumnWithRightImageBlock data={block as any} />
    case 'ContentTwoColumnSimple':
      return <ContentTwoColumnSimpleBlock data={block as any} />
    case 'FaqsTwoColumnAccordion':
      return <FaqsTwoColumnAccordionBlock data={block as any} />
    case 'CallToActionSimple':
      return <CallToActionSimpleBlock data={block as any} />
    case 'ContactInfoWithForm':
      return <ContactInfoWithFormBlock data={block as any} />
    case 'FeaturesIconGrid':
      return <FeaturesIconGridBlock data={block as any} />
    case 'FeaturesTwoColumn':
      return <FeaturesTwoColumnBlock data={block as any} />
    case 'Steps':
      return <StepsBlock data={block as any} />
    case 'FeaturesCards':
      return <FeaturesCardsBlock data={block as any} />
    case 'ContentSplitWithPortrait':
      return <ContentSplitWithPortraitBlock data={block as any} />
    case 'LatestBlogPosts':
      return <LatestBlogPostsBlock data={block as any} />
    case 'TestimonialWithLargeQuote':
      return <TestimonialWithLargeQuoteBlock data={block as any} />
    case 'SectionDivider':
      return <SectionDividerBlock />
    case 'SectionIntroHeader':
      return <SectionIntroHeaderBlock data={block as any} />
    case 'ServicesStackedAlternatingWithImages':
      return <ServicesStackedAlternatingWithImagesBlock data={block as any} />
    case 'StatsMinimalCentered':
      return <StatsMinimalCenteredBlock data={block as any} />
    case 'TestimonialsAnimatedThreeColumnGrid':
      return <TestimonialsAnimatedThreeColumnGridBlock data={block as any} />
    default:
      return null
  }
}

function getBlockTypeName(__typename?: string) {
  return __typename?.replace(/^PageBlocks/, '')
}
