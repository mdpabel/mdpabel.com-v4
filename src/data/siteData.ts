// src/data/siteData.ts

// 1. Pure Data Only. No React imports.
// We store icon names as strings so we can load them dynamically in Astro.

export const siteData = {
  profiles: {
    linkedin: 'https://www.linkedin.com/in/mdpabe1/',
    github: 'https://github.com/mdpabel',
    leetcode: 'https://leetcode.com/u/mdpabel/',
    companyHouse:
      'https://find-and-update.company-information.service.gov.uk/company/15939565/officers',
  },
  personal: {
    name: 'MD Pabel',
    tagline: 'Build. Secure. Scale.',
    logo: 'Rocket', // Store name, not component
    email: 'support@mdpabel.com',
    phone: '+1 (555) 123-4567',
    address: 'Remote, Worldwide',
    title: 'Full Stack Web Developer & Security Specialist',
    company: '3Zero Digital',
    description:
      'Building secure, scalable web solutions with over 4 years of experience serving clients worldwide.',
    avatar: '/images/pabel-avatar.jpg',
    location: 'Remote, Worldwide',
    experience: `${new Date().getFullYear() - 2018} Years`,
    timezone: 'GMT+6',
  },

  navigation: {
    main: [
      { title: 'Services', href: '/services' },
      { title: 'About', href: '/about' },
      { title: 'Contact', href: '/hire-me' },
      { title: 'Hire Me', href: '/hire-me' },
      { title: 'Templates', href: '/templates' },
      { title: 'Malware Logs', href: '/malware-log' },
      { title: 'Blog', href: '/blog' },
      { title: 'Snippets', href: '/snippets' },
    ],

    services: [
      {
        icon: 'Shield',
        title: 'Malware Removal',
        description: 'Complete malware cleanup & security hardening',
        href: '/services/malware-removal',
      },
      {
        icon: 'Wrench',
        title: 'Website Maintenance',
        description: 'Ongoing support & performance optimization',
        href: '/services/website-maintenance',
      },
      {
        icon: 'Code',
        title: 'Website Development',
        description: 'Custom web applications & solutions',
        href: '/services/website-development',
      },
    ],

    legal: [
      {
        icon: 'FileText',
        title: 'Terms and Conditions',
        description: 'Legal terms and agreements',
        href: '/terms',
      },
      {
        icon: 'RotateCcw',
        title: 'Refund Policy',
        description: 'Our refund and cancellation policy',
        href: '/refund-policy',
      },
      {
        icon: 'Scale',
        title: 'Privacy Policy',
        description: 'How we handle your data',
        href: '/privacy',
      },
    ],

    resources: [
      {
        icon: 'BookOpen',
        title: 'Blogs',
        description: 'Latest insights and tutorials',
        href: '/blog',
      },
      {
        icon: 'FileText',
        title: 'Case Studies',
        description: 'Real-world project examples',
        href: '/case-studies',
      },
      {
        icon: 'Code',
        title: 'Templates',
        description: 'Ready-to-use templates',
        href: '/templates',
      },
    ],
  },

  social: {
    links: [
      {
        name: 'GitHub',
        href: 'https://github.com',
        icon: 'Github',
      },
      {
        name: 'LinkedIn',
        href: 'https://linkedin.com',
        icon: 'Linkedin',
      },
      {
        name: 'Twitter',
        href: 'https://twitter.com',
        icon: 'Twitter',
      },
      {
        name: 'Facebook',
        href: 'https://facebook.com',
        icon: 'Facebook',
      },
      {
        name: 'Instagram',
        href: 'https://instagram.com',
        icon: 'Instagram',
      },
    ],
  },

  contact: {
    email: 'support@mdpabel.com',
    phone: '+1 (555) 123-4567',
    address: 'Remote, Worldwide',
    hours: 'Mon-Fri: 9AM-6PM GMT+6',
  },

  stats: {
    hackedWebsitesFixed: '4500+',
    recoveredDomains: '300+',
    completedProjects: '3200+',
    clientsSatisfied: '2300+',
    dsaProblems: '800+',
    soccerMatches: '3500+',
    winRate: '50%',
    experience: `${new Date().getFullYear() - 2018}+ Years`,
    experienceInNumber: `${new Date().getFullYear() - 2018}`,
    globalImpacts: '56%',
    websiteLaunched: '50+',
  },

  companies: {
    current: [
      {
        name: 'Trueline',
        location: 'USA',
        role: 'Full Stack Developer',
        description:
          'Custom development, feature implementation, website maintenance, and web security hardening.',
        tasks: [
          'Custom Development',
          'Feature Implementation',
          'Website Maintenance',
          'Security Hardening',
          'Performance Optimization',
        ],
      },
      {
        name: 'CollectDev',
        location: 'Canada',
        role: 'Next.js Developer',
        description:
          'Building modern, scalable applications with Next.js and PostgreSQL.',
        tasks: [
          'Next.js Development',
          'PostgreSQL Integration',
          'WordPress Development',
          'Modern Web Apps',
        ],
      },
    ],
    freelance: [
      {
        platform: 'Fiverr',
        clients: '1800+',
        projects: '2000+',
        rating: '5.0',
        specialties: [
          'WordPress Security',
          'Malware Removal',
          'Web Development',
        ],
      },
      {
        platform: 'Upwork',
        clients: '100+',
        rating: '100%',
        projects: '100+',
        specialties: [
          'Full Stack Development',
          'Security Solutions',
          'Performance Optimization',
        ],
      },
    ],
  },

  skills: {
    languages: ['JavaScript', 'TypeScript', 'Python', 'PHP', 'HTML', 'CSS'],
    frontend: ['React', 'Next.js', 'Tailwind CSS', 'Vue.js', 'Angular'],
    backend: ['Node.js', 'Express', 'Django', 'Laravel', 'FastAPI'],
    databases: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQLite'],
    tools: ['Prisma', 'Git', 'Docker', 'AWS', 'Vercel', 'Netlify'],
    cms: ['WordPress', 'Strapi', 'Contentful', 'Sanity'],
    security: [
      'Malware Removal',
      'Security Hardening',
      'SSL Implementation',
      'Backup Solutions',
    ],
  },

  services: [
    {
      icon: 'Shield',
      title: 'Malware Removal & Security',
      description:
        'Complete malware cleanup, security hardening, and protection against future threats.',
      features: [
        'Malware Detection & Removal',
        'Security Hardening',
        'Blacklist Recovery',
        'SSL Implementation',
      ],
    },
    {
      icon: 'Code',
      title: 'Full Stack Development',
      description:
        'Custom web applications built with modern technologies and best practices.',
      features: [
        'React/Next.js Apps',
        'Node.js APIs',
        'Database Design',
        'Third-party Integrations',
      ],
    },
    {
      icon: 'Wrench',
      title: 'Website Maintenance',
      description:
        'Ongoing support, updates, and performance optimization for your websites.',
      features: [
        'Regular Updates',
        'Performance Optimization',
        'Bug Fixes',
        'Content Management',
      ],
    },
    {
      icon: 'Server',
      title: 'WordPress Solutions',
      description:
        'WordPress development, customization, and security solutions.',
      features: [
        'Custom Themes',
        'Plugin Development',
        'E-commerce Solutions',
        'Migration Services',
      ],
    },
  ],

  interests: {
    coffee: {
      icon: 'Coffee',
      title: 'Coffee Enthusiast',
      description: 'Perfect blend: Coffee + Coffee Mate + Sugar',
    },
    gaming: {
      icon: 'Gamepad2',
      title: 'Dream League Soccer',
      description: '3500+ matches played with 50% win rate',
    },
  },
};
