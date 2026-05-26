export const socialPlatforms = {
  instagram: {
    name: 'Instagram',
  },
  facebook: {
    name: 'Facebook',
  },
  youtube: {
    name: 'YouTube',
  },
  x: {
    name: 'X',
  },
} as const

export type SocialPlatform = keyof typeof socialPlatforms

export type EditableSocialLink = {
  platform?: string | null
  url?: string | null
}

export type NormalizedSocialLink = {
  platform: SocialPlatform
  name: (typeof socialPlatforms)[SocialPlatform]['name']
  href: string
}

function isSocialPlatform(platform: string): platform is SocialPlatform {
  return platform in socialPlatforms
}

function normalizeSocialUrl(url?: string | null) {
  const value = url?.trim() ?? ''

  if (!value) return ''

  return /^https?:\/\//i.test(value) ? value : `https://${value}`
}

export function normalizeSocialLinks(
  links?: Array<EditableSocialLink | null> | null
): NormalizedSocialLink[] {
  return (links ?? []).flatMap((link) => {
    const platform = link?.platform?.trim().toLowerCase() ?? ''
    const href = normalizeSocialUrl(link?.url)

    if (!platform || !isSocialPlatform(platform) || !href) {
      return []
    }

    return [
      {
        platform,
        name: socialPlatforms[platform].name,
        href,
      },
    ]
  })
}
