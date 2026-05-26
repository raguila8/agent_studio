import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const categoryOrder = [
  'hero_intro',
  'content',
  'features_services',
  'process',
  'trust_proof',
  'testimonials',
  'faq',
  'cta',
  'contact',
  'resources',
  'utility',
]

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..')
const blocksDir = path.join(
  repoRoot,
  'apps/template-site/src/components/blocks'
)
const outputPath = path.join(repoRoot, 'docs/template-site-blocks.md')

function fail(message) {
  throw new Error(`[template-site block docs] ${message}`)
}

function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/')
}

function relativePath(filePath) {
  return toPosixPath(path.relative(repoRoot, filePath))
}

function findNextNonWhitespace(source, index) {
  let cursor = index
  while (cursor < source.length && /\s/.test(source[cursor])) cursor += 1
  return cursor
}

function skipQuoted(source, index, quote) {
  let cursor = index + 1
  while (cursor < source.length) {
    const char = source[cursor]
    if (char === '\\') {
      cursor += 2
      continue
    }
    if (char === quote) return cursor + 1
    cursor += 1
  }
  fail(`Unterminated ${quote} string literal.`)
}

function skipLineComment(source, index) {
  const end = source.indexOf('\n', index + 2)
  return end === -1 ? source.length : end + 1
}

function skipBlockComment(source, index) {
  const end = source.indexOf('*/', index + 2)
  if (end === -1) fail('Unterminated block comment.')
  return end + 2
}

function extractBalanced(source, openIndex, openChar, closeChar) {
  let cursor = openIndex
  let depth = 0

  while (cursor < source.length) {
    const char = source[cursor]
    const next = source[cursor + 1]

    if (char === '"' || char === "'" || char === '`') {
      cursor = skipQuoted(source, cursor, char)
      continue
    }

    if (char === '/' && next === '/') {
      cursor = skipLineComment(source, cursor)
      continue
    }

    if (char === '/' && next === '*') {
      cursor = skipBlockComment(source, cursor)
      continue
    }

    if (char === openChar) {
      depth += 1
    } else if (char === closeChar) {
      depth -= 1
      if (depth === 0) {
        return source.slice(openIndex, cursor + 1)
      }
    }

    cursor += 1
  }

  fail(`Could not find closing ${closeChar}.`)
}

function findExportedObjects(source, suffix, sourcePath) {
  const objects = new Map()
  const exportPattern = new RegExp(
    `export\\s+const\\s+([A-Za-z0-9_$]+${suffix})\\b`,
    'g'
  )

  let match
  while ((match = exportPattern.exec(source)) !== null) {
    const exportName = match[1]
    const equalsIndex = source.indexOf('=', exportPattern.lastIndex)
    if (equalsIndex === -1) {
      fail(`${sourcePath}: ${exportName} is missing an initializer.`)
    }

    const openIndex = findNextNonWhitespace(source, equalsIndex + 1)
    if (source[openIndex] !== '{') {
      fail(`${sourcePath}: ${exportName} must be initialized with an object.`)
    }

    objects.set(exportName, extractBalanced(source, openIndex, '{', '}'))
  }

  return objects
}

function splitTopLevel(input, separator = ',') {
  const parts = []
  let start = 0
  let cursor = 0
  let parenDepth = 0
  let braceDepth = 0
  let bracketDepth = 0

  while (cursor < input.length) {
    const char = input[cursor]
    const next = input[cursor + 1]

    if (char === '"' || char === "'" || char === '`') {
      cursor = skipQuoted(input, cursor, char)
      continue
    }

    if (char === '/' && next === '/') {
      cursor = skipLineComment(input, cursor)
      continue
    }

    if (char === '/' && next === '*') {
      cursor = skipBlockComment(input, cursor)
      continue
    }

    if (char === '(') parenDepth += 1
    if (char === ')') parenDepth -= 1
    if (char === '{') braceDepth += 1
    if (char === '}') braceDepth -= 1
    if (char === '[') bracketDepth += 1
    if (char === ']') bracketDepth -= 1

    if (
      char === separator &&
      parenDepth === 0 &&
      braceDepth === 0 &&
      bracketDepth === 0
    ) {
      parts.push(input.slice(start, cursor).trim())
      start = cursor + 1
    }

    cursor += 1
  }

  const finalPart = input.slice(start).trim()
  if (finalPart) parts.push(finalPart)
  return parts
}

