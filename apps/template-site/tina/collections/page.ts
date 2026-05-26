import type { Collection } from 'tinacms'
import { ImageWithDimensionsField } from '@/components/tina/inputs/image-with-dimensions'
import { blocksField } from './shared/blocks'

// Tina passes `form` to custom fields at runtime, but the schema component type
// used here does not expose that documented prop.
const imageWithDimensionsField = ImageWithDimensionsField as never

const Page: Collection = {
  label: 'Pages',
  name: 'page',
  path: 'content/pages',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      const filepath = document._sys.breadcrumbs.join('/')
      if (filepath === 'home') {
        return '/'
      }
      return `/${filepath}`
    },
  },
  fields: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
    },
    blocksField,
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
        {
          type: 'object',
          name: 'image',
          label: 'Social Share Image',
          fields: [
            {
              type: 'image',
              name: 'src',
              label: 'Image',
              uploadDir: () => 'pages',
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
      ],
    },
  ],
}

export default Page
