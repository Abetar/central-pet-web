import type { NextConfig } from "next";
import { existsSync } from "node:fs";

const config: NextConfig = {
  distDir: ".next",
  images: { unoptimized: true },
  devIndicators: false,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_GSAP_AVAILABLE: String(
      existsSync("public/motion/gsap.min.js")
    ),
  },
};

export default config;