export type BlockCategory =
  | 'hero_intro'
  | 'content'
  | 'features_services'
  | 'process'
  | 'trust_proof'
  | 'testimonials'
  | 'faq'
  | 'cta'
  | 'contact'
  | 'resources'
  | 'utility'

export type BlockDoc = {
  category: BlockCategory
  description: string
  contentNotes?: string[]
}
