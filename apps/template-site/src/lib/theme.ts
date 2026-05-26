export const defaultThemeColor = 'custom'

export const themeColorOptions = [
  defaultThemeColor,
  'marine',
  'brown',
  'clay',
  'green',
  'purple',
] as const

export type ThemeColor = (typeof themeColorOptions)[number]
export type ThemeWallpaperColor =
  | 'purple'
  | 'brown'
  | 'blue'
  | 'green'
  | 'primary'

const themeColorSet = new Set<string>(themeColorOptions)

export const themeColorLabels: Record<ThemeColor, string> = {
  custom: 'Custom',
  marine: 'Marine',
  brown: 'Brown',
  clay: 'Clay',
  green: 'Green',
  purple: 'Purple',
}

export function normalizeThemeColor(value?: string | null): ThemeColor {
  if (value && themeColorSet.has(value)) return value as ThemeColor

  return defaultThemeColor
}

export function getThemeWallpaperColor(
  primaryColor: ThemeColor
): ThemeWallpaperColor {
  if (primaryColor === 'marine') return 'blue'
  if (primaryColor === 'green') return 'green'

  return primaryColor === 'purple' || primaryColor === 'brown'
    ? primaryColor
    : 'primary'
}
