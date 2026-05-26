import type { TinaField } from 'tinacms'
import {
  defaultThemeColor,
  themeColorLabels,
  themeColorOptions,
} from '@/lib/theme'
import { ThemeColorPickerInput } from '../inputs/theme-color-picker'

export function themeColorField({
  name = 'primaryColor',
  label = 'Primary Color',
}: {
  name?: string
  label?: string
} = {}): TinaField {
  return {
    type: 'string',
    label,
    name,
    required: true,
    options: themeColorOptions.map((color) => ({
      label: themeColorLabels[color],
      value: color,
    })),
    ui: {
      component: ThemeColorPickerInput as any,
      defaultValue: defaultThemeColor,
    },
  }
}
