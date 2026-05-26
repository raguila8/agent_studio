import Image from 'next/image'

import type { Collection } from 'tinacms'
import {
  callToActionSimpleDefaultItem,
  callToActionSimpleFields,
} from '@/components/blocks/call-to-action-simple'
import { ImageWithDimensionsField } from '@/components/tina/inputs/image-with-dimensions'

// Tina passes `form` to custom fields at runtime, but the schema component type
// used here does not expose that documented prop.
const imageWithDimensionsField = ImageWithDimensionsField as never
type CollectionField = NonNullable<Collection['fields']>[number]

const Blog: Collection = {
  label: 'Blog Posts',
  name: 'blog_post',
  path: 'content/blog',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      return `/blog/${document._sys.breadcrumbs.join('/')}`
    },
  },
  fields: [
    {
      type: 'string',
      label: 'Title',
      name: 'title',
      isTitle: true,
      required: true,
    },
    {
      type: 'object',
      name: 'seo',
      label: 'SEO',
      fields: [
        {
          type: 'string',
          name: 'title',
          label: 'Meta Title',
        },
        {
          type: 'string',
          name: 'description',
          label: 'Meta Description',
          ui: {
            component: 'textarea',
          },
        },
      ],
    },
    {
      type: 'object',
      name: 'heroImg',
      label: 'Hero Image',
      fields: [
        {
          type: 'image',
          name: 'src',
          label: 'Image',
          uploadDir: () => 'blog',
          ui: {
            component: imageWithDimensionsField,
          },
        },
        {
          type: 'string',
          name: 'alt',
          label: 'Alt Text',
        },
        {
          name: 'width',
          label: 'Image Width',
          type: 'number',
          ui: {
            component: 'hidden',
          },
        },
        {
          name: 'height',
          label: 'Image Height',
          type: 'number',
          ui: {
            component: 'hidden',
          },
        },
      ],
    },
    {
      type: 'rich-text',
      label: 'Excerpt',
      name: 'excerpt',
      overrides: {
        toolbar: ['bold', 'italic', 'link'],
      },
    },
    {
      type: 'reference',
      label: 'Author',
      name: 'author',
      collections: ['author'],
      ui: {
        optionComponent: (
          props: {
            name?: string
            avatar?: string
          },
          _internalSys: { path: string }
        ) => {
          const { name, avatar } = props
          if (!name) return _internalSys.path

          return (
            <div className='flex min-h-8 items-center gap-4'>
              {avatar && (
                <div className='flex size-12 overflow-hidden rounded-full outline -outline-offset-1 outline-black/5 *:size-full *:object-cover'>
                  <Image
                    src={avatar}
                    alt={name}
                    width={160}
                    height={160}
                    className='bg-white/75'
                  />
                </div>
              )}
              <p className='font-semibold'>
                {name
                  .split(' ')
                  .map((part) => part[0]?.toUpperCase() || '')
                  .join('')}
              </p>
            </div>
          )
        },
      },
    } as unknown as CollectionField,
    {
      type: 'datetime',
      label: 'Posted Date',
      name: 'date',
      ui: {
        dateFormat: 'MMMM DD YYYY',
        timeFormat: 'hh:mm A',
      },
    },
    {
      type: 'reference',
      label: 'Category',
      name: 'category',
      collections: ['category'],
      required: true,
      ui: {
        optionComponent: (
          props: {
            name?: string
          },
          _internalSys: { path: string }
        ) => props.name || _internalSys.path,
      },
    } as unknown as CollectionField,
    {
      type: 'rich-text',
      label: 'Body',
      name: '_body',
      templates: [
        {
          name: 'BlockQuote',
          label: 'Block Quote',
          fields: [
            {
              name: 'children',
              label: 'Quote',
              type: 'rich-text',
              overrides: {
                toolbar: ['bold', 'italic', 'link'],
              },
            },
            {
              name: 'authorName',
              label: 'Author',
              type: 'string',
            },
          ],
        },
        {
          name: 'DateTime',
          label: 'Date & Time',
          inline: true,
          fields: [
            {
              name: 'format',
              label: 'Format',
              type: 'string',
              options: ['utc', 'iso', 'local'],
            },
          ],
        },
        {
          name: 'NewsletterSignup',
          label: 'Newsletter Sign Up',
          fields: [
            {
              name: 'children',
              label: 'CTA',
              type: 'rich-text',
            },
            {
              name: 'placeholder',
              label: 'Placeholder',
              type: 'string',
            },
            {
              name: 'buttonText',
              label: 'Button Text',
              type: 'string',
            },
            {
              name: 'disclaimer',
              label: 'Disclaimer',
              type: 'rich-text',
              overrides: {
                toolbar: ['bold', 'italic', 'link'],
              },
            },
          ],
          ui: {
            defaultItem: {
              placeholder: 'Enter your email',
              buttonText: 'Notify Me',
            },
          },
        },
      ],
      isBody: true,
    },
    {
      type: 'object',
      name: 'cta',
      label: 'Bottom CTA',
      description: 'Call to action shown beneath the blog post content.',
      ui: {
        defaultItem: callToActionSimpleDefaultItem,
      },
      fields: callToActionSimpleFields,
    },
    {
      type: 'boolean',
      name: 'showSectionDividerBeforeCta',
      label: 'Show Section Divider Before CTA',
    },
  ],
}

export default Blog
