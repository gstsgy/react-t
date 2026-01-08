import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
export default defineConfig({
  base: '/react-t',
  server: {
    host: '0.0.0.0', // 监听所有 IPv4 地址（包括本机和局域网）
    port: 3000,      // 可选：指定端口
    allowedHosts: [
      '3000.app.cloudstudio.work'
    ],
    open: false      // 是否自动打开浏览器
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
