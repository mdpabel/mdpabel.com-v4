import { handleBookLead } from '../../server/bookLeadHandler.js';

export async function onRequestPost(context) {
  return handleBookLead(context.request, context.env);
}
