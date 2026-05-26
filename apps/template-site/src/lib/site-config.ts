import globalContent from '../../content/global/index.json'
import { normalizeLocations } from './locations'
import { normalizePhone } from './phone'
import { normalizeSocialLinks } from './social-links'
import { getThemeWallpaperColor, normalizeThemeColor } from './theme'

const phone = {
  ...normalizePhone(globalContent.contact?.phone),
} as const

function normalizeSiteUrl(url?: string | null) {
  const value = url?.trim().replace(/\/+$/, '') ?? ''

  if (!value) return ''

  return /^https?:\/\//.test(value) ? value : `https://${value}`
}

function normalizeLinkUrl(url?: string | null) {
  const value = url?.trim() ?? ''

  if (!value) return ''

  if (
    value.startsWith('/') ||
    value.startsWith('#') ||
    /^[a-z][a-z0-9+.-]*:/i.test(value)
  ) {
    return value
  }

  return `https://${value}`
}

const site = globalContent.site
const email = globalContent.contact?.email ?? ''
const bookingUrl = normalizeLinkUrl(globalContent.contact?.bookingUrl)
const contactFormEmbedUrl = normalizeSiteUrl(
  globalContent.contact?.contactFormEmbedUrl
)
const locations = normalizeLocations(globalContent.contact?.locations)
const socialLinks = normalizeSocialLinks(globalContent.contact?.socialLinks)
const theme = globalContent.theme
const primaryColor = normalizeThemeColor(theme?.primaryColor)
const logoSrc = site?.logo?.src?.trim() ?? ''
const logoWidth = site?.logo?.width ?? 0
const logoHeight = site?.logo?.height ?? 0

export const siteConfig = {
  name: site?.name ?? '',
  url: normalizeSiteUrl(site?.url),
  logo: {
    src: logoSrc,
    width: logoWidth,
    height: logoHeight,
  },
  phone: phone.number,
  email,
  contact: {
    phone,
    email,
    bookingUrl,
    contactFormEmbedUrl,
  },
  description: site?.description ?? '',
  socialLinks,
  socialProfiles: socialLinks.map((link) => link.href),
  locations,
  theme: {
    primaryColor,
    wallpaperColor: getThemeWallpaperColor(primaryColor),
  },
} as const
