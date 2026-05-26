'use client'

import { useEffect } from 'react'
import { ImageField } from 'tinacms'

type TinaImageFieldProps = Parameters<typeof ImageField>[0]

function getSiblingFieldName(sourceFieldName: string, siblingName: string) {
  if (sourceFieldName.endsWith('.src')) {
    return sourceFieldName.replace(/\.src$/, `.${siblingName}`)
  }

  if (sourceFieldName.endsWith('[src]')) {
    return sourceFieldName.replace(/\[src\]$/, `[${siblingName}]`)
  }

  return siblingName
}

function getPublicImageUrl(value: string) {
  if (/^(https?:|data:|blob:)/.test(value)) return value

  return value.startsWith('/') ? value : `/${value}`
}

async function loadImageDimensions(value: string) {
  const image = new Image()

  image.src = getPublicImageUrl(value)
  await image.decode()

  return {
    width: image.naturalWidth,
    height: image.naturalHeight,
  }
}

export function ImageWithDimensionsField(props: TinaImageFieldProps) {
  const { form, input } = props

  useEffect(() => {
    const value = input.value
    const widthFieldName = getSiblingFieldName(input.name, 'width')
    const heightFieldName = getSiblingFieldName(input.name, 'height')

    if (typeof value !== 'string' || value.length === 0) {
      form.change(widthFieldName, undefined)
      form.change(heightFieldName, undefined)
      return
    }

    let isCurrent = true

    loadImageDimensions(value)
      .then((dimensions) => {
        if (!isCurrent) return

        if (form.getFieldState(widthFieldName)?.value !== dimensions.width) {
          form.change(widthFieldName, dimensions.width)
        }

        if (form.getFieldState(heightFieldName)?.value !== dimensions.height) {
          form.change(heightFieldName, dimensions.height)
        }
      })
      .catch(() => {
        // Leave the existing dimensions intact if the admin cannot decode the image.
      })

    return () => {
      isCurrent = false
    }
  }, [form, input.name, input.value])

  return <ImageField {...props} />
}
