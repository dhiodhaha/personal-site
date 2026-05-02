import { createClient } from '@sanity/client';

import { getPreviewSanityEnv, type RuntimeEnv } from './env';

export function createPreviewSanityClient(runtimeEnv?: RuntimeEnv) {
  const { apiVersion, dataset, projectId, readToken } = getPreviewSanityEnv(runtimeEnv);

  return createClient({
    apiVersion,
    dataset,
    perspective: 'drafts',
    projectId,
    token: readToken,
    useCdn: false,
  });
}
