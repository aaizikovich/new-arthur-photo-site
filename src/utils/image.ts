/**
 * Builds a srcset string for Cloudflare Images.
 * Assumes images are served through Cloudflare Image Resizing.
 */
export function buildSrcSet(
  src: string,
  widths: number[] = [400, 800, 1200, 1600, 2000]
): string {
  return widths
    .map((w) => `${src}?width=${w}&format=auto&quality=80 ${w}w`)
    .join(', ');
}

/**
 * Returns sizes attribute string for a full-width responsive image.
 */
export function fullWidthSizes(): string {
  return '(min-width: 1280px) 1280px, 100vw';
}

/**
 * Returns sizes attribute string for a half-width image on desktop.
 */
export function halfWidthSizes(): string {
  return '(min-width: 1024px) 50vw, 100vw';
}

/**
 * Returns sizes attribute string for a grid image (1/3 on desktop).
 */
export function gridSizes(columns = 3): string {
  return `(min-width: 1024px) ${Math.round(100 / columns)}vw, (min-width: 640px) 50vw, 100vw`;
}
