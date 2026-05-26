import type { TinaField } from 'tinacms'
import { NucleoIconPickerInput } from '../inputs/nucleo-icon-picker'

export function nucleoIconField({
  name = 'icon',
  label = 'Icon',
}: {
  name?: string
  label?: string
} = {}): TinaField {
  return {
    type: 'string',
    label,
    name,
    ui: {
      component: NucleoIconPickerInput as any,
    },
  }
}
