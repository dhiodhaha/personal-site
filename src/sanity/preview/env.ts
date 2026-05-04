import {
  PREVIEW_SECRET,
  SANITY_API_VERSION,
  SANITY_READ_TOKEN,
  SANITY_STUDIO_DATASET,
  SANITY_STUDIO_PROJECT_ID,
} from 'astro:env/server';

export type RuntimeEnv = Record<string, string | undefined>;

export type PreviewSanityEnv = {
  apiVersion: string;
  dataset: string;
  previewSecret: string;
  projectId: string;
  readToken: string;
};

export class PreviewContentConfigError extends Error {
  constructor(message: string) {
    super(`Preview Sanity content is not configured: ${message}`);
    this.name = 'PreviewContentConfigError';
  }
}

function requiredEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new PreviewContentConfigError(`Missing ${name}.`);
  }

  return value;
}

export function getPreviewSanityEnv(runtimeEnv?: RuntimeEnv): PreviewSanityEnv {
  return {
    apiVersion: runtimeEnv?.SANITY_API_VERSION ?? SANITY_API_VERSION,
    dataset: runtimeEnv?.SANITY_STUDIO_DATASET ?? SANITY_STUDIO_DATASET,
    previewSecret: requiredEnv('PREVIEW_SECRET', runtimeEnv?.PREVIEW_SECRET ?? PREVIEW_SECRET),
    projectId: requiredEnv(
      'SANITY_STUDIO_PROJECT_ID',
      runtimeEnv?.SANITY_STUDIO_PROJECT_ID ?? SANITY_STUDIO_PROJECT_ID,
    ),
    readToken: requiredEnv('SANITY_READ_TOKEN', runtimeEnv?.SANITY_READ_TOKEN ?? SANITY_READ_TOKEN),
  };
}
