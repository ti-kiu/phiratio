# Frontend handoff

PhiRatio v1 can be deployed to Cloudflare Workers as `phiratio-web`. The custom domain is bound by the coordinator after that Worker exists. Live Creem charges are still off.

Not done, on purpose:

- No live Creem store and no card charge
- No published legal name, street address, or governing-law clause
- No GitHub repository

## Catalog

`data/measurements.v1.json` is the locked owner catalog (`status: locked`, locked 18 November 2026). `lib/measurements.ts` is the only module that imports it. The results panel, PDF, and FAQ read that module. The visible upper-face / lower-face formula stored in the file is `(1 - vfo) / (phi - 1)`. Visible length / width is `phi - vfo`.

The human spec is `docs/measurement-spec-v1.md`.

The thirds-and-fifths overlay is module 12 and is a drawing guide only. It is not one of the 11 rows.

## Local preview

```bash
npm install
npm run dev
```

Open http://127.0.0.1:43127 . `npm test` and `npm run build` check the catalog and the prerender.

## Still open

The public contact is support@phiratio.app. A legal name, street address, and governing law stay unpublished. Privacy and Terms are not marked as lawyer-reviewed.

[待确认] Live Creem checkout is not connected. `lib/creem.ts` cannot open a charge. Buyer Terms: https://www.creem.io/buyer-terms. Privacy Notice: https://www.creem.io/privacy.

[待确认] Analytics vendor is unset. `lib/analytics.ts` keeps events in memory and does not load GA4 or Clarity.

[待确认] A previously stored local license can still unlock export in that browser. The pricing page no longer issues one.

Workers deploy is documented in the README. The Worker name is `phiratio-web`.

[待确认] Template PNGs and the sample diagram are original artwork for this preview. Replace them if the owner archive has different files. They are real RGBA PNGs.

[待确认] The jawline-contour window stays out of v1, as the locked catalog says.
