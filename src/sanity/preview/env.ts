export type RuntimeEnv = Record<string, string | undefined>;

export type PreviewSanityEnv = {
  apiVersion: string;
  dataset: string;
  previewSecret: string;
  projectId: string;
  readToken: string;
};

const DEFAULT_API_VERSION = '2025-02-19';
const DEFAULT_DATASET = 'production';

export class PreviewContentConfigError extends Error {
  constructor(message: string) {
    super(`Preview Sanity content is not configured: ${message}`);
    this.name = 'PreviewContentConfigError';
  }
}

function readEnv(name: string, runtimeEnv?: RuntimeEnv): string | undefined {
  return runtimeEnv?.[name] ?? process.env[name];
}

function requiredEnv(name: string, runtimeEnv?: RuntimeEnv): string {
  const value = readEnv(name, runtimeEnv);

  if (!value) {
    throw new PreviewContentConfigError(`Missing ${name}.`);
  }

  return value;
}

export function getAstroRuntimeEnv(locals: unknown): RuntimeEnv | undefined {
  if (typeof locals !== 'object' || locals === null) {
    return undefined;
  }

  const runtime = (locals as { runtime?: { env?: RuntimeEnv } }).runtime;

  return runtime?.env;
}

export function getPreviewSanityEnv(runtimeEnv?: RuntimeEnv): PreviewSanityEnv {
  return {
    apiVersion: readEnv('SANITY_API_VERSION', runtimeEnv) ?? DEFAULT_API_VERSION,
    dataset: readEnv('SANITY_STUDIO_DATASET', runtimeEnv) ?? DEFAULT_DATASET,
    previewSecret: requiredEnv('PREVIEW_SECRET', runtimeEnv),
    projectId: requiredEnv('SANITY_STUDIO_PROJECT_ID', runtimeEnv),
    readToken: requiredEnv('SANITY_READ_TOKEN', runtimeEnv),
  };
}
