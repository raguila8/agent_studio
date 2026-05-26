import type { StaticImageData } from 'next/image'

export function hasImageSrc(src: string | null | undefined): src is string {
  return typeof src === 'string' && src.trim().length > 0
}

export function imageSrcOrFallback(
  src: string | null | undefined,
  fallback: StaticImageData
) {
  return hasImageSrc(src) ? src : fallback
}
