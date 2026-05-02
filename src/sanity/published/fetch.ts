import { createPublishedSanityClient } from './client';
import {
  publishedPostBySlugQuery,
  publishedPostListQuery,
  publishedPostSlugsQuery,
  publishedProfileQuery,
  publishedWorkBySlugQuery,
  publishedWorkListQuery,
  publishedWorkSlugsQuery,
} from './queries';
import type { PublishedPost, PublishedProfile, PublishedWork, StaticSlugPath } from './types';
import { validatePublishedPost, validatePublishedProfile, validatePublishedWork } from './validation';

type SlugResult = {
  slug?: unknown;
};

function validateSlug(value: SlugResult, source: string): string {
  if (typeof value.slug !== 'string' || value.slug.trim().length === 0) {
    throw new Error(`Invalid Sanity slug returned from ${source}.`);
  }

  return value.slug;
}

export async function getPublishedWorks(): Promise<PublishedWork[]> {
  const client = createPublishedSanityClient();
  const results = await client.fetch<unknown[]>(publishedWorkListQuery);

  return results.map(validatePublishedWork);
}

export async function getPublishedWorkBySlug(slug: string): Promise<PublishedWork | null> {
  const client = createPublishedSanityClient();
  const result = await client.fetch<unknown | null>(publishedWorkBySlugQuery, { slug });

  return result ? validatePublishedWork(result) : null;
}

export async function getPublishedWorkStaticPaths(): Promise<StaticSlugPath[]> {
  const client = createPublishedSanityClient();
  const results = await client.fetch<SlugResult[]>(publishedWorkSlugsQuery);

  return results.map((result) => ({
    params: {
      slug: validateSlug(result, 'publishedWorkSlugsQuery'),
    },
  }));
}

export async function getPublishedPosts(): Promise<PublishedPost[]> {
  const client = createPublishedSanityClient();
  const results = await client.fetch<unknown[]>(publishedPostListQuery);

  return results.map(validatePublishedPost);
}

export async function getPublishedPostBySlug(slug: string): Promise<PublishedPost | null> {
  const client = createPublishedSanityClient();
  const result = await client.fetch<unknown | null>(publishedPostBySlugQuery, { slug });

  return result ? validatePublishedPost(result) : null;
}

export async function getPublishedPostStaticPaths(): Promise<StaticSlugPath[]> {
  const client = createPublishedSanityClient();
  const results = await client.fetch<SlugResult[]>(publishedPostSlugsQuery);

  return results.map((result) => ({
    params: {
      slug: validateSlug(result, 'publishedPostSlugsQuery'),
    },
  }));
}

export async function getPublishedProfile(): Promise<PublishedProfile | null> {
  const client = createPublishedSanityClient();
  const result = await client.fetch<unknown | null>(publishedProfileQuery);

  return result ? validatePublishedProfile(result) : null;
}
