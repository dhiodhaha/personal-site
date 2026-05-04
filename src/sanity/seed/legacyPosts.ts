import { createClient } from '@sanity/client';

type PortableBlock = {
  _key: string;
  _type: 'block';
  children: Array<{
    _key: string;
    _type: 'span';
    marks: string[];
    text: string;
  }>;
  markDefs: unknown[];
  style: 'blockquote' | 'h2' | 'h3' | 'normal';
};

type YoutubeEmbed = {
  _key: string;
  _type: 'youtubeEmbed';
  title: string;
  url: string;
};

type Callout = {
  _key: string;
  _type: 'callout';
  text: string;
  title: string;
  tone: 'note' | 'product';
};

type BodyBlock = Callout | PortableBlock | YoutubeEmbed;

type SeedCategory = {
  description: string;
  id: string;
  slug: string;
  title: string;
};

type SeedPost = {
  body: BodyBlock[];
  categoryId: string;
  excerpt: string;
  featured?: boolean;
  publishedAt: string;
  slug: string;
  title: string;
};

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';
const apiVersion = process.env.SANITY_API_VERSION ?? '2025-02-19';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID.');
}

if (!token) {
  throw new Error('Missing SANITY_WRITE_TOKEN. Create a Sanity token with Editor write access before seeding.');
}

const client = createClient({
  apiVersion,
  dataset,
  projectId,
  token,
  useCdn: false,
});

const categories: SeedCategory[] = [
  {
    id: 'category-build-logs',
    title: 'Build Logs',
    slug: 'build-logs',
    description: 'Notes from building, rebuilding, and shipping product surfaces.',
  },
  {
    id: 'category-product-notes',
    title: 'Product Notes',
    slug: 'product-notes',
    description: 'Product thinking, workflow decisions, and interface observations.',
  },
  {
    id: 'category-creative-process',
    title: 'Creative Process',
    slug: 'creative-process',
    description: 'How creative work shapes taste, pacing, systems, and execution.',
  },
  {
    id: 'category-personal-lessons',
    title: 'Personal Lessons',
    slug: 'personal-lessons',
    description: 'Personal notes that still connect back to professional positioning.',
  },
];

let keyCounter = 0;

function key(prefix: string): string {
  keyCounter += 1;
  return `${prefix}-${keyCounter.toString(36)}`;
}

function block(text: string, style: PortableBlock['style'] = 'normal'): PortableBlock {
  return {
    _key: key('block'),
    _type: 'block',
    children: [
      {
        _key: key('span'),
        _type: 'span',
        marks: [],
        text,
      },
    ],
    markDefs: [],
    style,
  };
}

function youtube(videoId: string, title: string): YoutubeEmbed {
  return {
    _key: key('youtube'),
    _type: 'youtubeEmbed',
    title,
    url: `https://www.youtube.com/watch?v=${videoId}`,
  };
}

function callout(title: string, text: string, tone: Callout['tone'] = 'product'): Callout {
  return {
    _key: key('callout'),
    _type: 'callout',
    text,
    title,
    tone,
  };
}

