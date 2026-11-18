/**
 * Creem is the merchant of record in the public copy.
 * This build cannot open a Creem checkout or take a card payment.
 * Live charges stay off until the owner turns them on in a later change.
 */
export const creem = {
  mode: "deferred" as const,
  buyerTermsUrl: "https://www.creem.io/buyer-terms",
  privacyNoticeUrl: "https://www.creem.io/privacy",
};

export const liveChargesEnabled = false;
