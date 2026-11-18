# Payments checklist

Public pages can ship while live Creem charges stay off.

Still required before a card can be charged:

- Keep `liveChargesEnabled` false in `lib/creem.ts` until the owner asks for a real charge.
- Do not set a Creem product id or a checkout redirect in this build.
- The public contact is support@phiratio.app. Do not publish a legal name, street address, or governing-law clause.
- Do not mark Privacy or Terms as lawyer-reviewed.
- Refund requests go to support@phiratio.app first. Creem issues the payment refund as the merchant of record.
- Price stays USD 7.99, one time, with a 7-day refund and no reason required.
