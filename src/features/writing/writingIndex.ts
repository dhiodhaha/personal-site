import type { PublishedPost } from '../../sanity/published';

export type WritingCardItem = {
  eyebrow: string;
  href: string;
  mark: string;
  summary: string;
  tags: string[];
  title: string;
  tone: string;
};

const fallbackPosts: WritingCardItem[] = [
  {
    title: 'Why I am rebuilding my site around product building',
    eyebrow: 'Product Notes',
    summary: 'A positioning note on making selected product work easier to judge in the first ten seconds.',
    tags: ['Planned'],
    href: '/writing/why-i-am-rebuilding-my-site-around-product-building',
    tone: 'var(--color-muted-taupe)',
    mark: '01',
  },
  {
    title: 'What video work taught me about product building',
    eyebrow: 'Creative Process',
    summary: 'How narrative, pacing, and visual judgment from media work transfer into product design.',
    tags: ['Planned'],
    href: '/writing/what-video-work-taught-me-about-product-building',
    tone: 'var(--color-frost-gray)',
    mark: '02',
  },
  {
    title: 'How I use AI as a build partner',
    eyebrow: 'Build Logs',
    summary: 'A practical look at AI-assisted implementation without outsourcing product judgment.',
    tags: ['Draft idea'],
    href: '/writing',
    tone: 'var(--color-sunshine-yellow)',
    mark: '03',
  },
];

export function createWritingCards(posts: PublishedPost[]): WritingCardItem[] {
  if (posts.length === 0) {
    return fallbackPosts;
  }

  return posts.map((post, index) => ({
    title: post.title,
    eyebrow: post.category.title,
    summary: post.excerpt,
    tags: [new Date(post.publishedAt).getFullYear().toString()],
    href: `/writing/${post.slug}`,
    tone: index % 2 === 0 ? 'var(--color-muted-taupe)' : 'var(--color-frost-gray)',
    mark: (index + 1).toString().padStart(2, '0'),
  }));
}

export function splitWritingMasonryColumns(items: WritingCardItem[]): WritingCardItem[][] {
  return [
    items.filter((_, index) => index % 2 === 0),
    items.filter((_, index) => index % 2 === 1),
  ];
}
