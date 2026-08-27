export interface BookStore {
  label: string;
  href: string;
}

export interface BookListing {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  alt: string;
  details: string;
  metrics: string[];
  bestFor: string;
  numberOfPages: number;
  price: string;
  checkoutUrl: string;
  stores: BookStore[];
}

export const books: BookListing[] = [
  {
    badge: 'Complete field guide',
    title: 'WordPress Malware Removal',
    subtitle: 'for Developers & Site Owners',
    description:
      'An end-to-end investigation and recovery method covering diagnosis, files, databases, hosting, redirects, SEO spam, hidden users, payment skimmers, suspensions, blacklists, reinfection, and monitoring.',
    cover: '/book-cover.png',
    alt: 'WordPress Malware Removal for Developers and Site Owners book cover',
    details: '/books/wordpress-malware-removal/',
    metrics: ['278 pages', '17 chapters', '81 screenshots and figures'],
    bestFor:
      'Developers, site owners, agencies, and responders who want the complete WordPress malware-removal workflow.',
    numberOfPages: 278,
    price: '$14.99',
    checkoutUrl:
      'https://mdpabel.lemonsqueezy.com/checkout/buy/e5ebff5e-0903-433f-a892-bb6ef0dbdc3d?embed=1&media=0&logo=0&desc=0',
    stores: [
      {
        label: 'Leanpub',
        href: 'https://leanpub.com/wordpressmalwareremovalfordeveloperssiteowners',
      },
      {
        label: 'Gumroad',
        href: 'https://pabelcraft.gumroad.com/l/wordpress-malware-removal',
      },
    ],
  },
  {
    badge: 'Focused advanced guide',
    title: 'Advanced WordPress Malware Removal',
    subtitle: 'Persistent Infections, Reinfection, and Recovery',
    description:
      'A focused forensic case study of SC 4.0.3 self-healing malware, including persistence mapping, safe static decoding, database investigation, coordinated cleanup, and recurrence testing.',
    cover: '/images/book/advanced-wordpress-malware-removal-cover.png',
    alt: 'Advanced WordPress Malware Removal book cover',
    details: '/books/advanced-wordpress-malware-removal/',
    metrics: ['31 pages', '11 incident screenshots', '1 complete case'],
    bestFor:
      'Developers, freelancers, and security professionals handling persistent or repeatedly returning WordPress malware.',
    numberOfPages: 31,
    price: '$5.99',
    checkoutUrl:
      'https://mdpabel.lemonsqueezy.com/checkout/buy/4045e4df-32b8-408c-84c4-eab2f81d65d2?embed=1&media=0&logo=0&desc=0',
    stores: [
      {
        label: 'Leanpub',
        href: 'https://leanpub.com/advanced-wordpress-malware-removal',
      },
    ],
  },
];
