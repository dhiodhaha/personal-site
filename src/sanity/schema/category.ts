import { defineField, defineType } from 'sanity';

const launchCategories = [
  { title: 'Build Logs', value: 'build-logs' },
  { title: 'Product Notes', value: 'product-notes' },
  { title: 'Creative Process', value: 'creative-process' },
  { title: 'Personal Lessons', value: 'personal-lessons' },
];

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      options: {
        list: launchCategories,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
  },
});
