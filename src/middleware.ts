import { defineMiddleware } from 'astro:middleware';

const CANONICAL_HOST = 'dhaf.in';
const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;
const LEGACY_HOST_TARGETS: Record<string, string> = {
  'midjourney.dhaf.in': '/about',
  'portfolio.dhaf.in': '/work',
  'video.dhaf.in': '/about',
};

export const onRequest = defineMiddleware((context, next) => {
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

  return next();
});
