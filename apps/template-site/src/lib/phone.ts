export type PhoneCountry = 'US' | 'CA'

export type EditablePhone = {
  country?: string | null
  number?: string | null
}

export type NormalizedPhone = {
  country: PhoneCountry
  raw: string
  number: string
  e164: string
  display: string
  href: string
}

const defaultCountry: PhoneCountry = 'US'

function normalizeCountry(country?: string | null): PhoneCountry {
  return country === 'CA' ? 'CA' : defaultCountry
}

function getDigits(value: string) {
  return value.replace(/\D/g, '')
}

function getNationalDigits(digits: string, country: PhoneCountry) {
  if ((country === 'US' || country === 'CA') && digits.length === 11) {
    return digits.startsWith('1') ? digits.slice(1) : digits
  }

  return digits
}

function formatNorthAmericanDisplay(digits: string, raw: string) {
  if (digits.length !== 10) return raw

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function formatE164(digits: string, country: PhoneCountry) {
  if (!digits) return ''

  if (country === 'US' || country === 'CA') {
    const nationalDigits = getNationalDigits(digits, country)

    if (nationalDigits.length === 10) {
      return `+1${nationalDigits}`
    }
  }

  return digits.startsWith('+') ? digits : `+${digits}`
}

export function normalizePhone(phone?: EditablePhone | null): NormalizedPhone {
  const country = normalizeCountry(phone?.country)
  const raw = phone?.number?.trim() ?? ''
  const digits = getDigits(raw)
  const nationalDigits = getNationalDigits(digits, country)
  const e164 = formatE164(digits, country)
  const display =
    country === 'US' || country === 'CA'
      ? formatNorthAmericanDisplay(nationalDigits, raw)
      : raw

  return {
    country,
    raw,
    number: e164,
    e164,
    display,
    href: e164 ? `tel:${e164}` : '',
  }
}