const posts: SeedPost[] = [
  {
    title: 'What Video Work Taught Me About Product Building',
    slug: 'what-video-work-taught-me-about-product-building',
    excerpt:
      'Old video work was not separate from product building. It trained the same muscles: audience framing, sequencing, clarity, and taste under constraint.',
    categoryId: 'category-creative-process',
    publishedAt: '2026-05-04T00:00:00.000Z',
    featured: true,
    body: [
      block('What video work taught me about product building', 'h2'),
      block(
        'For a long time, I treated video, social content, and product building as separate buckets. Looking back at video.dhaf.in and the older portfolio, the better read is simpler: the work trained product muscles before I had the language for them.',
      ),
      block(
        'Editing a campaign or documentary is mostly decision-making. What does the audience need first? What context is missing? Which detail creates trust? Where does the pacing drop? Those are the same questions I now ask when shaping product flows.',
      ),
      callout(
        'Product-builder framing',
        'The useful part of the old creative work is not that it makes me look generalist. It proves I can turn unclear material into a sequence people can understand.',
      ),
      block('The lesson is sequencing', 'h3'),
      block(
        'A good product screen and a good video both need hierarchy. The viewer should never work too hard to know what matters. In video, that comes from cuts, captions, motion, and timing. In product, it comes from layout, state, copy, and interaction.',
      ),
      block('The portfolio should not become a museum of old output. It should show how the older work explains the current product-builder direction.'),
    ],
  },
  {
    title: 'Designing Content Like Onboarding',
    slug: 'designing-content-like-onboarding',
    excerpt:
      'Campaign work for Meena Studio, Muhammadiyah, and PAUD helped me understand that communication design is often onboarding design.',
    categoryId: 'category-product-notes',
    publishedAt: '2026-05-04T00:10:00.000Z',
    featured: true,
    body: [
      block('Designing content like onboarding', 'h2'),
      block(
        'The Meena Studio, Muktamar, and PAUD projects were content projects on the surface. Underneath, each one had the same problem as onboarding: the audience arrives cold, distracted, and unsure why they should care.',
      ),
      block(
        'For Meena Studio, the problem was making faith-based content feel relevant to teens without sounding preachy. For Muktamar, the problem was making a large organization understandable to people outside the circle. For PAUD, the problem was making government communication feel less stiff and more usable.',
      ),
      callout(
        'The product lesson',
        'If someone is unfamiliar with the product, the first job is not to impress them. The first job is to make the next step feel obvious.',
      ),
      youtube('abX_1-YdLz8', 'Meena Studio video example'),
      youtube('bzcq1SzeIsc', 'Muhammadiyah Muktamar campaign example'),
      block(
        'That is why this old work belongs in writing, not primary Work. It supports the taste and communication side of the product-builder story without competing with product proof.',
      ),
    ],
  },
  {
    title: 'What Documentary Editing Taught Me About UX',
    slug: 'what-documentary-editing-taught-me-about-ux',
    excerpt:
      'Documentary editing sharpened my instinct for empathy, context, and reducing friction in how people understand complex situations.',
    categoryId: 'category-creative-process',
    publishedAt: '2026-05-04T00:20:00.000Z',
    body: [
      block('What documentary editing taught me about UX', 'h2'),
      block(
        'The tuberculosis recovery documentaries were not product work, but they taught me one important UX habit: respect the audience and the subject at the same time.',
      ),
      block(
        'Health stories have many ways to go wrong. Too much explanation becomes flat. Too much emotion becomes manipulative. Too little context makes the story hard to trust. The edit has to create a path through all of that.',
      ),
      youtube('bsY3AWQnG44', 'Tuberculosis recovery progress documentary'),
      youtube('o4Vzmuc5en4', 'Economy empowerment for tuberculosis patients'),
      youtube('6GCHmO_eUK4', 'Faith-based tuberculosis recovery plan documentary'),
      block(
        'That maps directly to product work. When a workflow is sensitive, people need context, clear states, and careful language. The interface should not rush them, confuse them, or make them feel stupid.',
      ),
      callout(
        'UX lesson',
        'Empathy is not softness. It is the discipline of giving people the right amount of context at the right moment.',
      ),
    ],
  },
  {
    title: 'Why I Am Rebuilding My Site Around Product Building',
    slug: 'why-i-am-rebuilding-my-site-around-product-building',
    excerpt:
      'The old portfolio proved range, but the new site needs to make one thing easier to remember: I build product-shaped ideas into usable web experiences.',
    categoryId: 'category-build-logs',
    publishedAt: '2026-05-04T00:30:00.000Z',
    featured: true,
    body: [
      block('Why I am rebuilding my site around product building', 'h2'),
      block(
        'The older portfolio said a lot: content creation, social media, video editing, photography, visual design, web development, and strategy. It was honest, but it made the story too wide.',
      ),
      block(
        'The current site has a different job. It should make one thing easier to remember: I am a product builder with creative range. The range still matters, but it supports the product story instead of becoming the whole story.',
      ),
      block(
        'That is why old video and social projects move into Playground/Writing. They explain taste, pacing, audience thinking, and storytelling. The Work section stays focused on product proof.',
      ),
      callout(
        'Positioning rule',
        'The site should feel coherent before it feels comprehensive.',
      ),
      block(
        'This rebuild is less about hiding the old work and more about sorting it correctly. Product work proves where I am going. Creative work explains why the product work has taste.',
      ),
    ],
  },
  {
    title: 'Keeping Visual Range Without Becoming Scattered',
    slug: 'keeping-visual-range-without-becoming-scattered',
    excerpt:
      'Dribbble shots and Unnamed+ Studio projects show design range, but the site should use them as proof of taste and direction rather than another scattered portfolio bucket.',
    categoryId: 'category-personal-lessons',
    publishedAt: '2026-05-04T00:40:00.000Z',
    body: [
      block('Keeping visual range without becoming scattered', 'h2'),
      block(
        'Dribbble and Unnamed+ Studio are useful because they show range: product UI shots, landing pages, dashboards, brand/web experiments, and design engineering work. The risk is letting that range turn the personal site back into a generalist archive.',
      ),
      block(
        'The Dribbble profile shows UI and product-design practice: course progress cards, real estate landing pages, account creation flows, payment forms, itinerary planner hero sections, event registration, and weather app explorations.',
      ),
      block(
        'Unnamed+ Studio gives the more professional side-project signal: a design engineering factory for one-of-a-kind web experiences, with public work such as Jagorawi Golf, Devault App, PT Gunung Kendali, and Blink Beauty Clinic.',
      ),
      callout(
        'How to use this material',
        'Use Dribbble and Unnamed+ as proof of visual taste, interaction exploration, and design engineering range. Do not let them compete with the product-builder positioning on the homepage.',
      ),
      block(
        'The strongest structure is still simple: Work proves product-building. Playground shows creative range. About explains the throughline.',
      ),
    ],
  },
];

async function seedCategory(category: SeedCategory) {
  await client.createIfNotExists({
    _id: category.id,
    _type: 'category',
    description: category.description,
    slug: {
      _type: 'slug',
      current: category.slug,
    },
    title: category.title,
  });
}

async function seedPost(post: SeedPost) {
  await client.createOrReplace({
    _id: `post-${post.slug}`,
    _type: 'post',
    body: post.body,
    category: {
      _ref: post.categoryId,
      _type: 'reference',
    },
    excerpt: post.excerpt,
    featured: post.featured ?? false,
    publishedAt: post.publishedAt,
    relatedWork: [],
    slug: {
      _type: 'slug',
      current: post.slug,
    },
    title: post.title,
  });
}

for (const category of categories) {
  await seedCategory(category);
}

for (const post of posts) {
  await seedPost(post);
}

console.log(`Seeded ${categories.length} categories and ${posts.length} legacy-derived posts.`);
