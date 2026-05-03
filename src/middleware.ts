import { defineMiddleware } from 'astro:middleware';

const CANONICAL_HOST = 'dhaf.in';
const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;
const LEGACY_HOST_TARGETS: Record<string, string> = {
  'midjourney.dhaf.in': '/about',
  'portfolio.dhaf.in': '/work',
  'video.dhaf.in': '/about',
};

const HTML_CACHE_CONTROL = 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400';

export const onRequest = defineMiddleware(async (context, next) => {
  const requestUrl = new URL(context.request.url);

  if (requestUrl.hostname === `www.${CANONICAL_HOST}`) {
    requestUrl.hostname = CANONICAL_HOST;
    requestUrl.protocol = 'https:';

    return Response.redirect(requestUrl, 301);
  }

  const legacyTarget = LEGACY_HOST_TARGETS[requestUrl.hostname];

  if (legacyTarget) {
    const redirectUrl = new URL(legacyTarget, CANONICAL_ORIGIN);
    redirectUrl.search = requestUrl.search;

    return Response.redirect(redirectUrl, 301);
  }

  const response = await next();

  const isCacheableHtml =
    context.request.method === 'GET' &&
    response.status === 200 &&
    !requestUrl.pathname.startsWith('/api') &&
    !requestUrl.pathname.startsWith('/preview') &&
    response.headers.get('content-type')?.includes('text/html') &&
    !response.headers.has('Cache-Control');

  if (isCacheableHtml) {
    response.headers.set('Cache-Control', HTML_CACHE_CONTROL);
  }

  return response;
});
