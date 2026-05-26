"use client"

import type { HTMLAttributes, SVGProps } from "react"
import { useId } from "react"
import { cn } from "@/lib/utils"

export const getStarProgress = (
  starPosition: number,
  rating: number,
  maxRating: number = 5
) => {
  // Ensure rating is between 0 and 5
  const clampedRating = Math.min(Math.max(rating, 0), maxRating)

  const diff = clampedRating - starPosition

  if (diff >= 1) return 100
  if (diff <= 0) return 0

  return Math.round(diff * 100)
}

interface StarIconProps extends SVGProps<SVGSVGElement> {
  /**
   * The progress of the star icon. It should be a number between 0 and 100.
   *
   * @default 100
   */
  progress?: number
}

export const StarIcon = ({
  progress = 100,
  className,
  ...props
}: StarIconProps) => {
  const id = useId()

  const starPath =
    "M13.4814 16.29C13.3623 16.29 13.2421 16.2617 13.1328 16.2041L8.99998 14.0322L4.86718 16.2041C4.61428 16.3364 4.30757 16.314 4.07717 16.147C3.84667 15.979 3.73148 15.6944 3.77928 15.4131L4.56928 10.8125L1.22648 7.55419C1.02238 7.35499 0.948182 7.05659 1.03698 6.78519C1.12488 6.51369 1.35928 6.31599 1.64248 6.27489L6.26158 5.60349L8.32697 1.41799C8.58087 0.906285 9.41878 0.906285 9.67268 1.41799L11.7381 5.60349L16.3572 6.27489C16.6404 6.31589 16.8748 6.51369 16.9627 6.78519C17.0516 7.05669 16.9773 7.35499 16.7732 7.55419L13.4304 10.8125L14.2204 15.4131C14.2683 15.6943 14.153 15.979 13.9225 16.147C13.7916 16.2417 13.6367 16.29 13.4814 16.29Z"

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      {...props}
      className={cn("size-[15px] text-olive-500", className)}
    >
      <title>star-filled</title>
      <path d={starPath} fill="currentColor" fillOpacity="0.4" />
      <g clipPath={`url(#clip-${id})`}>
        <path d={starPath} fill="currentColor" />
      </g>
      <defs>
        <clipPath id={`clip-${id}`}>
          <rect width={`${progress}%`} height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

interface RatingStarsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The rating to display.
   *
   * @default 5
   */
  rating?: number
  /**
   * The number of stars to display.
   */
  stars?: number
  /**
   * The class name of the star icon.
   */
  starClassName?: string
}

export const RatingStars = ({
  rating = 5,
  stars = 5,
  starClassName,
  ...props
}: RatingStarsProps) => {
  return (
    <div {...props} className={cn("flex gap-0.25", props.className)}>
      {Array.from({ length: stars }).map((_, index) => (
        <StarIcon
          key={index}
          progress={getStarProgress(index, rating, stars)}
          className={starClassName}
        />
      ))}
    </div>
  )
}
