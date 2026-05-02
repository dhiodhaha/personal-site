import { defineArrayMember, defineField } from 'sanity';

export const bodyBlocks = defineField({
  name: 'body',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (Rule) =>
                  Rule.uri({
                    scheme: ['http', 'https', 'mailto'],
                  }),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      name: 'imageBlock',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
      ],
    }),
    defineArrayMember({
      name: 'gallery',
      title: 'Gallery',
      type: 'object',
      fields: [
        defineField({
          name: 'images',
          title: 'Images',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alternative text',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'caption',
                  title: 'Caption',
                  type: 'string',
                }),
              ],
            }),
          ],
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
      preview: {
        select: {
          images: 'images',
        },
        prepare({ images }) {
          const count = Array.isArray(images) ? images.length : 0;

          return {
            title: 'Gallery',
            subtitle: `${count} image${count === 1 ? '' : 's'}`,
          };
        },
      },
    }),
    defineArrayMember({
      name: 'youtubeEmbed',
      title: 'YouTube embed',
      type: 'object',
      fields: [
        defineField({
          name: 'url',
          title: 'YouTube URL',
          type: 'url',
          validation: (Rule) =>
            Rule.required().uri({
              scheme: ['http', 'https'],
            }),
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
      ],
      preview: {
        select: {
          title: 'title',
          url: 'url',
        },
        prepare({ title, url }) {
          return {
            title: title || 'YouTube embed',
            subtitle: url,
          };
        },
      },
    }),
    defineArrayMember({
      name: 'callout',
      title: 'Callout',
      type: 'object',
      fields: [
        defineField({
          name: 'tone',
          title: 'Tone',
          type: 'string',
          options: {
            list: [
              { title: 'Note', value: 'note' },
              { title: 'Product', value: 'product' },
              { title: 'Warning', value: 'warning' },
            ],
          },
          initialValue: 'note',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'text',
          title: 'Text',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineArrayMember({
      name: 'codeBlock',
      title: 'Code block',
      type: 'object',
      fields: [
        defineField({
          name: 'filename',
          title: 'Filename',
          type: 'string',
        }),
        defineField({
          name: 'language',
          title: 'Language',
          type: 'string',
        }),
        defineField({
          name: 'code',
          title: 'Code',
          type: 'text',
          rows: 12,
          validation: (Rule) => Rule.required(),
        }),
      ],
      preview: {
        select: {
          filename: 'filename',
          language: 'language',
        },
        prepare({ filename, language }) {
          return {
            title: filename || 'Code block',
            subtitle: language,
          };
        },
      },
    }),
    defineArrayMember({
      name: 'workReference',
      title: 'Work reference',
      type: 'object',
      fields: [
        defineField({
          name: 'work',
          title: 'Work',
          type: 'reference',
          to: [{ type: 'work' }],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
        }),
      ],
      preview: {
        select: {
          title: 'work.title',
          subtitle: 'label',
        },
        prepare({ title, subtitle }) {
          return {
            title: title || 'Work reference',
            subtitle,
          };
        },
      },
    }),
  ],
  validation: (Rule) => Rule.required().min(1),
});
