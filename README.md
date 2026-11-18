# PhiRatio

Source of truth: https://github.com/ti-kiu/phiratio

English-only golden-ratio face measurement tool. Photos, landmarks, math, PNG export, and the PDF report stay in the browser.

The public site is https://phiratio.app/. Live Creem charges stay off. Checkout on `/pricing/` does not open Creem and does not take a payment.

## Local development

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

```bash
npm test
npm run lint
npm run build
npm start
```

`npm run artwork` redraws the transparent template PNGs and the sample diagram.

## Routes

- `/`
- `/templates/`
- `/pricing/`
- `/privacy/`
- `/terms/`

Canonical host is `https://phiratio.app` with a trailing slash. `www.phiratio.app` and mixed-case paths 308 to that host and path.

## Cloudflare Workers

Worker name: `phiratio-web`.

Cloudflare Workers Builds is connected to this repository for Worker phiratio-web.

This app deploys with [vinext](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/), the current Next.js-on-Workers path. The Worker config is `cloudflare.config.ts`. There is no `wrangler.jsonc`: vinext deploys with the Cloudflare CLI, not a hand-written Wrangler file.

No secrets are required. Do not set `NEXT_PUBLIC_CREEM_LIVE`.

```bash
npm run build:vinext
npm run deploy:vinext
```

`npm run deploy:vinext` runs `vinext-cloudflare deploy`. It uploads the Worker named `phiratio-web`. It does not create DNS records. `npm run build` remains the Next.js production build.

After the Worker exists, attach the routes `phiratio.app/*` and `www.phiratio.app/*` in the Cloudflare dashboard. Do not add a live Creem product or a card charge in that step.

## Checkout

Creem is the merchant of record in the public copy. `lib/creem.ts` keeps `liveChargesEnabled` false. The pricing button does not redirect to Creem, does not create a license, and tells the visitor that checkout is not open. See `docs/GO_LIVE_CHECKLIST.md` before any later charge.

The public contact is support@phiratio.app. The site does not publish a legal name, street address, or governing-law clause.
