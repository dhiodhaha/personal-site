import { validatePublishedPost, validatePublishedWork } from '../published/validation';
import type { PublishedPost, PublishedWork } from '../published';
import { createPreviewSanityClient } from './client';
import { previewPostBySlugQuery, previewWorkBySlugQuery } from './queries';
import type { RuntimeEnv } from './env';

export async function getPreviewWorkBySlug(slug: string, runtimeEnv?: RuntimeEnv): Promise<PublishedWork | null> {
  const client = createPreviewSanityClient(runtimeEnv);
  const result = await client.fetch<unknown | null>(previewWorkBySlugQuery, { slug });

  return result ? validatePublishedWork(result) : null;
}

export async function getPreviewPostBySlug(slug: string, runtimeEnv?: RuntimeEnv): Promise<PublishedPost | null> {
  const client = createPreviewSanityClient(runtimeEnv);
  const result = await client.fetch<unknown | null>(previewPostBySlugQuery, { slug });

  return result ? validatePublishedPost(result) : null;
}
