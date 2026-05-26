import type { Metadata } from 'next'
import fallbackOgImage from '@/images/block-fallbacks/hero-background-acupuncture.png'
import { siteConfig } from '@/lib/site-config'

export type SeoImage = {
  src?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

export type PageSeo = {
  title?: string | null
  description?: string | null
  image?: SeoImage | null
}

function getAbsoluteImageUrl(src: string) {
  if (/^https?:\/\//.test(src)) return src

  return `${siteConfig.url}${src.startsWith('/') ? src : `/${src}`}`
}

function isImageCandidate(value: unknown): value is SeoImage {
  return (
    typeof value === 'object' &&
    value !== null &&
    'src' in value &&
    typeof value.src === 'string' &&
    value.src.length > 0
  )
}

export function findFirstImage(value: unknown): SeoImage | null {
  if (isImageCandidate(value)) {
    return value
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const image = findFirstImage(item)

      if (image) return image
    }

    return null
  }

  if (typeof value === 'object' && value !== null) {
    for (const item of Object.values(value)) {
      const image = findFirstImage(item)

      if (image) return image
    }
  }

  return null
}

function getCanonicalUrl(pathname: string) {
  return `${siteConfig.url}${pathname === '/' ? '' : pathname}`
}

export function getPlainText(value: unknown): string {
  if (typeof value === 'string') return value

  if (Array.isArray(value)) {
    return value.map(getPlainText).filter(Boolean).join(' ')
  }

  if (typeof value === 'object' && value !== null) {
    const record = value as Record<string, unknown>
    const text = typeof record.text === 'string' ? record.text : ''
    const children = getPlainText(record.children)

    return [text, children].filter(Boolean).join(' ')
  }

  return ''
}

function getMetadataImage({
  image,
  title,
}: {
  image?: SeoImage | null
  title: string
}) {
  const fallbackImage = {
    src: fallbackOgImage.src,
    alt: title,
    width: fallbackOgImage.width,
    height: fallbackOgImage.height,
  }

  const selectedImage = image?.src ? image : fallbackImage
  const selectedImageSrc = selectedImage.src || fallbackImage.src

  return {
    url: getAbsoluteImageUrl(selectedImageSrc),
    alt: selectedImage.alt || title,
    width: selectedImage.width || undefined,
    height: selectedImage.height || undefined,
  }
}

export function buildSeoMetadata({
  pathname,
  seo,
  fallbackTitle,
  fallbackDescription,
  fallbackImage,
}: {
  pathname: string
  seo?: PageSeo | null
  fallbackTitle?: string | null
  fallbackDescription?: string | null
  fallbackImage?: SeoImage | null
}): Metadata {
  const title = seo?.title || fallbackTitle || siteConfig.name
  const description =
    seo?.description || fallbackDescription || siteConfig.description
  const image = getMetadataImage({
    image: seo?.image?.src ? seo.image : fallbackImage,
    title,
  })
  const canonicalUrl = getCanonicalUrl(pathname)

  const sharedMetadata = {
    title,
    description,
  }

  return {
    ...sharedMetadata,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      ...sharedMetadata,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type: 'website',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      ...sharedMetadata,
      images: [image.url],
    },
  }
}
