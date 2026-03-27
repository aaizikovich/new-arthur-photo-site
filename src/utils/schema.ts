const SITE_URL = 'https://arthuraizikovich.com';

/**
 * Creates a BreadcrumbList JSON-LD object.
 */
export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Creates an ImageObject JSON-LD object.
 */
export function imageSchema(options: {
  url: string;
  width?: number;
  height?: number;
  caption?: string;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    url: options.url.startsWith('http') ? options.url : `${SITE_URL}${options.url}`,
    ...(options.width && { width: options.width }),
    ...(options.height && { height: options.height }),
    ...(options.caption && { caption: options.caption }),
  };
}

/**
 * Creates a Person JSON-LD object for Arthur.
 */
export function personSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Arthur Aizikovich',
    url: SITE_URL,
    jobTitle: 'Photographer',
    worksFor: {
      '@type': 'Organization',
      name: 'AA Media',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Copenhagen',
      addressCountry: 'DK',
    },
    sameAs: [
      'https://www.instagram.com/arthuraizikovich',
      'https://www.linkedin.com/in/arthuraizikovich',
    ],
  };
}
