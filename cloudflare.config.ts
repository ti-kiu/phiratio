import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "phiratio-web",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-18",
    observability: {
      enabled: true,
      headSamplingRate: 1,
      logs: { enabled: true, persist: true },
      traces: { enabled: true, persist: true },
    },
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      VINEXT_KV_CACHE: bindings.kv({ id: "14b38526583f4d10a417fc8120dc1f8e" }),
    },
  }),
});
