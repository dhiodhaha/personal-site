const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

initLinkPrefetch();

if (finePointer && !reducedMotion) {
  initCustomCursor();
  initScrapbookHero();
}

function initLinkPrefetch() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const shouldAvoidPrefetch =
    connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType);

  if (shouldAvoidPrefetch) {
    return;
  }

  const prefetchedUrls = new Set();

  const prefetchLink = (link) => {
    const url = getPrefetchableUrl(link);

    if (!url || prefetchedUrls.has(url.href)) {
      return;
    }

    prefetchedUrls.add(url.href);

    const prefetch = document.createElement('link');
    prefetch.rel = 'prefetch';
    prefetch.href = url.href;
    prefetch.as = 'document';
    document.head.append(prefetch);
  };

  document.addEventListener(
    'pointerover',
    (event) => {
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest('a[href]');
      if (link) {
        prefetchLink(link);
      }
    },
    { passive: true },
  );

  document.addEventListener('focusin', (event) => {
    if (!(event.target instanceof Element)) return;

    const link = event.target.closest('a[href]');
    if (link) {
      prefetchLink(link);
    }
  });
}

function getPrefetchableUrl(link) {
  if (
    link.target === '_blank' ||
    link.hasAttribute('download') ||
    link.dataset.prefetch === 'false'
  ) {
    return null;
  }

  const url = new URL(link.href, window.location.href);

  if (
    url.origin !== window.location.origin ||
    url.pathname === window.location.pathname ||
    url.protocol !== 'http:' && url.protocol !== 'https:'
  ) {
    return null;
  }

  url.hash = '';
  return url;
}

function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const cursorLabel = cursor?.querySelector('.custom-cursor-label');

  if (!cursor || !cursorLabel) {
    return;
  }

  document.body.classList.add('custom-cursor-ready');

  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let targetX = cursorX;
  let targetY = cursorY;

  const animateCursor = () => {
    cursorX += (targetX - cursorX) * 0.24;
    cursorY += (targetY - cursorY) * 0.24;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    requestAnimationFrame(animateCursor);
  };

  window.addEventListener(
    'pointermove',
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    },
    { passive: true },
  );

  document.addEventListener('pointerover', (event) => {
    if (!(event.target instanceof Element)) return;

    const target = event.target.closest('a, button, [data-cursor-label]');
    if (!target) return;

    cursorLabel.textContent = target.dataset.cursorLabel || 'open';
    cursor.classList.add('is-active');
  });

  document.addEventListener('pointerout', (event) => {
    if (!(event.target instanceof Element)) return;

    const target = event.target.closest('a, button, [data-cursor-label]');
    if (!target || target.contains(event.relatedTarget)) return;

    cursor.classList.remove('is-active');
  });

  animateCursor();
}

function initScrapbookHero() {
  const heroStage = document.querySelector('.scrapbook-stage');

  if (!heroStage) {
    return;
  }

  const resetHero = () => {
    [
      '--hero-main-x',
      '--hero-main-y',
      '--hero-note-x',
      '--hero-note-y',
      '--hero-small-x',
      '--hero-small-y',
      '--hero-stamp-x',
      '--hero-stamp-y',
      '--hero-doodle-x',
      '--hero-doodle-y',
      '--hero-tilt-x',
      '--hero-tilt-y',
      '--hero-note-tilt-x',
      '--hero-note-tilt-y',
    ].forEach((property) => heroStage.style.removeProperty(property));
  };

  heroStage.addEventListener(
    'pointermove',
    (event) => {
      const rect = heroStage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      heroStage.style.setProperty('--hero-main-x', `${x * -18}px`);
      heroStage.style.setProperty('--hero-main-y', `${y * -14}px`);
      heroStage.style.setProperty('--hero-note-x', `${x * 24}px`);
      heroStage.style.setProperty('--hero-note-y', `${y * 18}px`);
      heroStage.style.setProperty('--hero-small-x', `${x * 38}px`);
      heroStage.style.setProperty('--hero-small-y', `${y * 30}px`);
      heroStage.style.setProperty('--hero-stamp-x', `${x * -20}px`);
      heroStage.style.setProperty('--hero-stamp-y', `${y * 12}px`);
      heroStage.style.setProperty('--hero-doodle-x', `${x * -15}px`);
      heroStage.style.setProperty('--hero-doodle-y', `${y * -10}px`);
      heroStage.style.setProperty('--hero-tilt-x', `${y * -5}deg`);
      heroStage.style.setProperty('--hero-tilt-y', `${x * 5}deg`);
      heroStage.style.setProperty('--hero-note-tilt-x', `${y * 2.5}deg`);
      heroStage.style.setProperty('--hero-note-tilt-y', `${x * -2.5}deg`);
    },
    { passive: true },
  );

  heroStage.addEventListener('pointerleave', resetHero);
}
