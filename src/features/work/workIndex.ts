import type { PublishedWork, PublishedWorkStatus, SanityImage } from '../../sanity/published';

type WorkListItem = Pick<
  PublishedWork,
  'liveUrl' | 'proofTags' | 'repoUrl' | 'role' | 'slug' | 'stack' | 'status' | 'summary' | 'title'
> & {
  coverImage?: SanityImage;
};

export type WorkCardItem = {
  coverImage?: SanityImage;
  href: string;
  liveUrl?: string;
  mark: string;
  primaryActionLabel: string;
  proofTags: string[];
  repoUrl?: string;
  role: string;
  stack: string[];
  status: PublishedWorkStatus;
  summary: string;
  title: string;
  tone: string;
};

const fallbackWorks: WorkListItem[] = [
  {
    title: 'Invitasi',
    slug: 'invitasi',
    summary:
      'Wedding invitation platform for couples and organizers to publish invitations, manage RSVPs, and grow into planning workflows.',
    status: 'ongoing',
    role: 'Product builder / design engineer',
    proofTags: ['Onboarding', 'RSVP', 'Builder'],
    stack: ['Next.js', 'TypeScript', 'Postgres'],
    liveUrl: 'https://invitasi.app',
  },
  {
    title: 'Devault',
    slug: 'devault',
    summary:
      'Community SaaS for Discord teams to save useful resources from chat and monitor high-signal channels.',
    status: 'live',
    role: 'Product builder / UI systems',
    proofTags: ['Community workflow', 'Dashboard'],
    stack: ['Next.js', 'TanStack', 'Postgres'],
    liveUrl: 'https://devault.app',
  },
  {
    title: 'Standout Headshot',
    slug: 'standout-headshot',
    summary:
      'AI image product for job seekers and companies to generate professional headshots with fast comprehension and conversion.',
    status: 'live',
    role: 'Creative technologist / product builder',
    proofTags: ['AI images', 'Conversion'],
    stack: ['Next.js', 'AI workflow', 'Cloudflare'],
    liveUrl: 'https://standoutheadshot.com',
  },
];

const workTones = ['var(--color-sunshine-yellow)', 'var(--color-frost-gray)', 'var(--color-electric-purple)'];

export function createWorkCards(works: PublishedWork[]): WorkCardItem[] {
  const hasPublishedWorks = works.length > 0;
  const selectedWorks: WorkListItem[] = hasPublishedWorks ? works : fallbackWorks;

  return selectedWorks.map((work, index) => ({
    title: work.title,
    summary: work.summary,
    role: `${work.role} / ${toStatusLabel(work.status)}`,
    proofTags: work.proofTags,
    stack: work.stack,
    status: work.status,
    href: hasPublishedWorks ? `/work/${work.slug}` : work.liveUrl,
    liveUrl: hasPublishedWorks ? work.liveUrl : undefined,
    repoUrl: work.repoUrl,
    coverImage: work.coverImage,
    tone: workTones[index % workTones.length],
    mark: work.title.charAt(0).toUpperCase() || (index + 1).toString(),
    primaryActionLabel: hasPublishedWorks ? 'Read proof' : 'Open live',
  }));
}

function toStatusLabel(status: PublishedWorkStatus): string {
  return (
    {
      live: 'live',
      ongoing: 'ongoing',
      paused: 'paused',
    }[status] ?? status
  );
}
