import { PublishedContentConfigError } from './errors';

export type PublishedSanityEnv = {
  apiVersion: string;
  dataset: string;
  projectId: string;
};

const DEFAULT_API_VERSION = '2025-02-19';
const DEFAULT_DATASET = 'production';

export function getPublishedSanityEnv(): PublishedSanityEnv {
  const projectId = process.env.SANITY_STUDIO_PROJECT_ID;

  if (!projectId) {
    throw new PublishedContentConfigError('Missing SANITY_STUDIO_PROJECT_ID.');
  }

  return {
    apiVersion: process.env.SANITY_API_VERSION ?? DEFAULT_API_VERSION,
    dataset: process.env.SANITY_STUDIO_DATASET ?? DEFAULT_DATASET,
    projectId,
  };
}
