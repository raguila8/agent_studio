'use client'

import { wrapFieldsWithMeta } from 'tinacms'
import { themeColorLabels, themeColorOptions } from '@/lib/theme'
import type { ThemeColor } from '@/lib/theme'

const swatches: Record<ThemeColor, { background: string; border: string }> = {
  custom: {
    background: 'oklch(64.53% 0.1184 43.24)',
    border: 'oklch(58.364% 0.15012 45.234)',
  },
  marine: {
    background: 'oklch(0.574 0.052 241.18)',
    border: 'oklch(0.49 0.043 240.44)',
  },
  brown: {
    background: 'oklch(0.574 0.05 66.55)',
    border: 'oklch(0.486 0.043 67.83)',
  },
  clay: {
    background: 'oklch(0.603 0.14 23.24)',
    border: 'oklch(0.515 0.12 22.86)',
  },
  green: {
    background: '#737c68',
    border: '#596352',
  },
  purple: {
    background: '#7b627d',
    border: '#695166',
  },
}

export const ThemeColorPickerInput = wrapFieldsWithMeta(({ input }) => {
  return (
    <>
      <input type='hidden' {...input} />
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        {themeColorOptions.map((color) => {
          const isSelected = input.value === color

          return (
            <button
              key={color}
              type='button'
              aria-label={themeColorLabels[color]}
              title={themeColorLabels[color]}
              onClick={() => input.onChange(color)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                border: `1px solid ${swatches[color].border}`,
                background: swatches[color].background,
                boxShadow: isSelected
                  ? '0 0 0 3px #ffffff, 0 0 0 6px #60a5fa'
                  : '0 1px 2px rgb(0 0 0 / 0.12)',
                cursor: 'pointer',
              }}
            />
          )
        })}
      </div>
    </>
  )
})
