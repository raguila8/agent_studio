import type { Collection } from 'tinacms'
import { callToActionSimpleBlockSchema } from '@/components/blocks/call-to-action-simple'
import { contactInfoWithFormBlockSchema } from '@/components/blocks/contact-info-with-form'
import { contentTwoColumnSimpleBlockSchema } from '@/components/blocks/content-two-column-simple'
import { contentTwoColumnWithImageBlockSchema } from '@/components/blocks/content-two-column-with-image'
import { contentTwoColumnWithRightImageBlockSchema } from '@/components/blocks/content-two-column-with-right-image'
import { faqsTwoColumnAccordionBlockSchema } from '@/components/blocks/faqs-two-column-accordion'
import { featuresIconGridBlockSchema } from '@/components/blocks/features-icon-grid'
import { featuresTwoColumnBlockSchema } from '@/components/blocks/features-two-column'
import { contentSplitWithPortraitBlockSchema } from '@/components/blocks/content-split-with-portrait'
import { heroSimpleCenteredBlockSchema } from '@/components/blocks/hero-simple-centered'
import { latestBlogPostsBlockSchema } from '@/components/blocks/latest-blog-posts'
import { wallpaperHeroWithImageBlockSchema } from '@/components/blocks/wallpaper-hero-with-image'
import { heroWithBackgroundOverlayBlockSchema } from '@/components/blocks/hero-with-background-overlay'
import { sectionDividerBlockSchema } from '@/components/blocks/section-divider'
import { sectionIntroHeaderBlockSchema } from '@/components/blocks/section-intro-header'
import { servicesStackedAlternatingWithImagesBlockSchema } from '@/components/blocks/services-stacked-alternating-with-images'
import { statsMinimalCenteredBlockSchema } from '@/components/blocks/stats-minimal-centered'
import { stepsBlockSchema } from '@/components/blocks/steps'
import { featuresCardsBlockSchema } from '@/components/blocks/features-cards'
import { testimonialWithLargeQuoteBlockSchema } from '@/components/blocks/testimonial-with-large-quote'
import { testimonialsAnimatedThreeColumnGridBlockSchema } from '@/components/blocks/testimonials-animated-three-column-grid'
import { trustBarBlockSchema } from '@/components/blocks/trust-bar'

export const blocksField = {
  type: 'object',
  list: true,
  name: 'blocks',
  label: 'Sections',
  ui: {
    visualSelector: true,
  },
  templates: [
    wallpaperHeroWithImageBlockSchema,
    heroSimpleCenteredBlockSchema,
    heroWithBackgroundOverlayBlockSchema,
    sectionIntroHeaderBlockSchema,
    contactInfoWithFormBlockSchema,
    trustBarBlockSchema,
    contentTwoColumnSimpleBlockSchema,
    contentTwoColumnWithImageBlockSchema,
    contentTwoColumnWithRightImageBlockSchema,
    faqsTwoColumnAccordionBlockSchema,
    featuresIconGridBlockSchema,
    featuresTwoColumnBlockSchema,
    stepsBlockSchema,
    featuresCardsBlockSchema,
    sectionDividerBlockSchema,
    servicesStackedAlternatingWithImagesBlockSchema,
    statsMinimalCenteredBlockSchema,
    testimonialWithLargeQuoteBlockSchema,
    testimonialsAnimatedThreeColumnGridBlockSchema,
    contentSplitWithPortraitBlockSchema,
    latestBlogPostsBlockSchema,
    callToActionSimpleBlockSchema,
  ],
} satisfies NonNullable<Collection['fields']>[number]
