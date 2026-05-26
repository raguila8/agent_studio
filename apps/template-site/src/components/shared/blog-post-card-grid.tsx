import Image from 'next/image'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import { LightWallpaper } from '../elements/wallpaper'

export type BlogPostCardItem = {
  id: string
  title: string
  slug: string
  date: string | null
  heroImg: {
    src: string | null
    alt: string | null
    width?: number | null
    height?: number | null
  } | null
  categoryName: string | null
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

function getImageDimension(value: number | null | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

export function BlogPostCardGrid({ posts }: { posts: BlogPostCardItem[] }) {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6'>
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

export function BlogPostCard({ post }: { post: BlogPostCardItem }) {
  const href = `/blog/${post.slug}`
  const date =
    post.date && !Number.isNaN(new Date(post.date).getTime())
      ? dateFormatter.format(new Date(post.date))
      : ''
  const heroImageWidth = getImageDimension(post.heroImg?.width, 800)
  const heroImageHeight = getImageDimension(post.heroImg?.height, 500)

  return (
    <LightWallpaper color='custom' className='rounded-xl p-0 *:last:h-full'>
      <Link
        href={href}
        className='group flex h-full flex-col rounded-md bg-primary-100/45 p-2 text-olive-950 transition-colors hover:bg-primary-100/40'
      >
        {post.heroImg?.src ? (
          <div className='w-full overflow-hidden rounded-xl bg-white p-[1.5px] shadow-[0_0_0_1px_rgba(0,0,0,0.12),inset_0_0_0_4px_rgba(255,255,255,1),0_2px_4px_0_rgba(0,0,0,0.04)]'>
            <Image
              src={post.heroImg.src}
              alt={post.heroImg.alt || post.title}
              width={heroImageWidth}
              height={heroImageHeight}
              sizes='(min-width: 1280px) 373px, (min-width: 1024px) calc((100vw - 8rem) / 3), (min-width: 768px) calc((100vw - 6rem) / 2), (min-width: 672px) 288px, calc(100vw - 4rem)'
              className='aspect-16/10 h-auto w-full rounded-[11px] object-cover transition-transform duration-500 ease-out group-hover:scale-105'
            />
          </div>
        ) : (
          <div className='aspect-16/10 w-full rounded-xl bg-olive-100' />
        )}
        <div className='flex flex-1 flex-col px-3 pt-5 pb-4 sm:px-5 sm:pt-6'>
          <div className='flex flex-col gap-2.5'>
            {post.categoryName && (
              <p className='text-sm/6 font-[450] text-primary-600'>
                {post.categoryName}
              </p>
            )}
            <h3 className='text-[17px] font-medium tracking-tight text-olive-800'>
              {post.title}
            </h3>
          </div>
          <div className='mt-auto flex items-end justify-between gap-4 pt-6'>
            {date && <p className='text-sm/6 text-olive-700'>{date}</p>}
            <span className='inline-flex items-center gap-0.5 text-sm/6 font-medium text-olive-950 transition-colors duration-200 ease-out group-hover:text-primary-600'>
              Read
              <ChevronRightIcon className='size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5' />
            </span>
          </div>
        </div>
      </Link>
    </LightWallpaper>
  )
}
