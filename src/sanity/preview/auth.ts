import { SignJWT, jwtVerify } from 'jose';

import { getPreviewSanityEnv, type RuntimeEnv } from './env';

export const PREVIEW_COOKIE_NAME = 'dhafin_preview';
export const PREVIEW_MAX_AGE_SECONDS = 15 * 60;

export type PreviewContentType = 'work' | 'writing';

export type PreviewTokenPayload = {
  scope: 'sanity-preview';
  slug: string;
  type: PreviewContentType;
};

const encoder = new TextEncoder();

function getSigningKey(runtimeEnv?: RuntimeEnv): Uint8Array {
  return encoder.encode(getPreviewSanityEnv(runtimeEnv).previewSecret);
}

function isPreviewContentType(value: unknown): value is PreviewContentType {
  return value === 'work' || value === 'writing';
}

export async function createPreviewToken(
  payload: Pick<PreviewTokenPayload, 'slug' | 'type'>,
  runtimeEnv?: RuntimeEnv,
): Promise<string> {
  return new SignJWT({
    scope: 'sanity-preview',
    slug: payload.slug,
    type: payload.type,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${PREVIEW_MAX_AGE_SECONDS}s`)
    .sign(getSigningKey(runtimeEnv));
}

export async function verifyPreviewToken(
  token: string | undefined,
  runtimeEnv?: RuntimeEnv,
): Promise<PreviewTokenPayload | null> {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSigningKey(runtimeEnv), {
      algorithms: ['HS256'],
    });

    if (
      payload.scope !== 'sanity-preview' ||
      typeof payload.slug !== 'string' ||
      !isPreviewContentType(payload.type)
    ) {
      return null;
    }

    return {
      scope: 'sanity-preview',
      slug: payload.slug,
      type: payload.type,
    };
  } catch {
    return null;
  }
}

export async function isPreviewAuthorized(
  token: string | undefined,
  expectedType: PreviewContentType,
  expectedSlug: string,
  runtimeEnv?: RuntimeEnv,
): Promise<boolean> {
  const payload = await verifyPreviewToken(token, runtimeEnv);

  return payload?.type === expectedType && payload.slug === expectedSlug;
}
