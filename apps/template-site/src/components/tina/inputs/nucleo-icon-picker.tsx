'use client'

import { Fragment, useMemo, useState } from 'react'
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react'
import { wrapFieldsWithMeta } from 'tinacms'
import {
  NucleoIcon,
  getNucleoIconLabel,
  nucleoIconOptions,
} from '../icons/nucleo'

export const NucleoIconPickerInput = wrapFieldsWithMeta(({ input }) => {
  const [filter, setFilter] = useState('')

  const filteredIcons = useMemo(() => {
    const query = filter.trim().toLowerCase()

    if (!query) return nucleoIconOptions

    return nucleoIconOptions.filter((option) => {
      return (
        option.label.toLowerCase().includes(query) ||
        option.value.toLowerCase().includes(query) ||
        ('keywords' in option &&
          option.keywords.some((keyword) =>
            keyword.toLowerCase().includes(query)
          ))
      )
    })
  }, [filter])

  const selectedLabel = getNucleoIconLabel(input.value) ?? 'Select icon'

  return (
    <div style={{ position: 'relative', zIndex: 1000 }}>
      <input type='hidden' {...input} />
      <Popover>
        {({ open, close }) => (
          <>
            <PopoverButton
              style={{
                display: 'flex',
                width: '100%',
                minHeight: 44,
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                borderRadius: 999,
                border: '1px solid #d1d5db',
                background: open ? '#f3f4f6' : '#ffffff',
                padding: '10px 14px',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    width: 24,
                    height: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4b5563',
                  }}
                >
                  <NucleoIcon
                    name={input.value}
                    title=''
                    aria-hidden='true'
                    style={{ width: 20, height: 20 }}
                  />
                </span>
                <span>{selectedLabel}</span>
              </span>
              <span
                aria-hidden='true'
                style={{
                  color: '#6b7280',
                  fontSize: 12,
                }}
              >
                {open ? 'Close' : 'Browse'}
              </span>
            </PopoverButton>
            <Transition
              as={Fragment}
              enter='transition duration-150 ease-out'
              enterFrom='transform opacity-0 -translate-y-2'
              enterTo='transform opacity-100 translate-y-0'
              leave='transition duration-100 ease-in'
              leaveFrom='transform opacity-100 translate-y-0'
              leaveTo='transform opacity-0 -translate-y-2'
            >
              <PopoverPanel
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 'calc(100% + 8px)',
                  width: 'min(32rem, 100vw - 3rem)',
                  overflow: 'hidden',
                  borderRadius: 16,
                  border: '1px solid #e5e7eb',
                  background: '#ffffff',
                  boxShadow:
                    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                }}
              >
                <div
                  style={{
                    borderBottom: '1px solid #e5e7eb',
                    padding: 12,
                  }}
                >
                  <input
                    type='text'
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    placeholder='Filter icons...'
                    style={{
                      width: '100%',
                      borderRadius: 10,
                      border: '1px solid #d1d5db',
                      padding: '10px 12px',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                    gap: 8,
                    maxHeight: 320,
                    overflowY: 'auto',
                    padding: 12,
                  }}
                >
                  <button
                    type='button'
                    onClick={() => {
                      input.onChange('')
                      setFilter('')
                      close()
                    }}
                    style={iconButtonStyles}
                  >
                    <span style={{ fontSize: 12, color: '#6b7280' }}>
                      Clear
                    </span>
                  </button>
                  {filteredIcons.map((option) => (
                    <button
                      key={option.value}
                      type='button'
                      onClick={() => {
                        input.onChange(option.value)
                        setFilter('')
                        close()
                      }}
                      title={option.label}
                      style={iconButtonStyles}
                    >
                      <NucleoIcon
                        name={option.value}
                        title=''
                        aria-hidden='true'
                        style={{ width: 22, height: 22 }}
                      />
                      <span
                        style={{
                          fontSize: 11,
                          lineHeight: 1.3,
                          textAlign: 'center',
                        }}
                      >
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
                {filteredIcons.length === 0 && (
                  <div
                    style={{
                      borderTop: '1px solid #e5e7eb',
                      padding: 12,
                      color: '#6b7280',
                      fontSize: 12,
                      textAlign: 'center',
                    }}
                  >
                    No icons match that filter.
                  </div>
                )}
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
})

const iconButtonStyles = {
  display: 'flex',
  minHeight: 84,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  borderRadius: 12,
  border: '1px solid #e5e7eb',
  background: '#ffffff',
  padding: 10,
  color: '#374151',
  cursor: 'pointer',
} as const
