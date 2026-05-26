import globalContent from '../../content/global/index.json'
import { siteConfig } from './site-config'

type EditableHeaderLink = {
  _template?: string | null
  label?: string | null
  href?: string | null
  items?: Array<EditableHeaderDropdownItem | null> | null
}

type EditableHeaderDropdownItem = {
  label?: string | null
  href?: string | null
  description?: string | null
}

type EditableHeaderCta = {
  label?: string | null
  href?: string | null
}

type EditableHeaderActions = {
  primary?: EditableHeaderCta | null
  secondary?: EditableHeaderCta | null
}

type EditableHeaderNavigation = {
  links?: Array<EditableHeaderLink | null> | null
  actions?: EditableHeaderActions | null
}

type EditableFooterLink = {
  label?: string | null
  href?: string | null
}

type EditableFooterGroup = {
  title?: string | null
  links?: Array<EditableFooterLink | null> | null
}

type EditableFooterNavigation = {
  groups?: Array<EditableFooterGroup | null> | null
  showSocialLinks?: boolean | null
}

export type FooterNavigationLink = {
  label: string
  href: string
}

export type FooterNavigationGroup = {
  title: string
  links: FooterNavigationLink[]
}

export type FooterNavigation = {
  groups: FooterNavigationGroup[]
  showSocialLinks: boolean
}

export type HeaderNavigationLink = {
  type: 'link'
  label: string
  href: string
}

export type HeaderNavigationDropdownItem = {
  label: string
  href: string
  description: string
}

export type HeaderNavigationDropdown = {
  type: 'dropdown'
  label: string
  items: HeaderNavigationDropdownItem[]
}

export type HeaderNavigationItem =
  | HeaderNavigationLink
  | HeaderNavigationDropdown

export type HeaderNavigationCta = {
  label: string
  href: string
}

export type HeaderNavigation = {
  links: HeaderNavigationItem[]
  actions: {
    primary: HeaderNavigationCta | null
    secondary: HeaderNavigationCta | null
  }
}

function normalizeHeaderDropdownItem(
  item?: EditableHeaderDropdownItem | null
): HeaderNavigationDropdownItem | null {
  const label = item?.label?.trim() ?? ''
  const href = item?.href?.trim() ?? ''

  if (!label || !href) return null

  return {
    label,
    href,
    description: item?.description?.trim() ?? '',
  }
}

function normalizeHeaderLink(
  link?: EditableHeaderLink | null
): HeaderNavigationItem | null {
  const label = link?.label?.trim() ?? ''
  const items = (link?.items ?? []).flatMap((item) => {
    const normalizedItem = normalizeHeaderDropdownItem(item)

    return normalizedItem ? [normalizedItem] : []
  })

  if (!label) return null

  if (link?._template === 'dropdown' || items.length > 0) {
    if (items.length === 0) return null

    return {
      type: 'dropdown',
      label,
      items,
    }
  }

  const href = link?.href?.trim() ?? ''

  if (!href) return null

  return {
    type: 'link',
    label,
    href,
  }
}

function normalizeHeaderPrimaryAction(
  action?: EditableHeaderCta | null
): HeaderNavigationCta | null {
  const label = action?.label?.trim() ?? ''
  const href = action?.href?.trim() || siteConfig.contact.bookingUrl

  if (!label || !href) return null

  return {
    label,
    href,
  }
}

function normalizeHeaderSecondaryAction(
  action?: EditableHeaderCta | null
): HeaderNavigationCta | null {
  const label = action?.label?.trim() ?? ''
  const href = action?.href?.trim() ?? ''

  if (label && href) {
    return {
      label,
      href,
    }
  }

  if (!label && !href && siteConfig.contact.phone.href) {
    return {
      label: siteConfig.contact.phone.display,
      href: siteConfig.contact.phone.href,
    }
  }

  return null
}

function normalizeHeaderNavigation(
  header?: EditableHeaderNavigation | null
): HeaderNavigation {
  const links = (header?.links ?? []).flatMap((link) => {
    const normalizedLink = normalizeHeaderLink(link)

    return normalizedLink ? [normalizedLink] : []
  })

  return {
    links,
    actions: {
      primary: normalizeHeaderPrimaryAction(header?.actions?.primary),
      secondary: normalizeHeaderSecondaryAction(header?.actions?.secondary),
    },
  }
}

function normalizeFooterLink(
  link?: EditableFooterLink | null
): FooterNavigationLink | null {
  const label = link?.label?.trim() ?? ''
  const href = link?.href?.trim() ?? ''

  if (!label || !href) return null

  return {
    label,
    href,
  }
}

function normalizeFooterGroup(
  group?: EditableFooterGroup | null
): FooterNavigationGroup | null {
  const title = group?.title?.trim() ?? ''
  const links = (group?.links ?? []).flatMap((link) => {
    const normalizedLink = normalizeFooterLink(link)

    return normalizedLink ? [normalizedLink] : []
  })

  if (!title || links.length === 0) return null

  return {
    title,
    links,
  }
}

function normalizeFooterNavigation(
  footer?: EditableFooterNavigation | null
): FooterNavigation {
  const groups = (footer?.groups ?? []).flatMap((group) => {
    const normalizedGroup = normalizeFooterGroup(group)

    return normalizedGroup ? [normalizedGroup] : []
  })

  return {
    groups,
    showSocialLinks: footer?.showSocialLinks ?? true,
  }
}

export const navigationConfig = {
  header: normalizeHeaderNavigation(globalContent.navigation?.header),
  footer: normalizeFooterNavigation(globalContent.navigation?.footer),
} as const
