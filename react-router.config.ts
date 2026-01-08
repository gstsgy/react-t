import type { Config } from "@react-router/dev/config";
export default {
  future: {
    v8_middleware: true,
  },
  basename: '/react-t/',
  //unstable_middleware: true,  // ← 改为这个
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,
} satisfies Config;
