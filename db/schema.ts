import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const bookLeads = sqliteTable(
  'book_leads',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull(),
    emailKey: text('email_key').notNull(),
    firstSeenAt: text('first_seen_at').notNull(),
    lastSeenAt: text('last_seen_at').notNull(),
    source: text('source').notNull(),
    marketingConsent: integer('marketing_consent').notNull().default(0),
    caseStudyRequested: integer('case_study_requested').notNull().default(0),
    checkoutStarted: integer('checkout_started').notNull().default(0),
    landingPage: text('landing_page'),
    attributionJson: text('attribution_json'),
  },
  (table) => [uniqueIndex('idx_book_leads_email_key').on(table.emailKey)],
);
