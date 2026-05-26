import type { Collection } from 'tinacms'

const LegalPage: Collection = {
  label: 'Legal Pages',
  name: 'legalPage',
  path: 'content/legal',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      return `/legal/${document._sys.breadcrumbs.join('/')}`
    },
  },
  fields: [
    {
      type: 'string',
      name: 'heading',
      label: 'Heading',
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
      type: 'string',
      name: 'subheading',
      label: 'Subheading',
      ui: {
        component: 'textarea',
      },
    },
    {
      type: 'rich-text',
      name: '_body',
      label: 'Content',
      isBody: true,
    },
  ],
}

export default LegalPage
