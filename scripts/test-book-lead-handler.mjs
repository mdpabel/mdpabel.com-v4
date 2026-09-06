import assert from 'node:assert/strict';
import { handleBookLead } from '../server/bookLeadHandler.js';

let capturedQuery = '';
let capturedBindings = [];
const DB = {
  prepare(query) {
    capturedQuery = query;
    return {
      bind(...bindings) {
        capturedBindings = bindings;
        return { run: async () => ({ success: true }) };
      },
    };
  },
};

const validRequest = new Request('https://www.mdpabel.com/api/book-leads', {
  method: 'POST',
  headers: {
    origin: 'https://www.mdpabel.com',
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    email: 'reader@example.com',
    marketingConsent: true,
    leadType: 'checkout',
    landingPage: '/books/wordpress-malware-removal-meta-offer/',
    attribution: { utm_source: 'meta' },
  }),
});
const validResponse = await handleBookLead(validRequest, { DB });
assert.equal(validResponse.status, 200);
assert.deepEqual(await validResponse.json(), { ok: true });
assert.match(capturedQuery, /ON CONFLICT\(email_key\) DO UPDATE/);
assert.equal(capturedBindings.length, 10);
assert.equal(capturedBindings[0], 'reader@example.com');
assert.equal(capturedBindings[6], 0);
assert.equal(capturedBindings[7], 1);

const invalidRequest = new Request('https://www.mdpabel.com/api/book-leads', {
  method: 'POST',
  headers: { origin: 'https://example.com', 'content-type': 'application/json' },
  body: JSON.stringify({
    email: 'reader@example.com',
    marketingConsent: true,
    leadType: 'checkout',
  }),
});
const invalidResponse = await handleBookLead(invalidRequest, { DB });
assert.equal(invalidResponse.status, 403);

console.log('Book lead handler tests passed.');
