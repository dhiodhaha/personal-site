import {
  SANITY_API_VERSION,
  SANITY_STUDIO_DATASET,
  SANITY_STUDIO_PROJECT_ID,
} from 'astro:env/server';

import { PublishedContentConfigError } from './errors';

export type PublishedSanityEnv = {
  apiVersion: string;
  dataset: string;
  projectId: string;
};

export function getPublishedSanityEnv(): PublishedSanityEnv {
  if (!SANITY_STUDIO_PROJECT_ID) {
    throw new PublishedContentConfigError('Missing SANITY_STUDIO_PROJECT_ID.');
  }

  return {
    apiVersion: SANITY_API_VERSION,
    dataset: SANITY_STUDIO_DATASET,
    projectId: SANITY_STUDIO_PROJECT_ID,
  };
}
