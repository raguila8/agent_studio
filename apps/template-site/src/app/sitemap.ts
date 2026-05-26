import type { MetadataRoute } from 'next'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]['changeFrequency']
>

type SitemapEntry = MetadataRoute.Sitemap[number]

const contentRoot = path.join(process.cwd(), 'content')

const routeGroups = [
  {
    directory: 'pages',
    prefix: '',
    changeFrequency: 'monthly',
    priority: 0.8,
    mapSlug: (slug: string) => {
      if (slug === 'landing' || slug === 'home') return null
      return `/${slug}`
    },
  },
  {
    directory: 'blog',
    prefix: '/blog',
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    directory: 'legal',
    prefix: '/legal',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
] satisfies Array<{
  directory: string
  prefix: string
  changeFrequency: ChangeFrequency
  priority: number
  mapSlug?: (slug: string) => string | null
}>

function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, '')
}

function getBaseUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL

  if (configuredUrl) {
    return normalizeBaseUrl(
      configuredUrl.startsWith('http')
        ? configuredUrl
        : `https://${configuredUrl}`
    )
  }

  return 'https://wholehealthyfamily.info'
}

function getMdxFiles(directory: string) {
  const directoryPath = path.join(contentRoot, directory)
  const files: Array<{ filePath: string; slug: string }> = []

  function walk(currentPath: string) {
    for (const entry of readdirSync(currentPath, { withFileTypes: true })) {
      const entryPath = path.join(currentPath, entry.name)

      if (entry.isDirectory()) {
        walk(entryPath)
        continue
      }

      if (!entry.name.endsWith('.mdx')) continue

      const relativePath = path.relative(directoryPath, entryPath)
      const slug = relativePath
        .replace(/\.mdx$/, '')
        .split(path.sep)
        .join('/')
      files.push({ filePath: entryPath, slug })
    }
  }

  walk(directoryPath)

  return files
}

function getLastModified(filePath: string) {
  const file = readFileSync(filePath, 'utf8')
  const dateMatch = file.match(/^date:\s*['"]?([^'"\n]+)['"]?/m)

  if (dateMatch?.[1]) {
    const frontmatterDate = new Date(dateMatch[1])

    if (!Number.isNaN(frontmatterDate.getTime())) {
      return frontmatterDate
    }
  }

  return statSync(filePath).mtime
}

function createUrl(baseUrl: string, pathname: string) {
  return `${baseUrl}${pathname === '/' ? '' : pathname}`
}

function getLatestModifiedDate(files: Array<{ filePath: string }>) {
  return files
    .map((file) => getLastModified(file.filePath))
    .sort((dateA, dateB) => dateB.getTime() - dateA.getTime())[0]
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()
  const entries = new Map<string, SitemapEntry>()

  entries.set('/', {
    url: createUrl(baseUrl, '/'),
    lastModified: getLastModified(path.join(contentRoot, 'pages/landing.mdx')),
    changeFrequency: 'weekly',
    priority: 1,
  })

  entries.set('/blog', {
    url: createUrl(baseUrl, '/blog'),
    lastModified: getLatestModifiedDate(getMdxFiles('blog')),
    changeFrequency: 'weekly',
    priority: 0.8,
  })

  for (const group of routeGroups) {
    for (const file of getMdxFiles(group.directory)) {
      const pathname = group.mapSlug
        ? group.mapSlug(file.slug)
        : `${group.prefix}/${file.slug}`

      if (!pathname) continue

      entries.set(pathname, {
        url: createUrl(baseUrl, pathname),
        lastModified: getLastModified(file.filePath),
        changeFrequency: group.changeFrequency,
        priority: pathname === '/' ? 1 : group.priority,
      })
    }
  }

  return Array.from(entries.entries())
    .sort(([pathnameA], [pathnameB]) => pathnameA.localeCompare(pathnameB))
    .map(([, entry]) => entry)
}
