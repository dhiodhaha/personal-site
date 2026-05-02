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
  ],
  validation: (Rule) => Rule.required().min(1),
});
