const WORDPRESS_MEDIA_HOST = 'cms.mdpabel.com';
const R2_MEDIA_ORIGIN = 'https://media.mdpabel.com';
const UPLOADS_PATH = '/wp-content/uploads/';

/**
 * Point a WordPress upload at R2. Other URLs are returned unchanged.
 *
 * Pages retain the original WordPress URL in `data-fallback-src`, allowing the
 * browser to retry against WordPress only if the R2 request fails.
 */
export function resolveMediaUrl(value = '') {
  try {
    const url = new URL(value, `https://${WORDPRESS_MEDIA_HOST}`);
    if (
      url.hostname !== WORDPRESS_MEDIA_HOST ||
      !['http:', 'https:'].includes(url.protocol) ||
      !url.pathname.startsWith(UPLOADS_PATH)
    ) {
      return value;
    }

    return new URL(`${url.pathname}${url.search}${url.hash}`, R2_MEDIA_ORIGIN)
      .href;
  } catch {
    return value;
  }
}

/** Point every WordPress upload candidate in a srcset value at R2. */
export function resolveMediaSrcset(value = '') {
  return value.replace(
    /(?:https?:)?\/\/cms\.mdpabel\.com(?=\/wp-content\/uploads\/)/g,
    R2_MEDIA_ORIGIN,
  );
}

/** Return the equivalent WordPress upload URL for an R2 media URL. */
export function getWordPressMediaUrl(value = '') {
  try {
    const url = new URL(value);
    if (
      url.origin !== R2_MEDIA_ORIGIN ||
      !url.pathname.startsWith(UPLOADS_PATH)
    ) {
      return value;
    }

    return new URL(
      `${url.pathname}${url.search}${url.hash}`,
      `https://${WORDPRESS_MEDIA_HOST}`,
    ).href;
  } catch {
    return value;
  }
}

export function isR2MediaUrl(value = '') {
  try {
    const url = new URL(value);
    return (
      url.origin === R2_MEDIA_ORIGIN &&
      url.pathname.startsWith(UPLOADS_PATH)
    );
  } catch {
    return false;
  }
}
