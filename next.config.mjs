import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  optimizeFonts: false,

  // pdfjs-dist depends on canvas which causes vercel deployment to fail due to build size
  // excluding the dependency here seems to work 🤷‍♂️
  // https://nextjs.org/docs/pages/api-reference/next-config-js/output#caveats
  // https://stackoverflow.com/a/76208316
  experimental: {
    outputFileTracingRoot: __dirname,
    outputFileTracingExcludes: {
      "*": ["node_modules/canvas"],
    },
  },
  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

export default config;
