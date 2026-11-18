export type AnalyticsEvent = {
  name:
    | "photo_added"
    | "export_preview"
    | "export_hd"
    | "export_pdf"
    | "checkout_started"
    | "checkout_test_success"
    | "checkout_test_cancel"
    | "license_restored";
  source?: string;
};

/**
 * Analytics vendor is unset. Events stay in memory for this tab and are not sent.
 */
export function track(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  const target = window as Window & { __phiratioEvents?: AnalyticsEvent[] };
  target.__phiratioEvents = target.__phiratioEvents ?? [];
  target.__phiratioEvents.push(event);
}
