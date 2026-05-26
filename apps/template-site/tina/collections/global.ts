import type { Collection } from 'tinacms'
import { ImageWithDimensionsField } from '@/components/tina/inputs/image-with-dimensions'
import { themeColorField } from '@/components/tina/fields/theme-color'

// Tina passes `form` to custom fields at runtime, but the schema component type
// used here does not expose that documented prop.
const imageWithDimensionsField = ImageWithDimensionsField as never

const Global: Collection = {
  label: 'Global',
  name: 'global',
  path: 'content/global',
  format: 'json',
  ui: {
    global: true,
  },
  fields: [
    {
      type: 'object',
      label: 'Site',
      name: 'site',
      fields: [
        {
          type: 'string',
          name: 'name',
          label: 'Business Name',
          required: true,
        },
        {
          type: 'string',
          name: 'url',
          label: 'Website URL',
          description: 'The public website URL, including https://.',
          required: true,
        },
        {
          type: 'string',
          name: 'description',
          label: 'Site Description',
          description:
            'A short default description used for search engines and social sharing when a page does not have its own SEO description.',
          ui: {
            component: 'textarea',
          },
        },
        {
          type: 'object',
          name: 'logo',
          label: 'Logo',
          fields: [
            {
              type: 'image',
              name: 'src',
              label: 'Image',
              description:
                'Optional. Upload a complete logo lockup. When blank, the header uses the business name as text.',
              uploadDir: () => 'brand',
              ui: {
                component: imageWithDimensionsField,
              },
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
    {
      type: 'object',
      label: 'Contact',
      name: 'contact',
      fields: [
        {
          type: 'object',
          name: 'phone',
          label: 'Phone',
          fields: [
            {
              type: 'string',
              name: 'country',
              label: 'Country',
              options: [
                {
                  label: 'United States',
                  value: 'US',
                },
                {
                  label: 'Canada',
                  value: 'CA',
                },
              ],
            },
            {
              type: 'string',
              name: 'number',
              label: 'Number',
            },
          ],
        },
        {
          type: 'string',
          name: 'email',
          label: 'Email',
        },
        {
          type: 'string',
          name: 'bookingUrl',
          label: 'Booking URL',
          description:
            'Optional. Used by global booking or estimate CTAs, such as the header action.',
        },
        {
          type: 'string',
          name: 'contactFormEmbedUrl',
          label: 'Contact Form Embed URL',
          description:
            'Optional. Used as the embedded contact form URL on the contact page.',
        },
        {
          type: 'object',
          name: 'socialLinks',
          label: 'Social Links',
          list: true,
          ui: {
            itemProps: (item) => ({
              label: item?.platform || 'Social link',
            }),
            defaultItem: {
              platform: 'instagram',
            },
          },
          fields: [
            {
              type: 'string',
              name: 'platform',
              label: 'Platform',
              required: true,
              options: [
                {
                  label: 'Instagram',
                  value: 'instagram',
                },
                {
                  label: 'Facebook',
                  value: 'facebook',
                },
                {
                  label: 'YouTube',
                  value: 'youtube',
                },
                {
                  label: 'X',
                  value: 'x',
                },
              ],
            },
            {
              type: 'string',
              name: 'url',
              label: 'Profile URL',
              required: true,
            },
          ],
        },
        {
          type: 'object',
          name: 'locations',
          label: 'Locations',
          list: true,
          ui: {
            itemProps: (item) => ({
              label: item?.name || item?.city || 'Location',
            }),
            defaultItem: {
              country: 'US',
            },
          },
          fields: [
            {
              type: 'string',
              name: 'name',
              label: 'Display Name',
              description:
                'The location name shown on the site, such as Downtown, West Side, or Newtown, Connecticut.',
              required: true,
            },
            {
              type: 'string',
              name: 'streetAddress',
              label: 'Street Address',
            },
            {
              type: 'string',
              name: 'addressLine2',
              label: 'Suite / Unit',
            },
            {
              type: 'string',
              name: 'city',
              label: 'City',
            },
            {
              type: 'string',
              name: 'region',
              label: 'State / Region',
            },
            {
              type: 'string',
              name: 'postalCode',
              label: 'Postal Code',
            },
            {
              type: 'string',
              name: 'country',
              label: 'Country',
              options: [
                {
                  label: 'United States',
                  value: 'US',
                },
                {
                  label: 'Canada',
                  value: 'CA',
                },
              ],
            },
            {
              type: 'string',
              name: 'hours',
              label: 'Hours',
              list: true,
            },
          ],
        },
      ],
    },
    {
      type: 'object',
      label: 'Theme',
      name: 'theme',
      fields: [
        themeColorField({
          name: 'primaryColor',
          label: 'Primary Color',
        }),
      ],
    },
    {
      type: 'object',
      label: 'Navigation',
      name: 'navigation',
      fields: [
        {
          type: 'object',
          label: 'Header',
          name: 'header',
          fields: [
            {
              type: 'object',
              name: 'links',
              label: 'Links',
              list: true,
              templates: [
                {
                  name: 'link',
                  label: 'Simple Link',
                  ui: {
                    itemProps: (item) => ({
                      label: item?.label || item?.href || 'Simple link',
                    }),
                    defaultItem: {
                      label: 'Link label',
                      href: '#',
                    },
                  },
                  fields: [
                    {
                      type: 'string',
                      name: 'label',
                      label: 'Label',
                      required: true,
                    },
                    {
                      type: 'string',
                      name: 'href',
                      label: 'Link',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'dropdown',
                  label: 'Dropdown',
                  ui: {
                    itemProps: (item) => ({
                      label: item?.label || 'Dropdown',
                    }),
                    defaultItem: {
                      label: 'Dropdown label',
                      items: [
                        {
                          label: 'Link label',
                          href: '#',
                        },
                      ],
                    },
                  },
                  fields: [
                    {
                      type: 'string',
                      name: 'label',
                      label: 'Label',
                      required: true,
                    },
                    {
                      type: 'object',
                      name: 'items',
                      label: 'Dropdown Items',
                      list: true,
                      ui: {
                        itemProps: (item) => ({
                          label: item?.label || item?.href || 'Dropdown item',
                        }),
                        defaultItem: {
                          label: 'Link label',
                          href: '#',
                        },
                      },
                      fields: [
                        {
                          type: 'string',
                          name: 'label',
                          label: 'Label',
                          required: true,
                        },
                        {
                          type: 'string',
                          name: 'href',
                          label: 'Link',
                          required: true,
                        },
                        {
                          type: 'string',
                          name: 'description',
                          label: 'Description',
                          ui: {
                            component: 'textarea',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'object',
              label: 'Actions',
              name: 'actions',
              fields: [
                {
                  type: 'object',
                  label: 'Secondary Action',
                  name: 'secondary',
                  fields: [
                    {
                      type: 'string',
                      name: 'label',
                      label: 'Label',
                      description:
                        'Optional. Leave blank with Link to use the global phone number.',
                    },
                    {
                      type: 'string',
                      name: 'href',
                      label: 'Link',
                      description:
                        'Optional. Leave blank with Label to use the global phone number.',
                    },
                  ],
                },
                {
                  type: 'object',
                  label: 'Primary Action',
                  name: 'primary',
                  fields: [
                    {
                      type: 'string',
                      name: 'label',
                      label: 'Label',
                      required: true,
                    },
                    {
                      type: 'string',
                      name: 'href',
                      label: 'Link',
                      description:
                        'Optional. Leave blank to use the global Booking URL.',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'object',
          label: 'Footer',
          name: 'footer',
          fields: [
            {
              type: 'object',
              name: 'groups',
              label: 'Groups',
              list: true,
              ui: {
                itemProps: (item) => ({
                  label: item?.title || 'Footer group',
                }),
                defaultItem: {
                  title: 'Footer group',
                  links: [
                    {
                      label: 'Link label',
                      href: '#',
                    },
                  ],
                },
              },
              fields: [
                {
                  type: 'string',
                  name: 'title',
                  label: 'Title',
                  required: true,
                },
                {
                  type: 'object',
                  name: 'links',
                  label: 'Links',
                  list: true,
                  ui: {
                    itemProps: (item) => ({
                      label: item?.label || item?.href || 'Footer link',
                    }),
                    defaultItem: {
                      label: 'Link label',
                      href: '#',
                    },
                  },
                  fields: [
                    {
                      type: 'string',
                      name: 'label',
                      label: 'Label',
                      required: true,
                    },
                    {
                      type: 'string',
                      name: 'href',
                      label: 'Link',
                      required: true,
                    },
                  ],
                },
              ],
            },
            {
              type: 'boolean',
              name: 'showSocialLinks',
              label: 'Show Social Links',
              description:
                'When enabled, the footer includes a Connect group from the global social links.',
            },
          ],
        },
      ],
    },
  ],
}

export default Global