function parseTopLevelProperties(objectText) {
  const inner = objectText.slice(1, -1)
  const properties = new Map()

  for (const part of splitTopLevel(inner)) {
    const match = part.match(/^['"]?([A-Za-z0-9_$-]+)['"]?\s*:/)
    if (!match) continue
    properties.set(match[1], part.slice(match[0].length).trim())
  }

  return properties
}

function readStringLiteral(value, context) {
  const trimmed = value.trim()
  const quote = trimmed[0]

  if (quote !== "'" && quote !== '"' && quote !== '`') {
    fail(`${context} must be a string literal.`)
  }

  let result = ''
  let cursor = 1

  while (cursor < trimmed.length) {
    const char = trimmed[cursor]

    if (char === '\\') {
      const escaped = trimmed[cursor + 1]
      if (escaped === undefined) fail(`${context} has an invalid escape.`)

      const escapeMap = {
        n: '\n',
        r: '\r',
        t: '\t',
        b: '\b',
        f: '\f',
        v: '\v',
        '0': '\0',
        '\\': '\\',
        "'": "'",
        '"': '"',
        '`': '`',
      }

      if (escaped === 'u' || escaped === 'x') {
        fail(`${context} uses an unsupported escape sequence.`)
      }

      result += escapeMap[escaped] ?? escaped
      cursor += 2
      continue
    }

    if (char === quote) return result
    if (quote === '`' && char === '$' && trimmed[cursor + 1] === '{') {
      fail(`${context} must not use template interpolation.`)
    }

    result += char
    cursor += 1
  }

  fail(`${context} has an unterminated string literal.`)
}

function readOptionalString(properties, key, context) {
  const value = properties.get(key)
  if (value === undefined) return undefined
  return readStringLiteral(value, `${context}.${key}`)
}

function readRequiredString(properties, key, context) {
  const value = readOptionalString(properties, key, context)
  if (!value) fail(`${context}.${key} is required.`)
  return value
}

function readStringArray(value, context) {
  const trimmed = value.trim()
  if (!trimmed.startsWith('[')) {
    fail(`${context} must be an array of string literals.`)
  }

  const arrayText = extractBalanced(trimmed, 0, '[', ']')
  const inner = arrayText.slice(1, -1).trim()
  if (!inner) return []

  return splitTopLevel(inner).map((item, index) =>
    readStringLiteral(item, `${context}[${index}]`)
  )
}

function parseDoc(exportName, objectText, sourcePath) {
  const context = `${sourcePath}: ${exportName}`
  const properties = parseTopLevelProperties(objectText)
  const category = readRequiredString(properties, 'category', context)
  const description = readRequiredString(properties, 'description', context)
  const contentNotesValue = properties.get('contentNotes')

  if (!categoryOrder.includes(category)) {
    fail(`${context}.category uses unknown category "${category}".`)
  }

  return {
    category,
    description,
    contentNotes: contentNotesValue
      ? readStringArray(contentNotesValue, `${context}.contentNotes`)
      : [],
  }
}

function parseSchema(exportName, objectText, sourcePath) {
  const context = `${sourcePath}: ${exportName}`
  const properties = parseTopLevelProperties(objectText)
  const uiValue = properties.get('ui')
  let previewSrc

  if (uiValue) {
    const uiObjectStart = findNextNonWhitespace(uiValue, 0)
    if (uiValue[uiObjectStart] !== '{') {
      fail(`${context}.ui must be an object when present.`)
    }
    const uiProperties = parseTopLevelProperties(
      extractBalanced(uiValue, uiObjectStart, '{', '}')
    )
    previewSrc = readOptionalString(uiProperties, 'previewSrc', `${context}.ui`)
  }

  return {
    name: readRequiredString(properties, 'name', context),
    label: readRequiredString(properties, 'label', context),
    previewSrc,
  }
}

function escapeMarkdownText(value) {
  return value.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function renderMarkdown(blocks) {
  const lines = [
    '<!-- Generated by pnpm docs:blocks. Do not edit by hand. -->',
    '',
    '# Template Site Blocks',
    '',
    'Block docs are generated from `apps/template-site/src/components/blocks/*BlockDoc` exports and their matching `*BlockSchema` exports.',
    '',
    '## Category Order',
    '',
    ...categoryOrder.map((category, index) => `${index + 1}. \`${category}\``),
    '',
    '## Blocks',
  ]

  for (const category of categoryOrder) {
    const categoryBlocks = blocks.filter((block) => block.category === category)
    lines.push('', `### \`${category}\``)

    if (categoryBlocks.length === 0) {
      lines.push('', '_No blocks in this category._')
      continue
    }

    for (const block of categoryBlocks) {
      lines.push(
        '',
        `#### ${escapeMarkdownText(block.label)}`,
        '',
        `- Category: \`${block.category}\``,
        `- Source: \`${block.sourcePath}\``,
        `- Schema export: \`${block.schemaExportName}\``,
        `- Doc export: \`${block.docExportName}\``,
        `- Schema name: \`${block.schemaName}\``,
        `- Preview image: ${
          block.previewSrc ? `\`${block.previewSrc}\`` : 'Not configured'
        }`,
        '',
        escapeMarkdownText(block.description)
      )

      if (block.contentNotes.length > 0) {
        lines.push('', 'Content notes:')
        for (const note of block.contentNotes) {
          lines.push(`- ${escapeMarkdownText(note)}`)
        }
      }
    }
  }

  lines.push('')
  return lines.join('\n')
}

function readBlocks() {
  const fileNames = fs
    .readdirSync(blocksDir)
    .filter((fileName) => fileName.endsWith('.tsx') && fileName !== 'index.tsx')
    .sort()

  const blocks = []
  const unmatchedSchemas = new Map()

  for (const fileName of fileNames) {
    const filePath = path.join(blocksDir, fileName)
    const sourcePath = relativePath(filePath)
    const source = fs.readFileSync(filePath, 'utf8')
    const docs = findExportedObjects(source, 'BlockDoc', sourcePath)
    const schemas = findExportedObjects(source, 'BlockSchema', sourcePath)

    for (const schemaName of schemas.keys()) {
      unmatchedSchemas.set(schemaName, sourcePath)
    }

    if (docs.size === 0 && schemas.size === 0) continue

    if (docs.size === 0) {
      fail(`${sourcePath}: found block schema export but no BlockDoc export.`)
    }

    if (schemas.size === 0) {
      fail(`${sourcePath}: found BlockDoc export but no block schema export.`)
    }

    for (const [docExportName, docObject] of docs) {
      const prefix = docExportName.replace(/BlockDoc$/, '')
      const schemaExportName = `${prefix}BlockSchema`
      const schemaObject = schemas.get(schemaExportName)

      if (!schemaObject) {
        fail(
          `${sourcePath}: ${docExportName} does not have matching ${schemaExportName}.`
        )
      }

      unmatchedSchemas.delete(schemaExportName)

      const doc = parseDoc(docExportName, docObject, sourcePath)
      const schema = parseSchema(schemaExportName, schemaObject, sourcePath)

      blocks.push({
        sourcePath,
        docExportName,
        schemaExportName,
        schemaName: schema.name,
        label: schema.label,
        previewSrc: schema.previewSrc,
        ...doc,
      })
    }
  }

  if (unmatchedSchemas.size > 0) {
    const [schemaName, sourcePath] = unmatchedSchemas.entries().next().value
    const expectedDocName = schemaName.replace(/BlockSchema$/, 'BlockDoc')
    fail(`${sourcePath}: ${schemaName} does not have matching ${expectedDocName}.`)
  }

  return blocks.sort((a, b) => {
    const categoryDelta =
      categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
    if (categoryDelta !== 0) return categoryDelta
    return (
      a.label.localeCompare(b.label) || a.sourcePath.localeCompare(b.sourcePath)
    )
  })
}

const blocks = readBlocks()
const markdown = renderMarkdown(blocks)
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, markdown)
console.log(`Generated ${relativePath(outputPath)} with ${blocks.length} blocks.`)
