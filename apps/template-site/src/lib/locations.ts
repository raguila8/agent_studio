export type EditableLocation = {
  name?: string | null
  streetAddress?: string | null
  addressLine2?: string | null
  city?: string | null
  region?: string | null
  postalCode?: string | null
  country?: string | null
  hours?: Array<string | null> | null
}

export type NormalizedLocation = {
  displayName: string
  streetAddress: string
  addressLocality: string
  addressRegion: string
  postalCode: string
  addressCountry: string
  hours: string[]
}

function clean(value?: string | null) {
  return value?.trim() ?? ''
}

function normalizeLocation(location: EditableLocation): NormalizedLocation {
  const name = clean(location.name)
  const streetAddress = clean(location.streetAddress)
  const addressLine2 = clean(location.addressLine2)
  const city = clean(location.city)
  const region = clean(location.region)
  const postalCode = clean(location.postalCode)
  const country = clean(location.country) || 'US'

  return {
    displayName: name || `${city}, ${region}`,
    streetAddress: [streetAddress, addressLine2].filter(Boolean).join(', '),
    addressLocality: city,
    addressRegion: region,
    postalCode,
    addressCountry: country,
    hours: location.hours?.flatMap((hour) => (hour ? [hour] : [])) ?? [],
  }
}

export function normalizeLocations(
  locations?: Array<EditableLocation | null> | null
): NormalizedLocation[] {
  return (
    locations
      ?.filter((location): location is EditableLocation => Boolean(location))
      .map((location) => normalizeLocation(location)) ?? []
  )
}
