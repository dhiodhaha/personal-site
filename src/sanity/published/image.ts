import type { SanityImage } from './types';

export type SanityImageFit = 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale';

export type SanityImageUrlOptions = {
  fit?: SanityImageFit;
  height?: number;
  quality?: number;
  width?: number;
};

function toPositiveInteger(value: number | undefined): string | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return undefined;
  }

  return Math.round(value).toString();
}

export function getSanityImageUrl(image: SanityImage, options: SanityImageUrlOptions = {}): string {
  const url = new URL(image.asset.url);
  const width = toPositiveInteger(options.width);
  const height = toPositiveInteger(options.height);

  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', options.fit ?? 'max');
  url.searchParams.set('q', toPositiveInteger(options.quality) ?? '82');

  if (width) {
    url.searchParams.set('w', width);
  }

  if (height) {
    url.searchParams.set('h', height);
  }

  return url.toString();
}

export function getSanityImageSrcSet(
  image: SanityImage,
  widths: number[],
  options: SanityImageUrlOptions = {},
): string {
  return widths
    .filter((width) => Number.isFinite(width) && width > 0)
    .map((width) => {
      const height =
        options.height && options.width
          ? Math.round((width / options.width) * options.height)
          : undefined;

      return `${getSanityImageUrl(image, { ...options, height, width })} ${Math.round(width)}w`;
    })
    .join(', ');
}
