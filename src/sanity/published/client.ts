import { createClient } from '@sanity/client';

import { getPublishedSanityEnv } from './env';

export function createPublishedSanityClient() {
  const { apiVersion, dataset, projectId } = getPublishedSanityEnv();

  return createClient({
    apiVersion,
    dataset,
    perspective: 'published',
    projectId,
    useCdn: true,
  });
}
