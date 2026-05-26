import Image from 'next/image'
import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

const html = String.raw

const noisePattern = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  html`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="250"
      height="250"
      viewBox="0 0 100 100"
    >
      <filter id="n">
        <feTurbulence
          type="turbulence"
          baseFrequency="1.4"
          numOctaves="1"
          seed="2"
          stitchTiles="stitch"
          result="n"
        />
        <feComponentTransfer result="g">
          <feFuncR type="linear" slope="4" intercept="1" />
          <feFuncG type="linear" slope="4" intercept="1" />
          <feFuncB type="linear" slope="4" intercept="1" />
        </feComponentTransfer>
        <feColorMatrix type="saturate" values="0" in="g" />
      </filter>
      <rect width="100%" height="100%" filter="url(#n)" />
    </svg>
  `.replace(/\s+/g, ' ')
)}")`

type WallpaperProps = {
  color:
    | 'green'
    | 'blue'
    | 'purple'
    | 'brown'
    | 'earth'
    | 'primary'
    | 'custom'
    | 'dark'
  overlayImage?: ComponentProps<typeof Image>['src']
} & ComponentProps<'div'>

export function Wallpaper({
  children,
  color,
  className,
  overlayImage,
  ...props
}: WallpaperProps) {
  return (
    <div
      data-color={color}
      className={clsx(
        'relative overflow-hidden bg-linear-to-b data-[color=blue]:from-[#637c86] data-[color=blue]:to-[#778599]/90 data-[color=brown]:from-[#8d7359]/80 data-[color=brown]:to-[#765959]/80 data-[color=dark]:from-[#67787c] data-[color=dark]:to-[#394447] data-[color=green]:from-[#9ca88f] data-[color=green]:to-[#596352] data-[color=primary]:from-primary-500/60 data-[color=primary]:to-primary-600/72 data-[color=purple]:from-[#8f6976]/70 data-[color=purple]:to-purple-500/80',
        className
      )}
      {...props}
    >
      <div
        className='absolute inset-0 opacity-40 mix-blend-overlay'
        style={{
          backgroundPosition: 'center',
          backgroundImage: noisePattern,
        }}
      />
      {overlayImage ? (
        <Image
          src={overlayImage}
          alt=''
          aria-hidden='true'
          fill
          {...(typeof overlayImage !== 'string' ? { placeholder: 'blur' } : {})}
          sizes='100vw'
          className='pointer-events-none absolute inset-0 object-cover opacity-25'
        />
      ) : null}
      <div className='relative'>{children}</div>
    </div>
  )
}

export function LightWallpaper({
  children,
  color,
  className,
  overlayImage,
  ...props
}: WallpaperProps) {
  return (
    <div
      data-color={color}
      className={clsx(
        'relative overflow-hidden bg-linear-to-tr data-[color=blue]:from-slate-200/50 data-[color=blue]:to-slate-200/65 data-[color=brown]:from-taupe-200/65 data-[color=brown]:to-taupe-200/98 data-[color=custom]:from-[#e8e8e3]/95 data-[color=custom]:to-mist-200/70 data-[color=earth]:from-taupe-200/80 data-[color=earth]:to-taupe-200 data-[color=green]:from-green-200 data-[color=green]:to-green-300/45 data-[color=primary]:from-primary-100/70 data-[color=primary]:to-primary-200/50 data-[color=purple]:from-mauve-200/65 data-[color=purple]:to-mauve-200/90',
        className
      )}
      {...props}
    >
      <div
        className='absolute inset-0 opacity-80 mix-blend-overlay'
        style={{
          backgroundPosition: 'center',
          backgroundImage: noisePattern,
        }}
      />
      {overlayImage ? (
        <Image
          src={overlayImage}
          alt=''
          aria-hidden='true'
          fill
          {...(typeof overlayImage !== 'string' ? { placeholder: 'blur' } : {})}
          sizes='100vw'
          className='pointer-events-none absolute inset-0 object-cover opacity-70'
        />
      ) : null}
      <div className='relative h-full'>{children}</div>
    </div>
  )
}
