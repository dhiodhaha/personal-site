export type SanityImageAsset = {
  _id: string;
  metadata?: {
    dimensions?: {
      height: number;
      width: number;
    };
  };
  mimeType?: string;
  url: string;
};

export type SanityImage = {
  alt: string;
  asset: SanityImageAsset;
  caption?: string;
};

export type PortableTextBody = unknown[];

export type PublishedCategory = {
  _id: string;
  description?: string;
  slug: string;
  title: string;
};

export type PublishedWorkStatus = 'live' | 'ongoing' | 'paused';

export type PublishedWork = {
  _id: string;
  body: PortableTextBody;
  coverImage: SanityImage;
  featured: boolean;
  gallery: SanityImage[];
  liveUrl: string;
  proofTags: string[];
  repoUrl?: string;
  role: string;
  slug: string;
  sortOrder: number;
  stack: string[];
  status: PublishedWorkStatus;
  summary: string;
  title: string;
};

export type PublishedPost = {
  _id: string;
  body: PortableTextBody;
  category: PublishedCategory;
  coverImage?: SanityImage;
  excerpt: string;
  featured: boolean;
  publishedAt: string;
  relatedWork: Pick<PublishedWork, '_id' | 'slug' | 'summary' | 'title'>[];
  slug: string;
  title: string;
  updatedAt?: string;
};

export type PublishedProfileLink = {
  label: string;
  url: string;
};

export type PublishedProfile = {
  _id: string;
  bio: string;
  email?: string;
  headline: string;
  links: PublishedProfileLink[];
  name: string;
};

export type StaticSlugPath = {
  params: {
    slug: string;
  };
};
