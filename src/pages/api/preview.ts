import type { APIRoute } from 'astro';

import {
  PREVIEW_COOKIE_NAME,
  PREVIEW_MAX_AGE_SECONDS,
  PreviewContentConfigError,
  createPreviewToken,
  getPreviewSanityEnv,
  type PreviewContentType,
} from '../../sanity/preview';

export const prerender = false;

function normalizeType(value: string | null): PreviewContentType | null {
  if (value === 'work') {
    return 'work';
  }

  if (value === 'post' || value === 'writing') {
    return 'writing';
  }

  return null;
}

function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;

  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return mismatch === 0;
}

export const GET: APIRoute = async ({ cookies, redirect, request }) => {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  const slug = url.searchParams.get('slug');
  const type = normalizeType(url.searchParams.get('type'));

  if (!secret || !slug || !type) {
    return new Response('Missing preview secret, slug, or type.', { status: 400 });
  }

  try {
    const { previewSecret } = getPreviewSanityEnv();

    if (!safeEqual(secret, previewSecret)) {
      return new Response('Invalid preview secret.', { status: 401 });
    }

    const token = await createPreviewToken({ slug, type });

    cookies.set(PREVIEW_COOKIE_NAME, token, {
      httpOnly: true,
      maxAge: PREVIEW_MAX_AGE_SECONDS,
      path: '/preview',
      sameSite: 'lax',
      secure: true,
    });

    return redirect(`/preview/${type}/${encodeURIComponent(slug)}`, 307);
  } catch (error) {
    if (error instanceof PreviewContentConfigError) {
      return new Response(error.message, { status: 500 });
    }

    throw error;
  }
};
