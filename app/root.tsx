import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import {  message } from 'antd';
async function clientMiddlewareFun({ request }:{request:Request}, next: () => any) {
  const url = new URL(request.url);
  const routePath = url.pathname; // 直接取 pathname 就是路由路径
  
  console.log(`🌐 ${request.method} ${routePath}${url.search}`);
  const start = performance.now();
  await next(); // 👈 No return value
  console.log(`Navigation took ${performance.now() - start}ms`);
}


export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  clientMiddlewareFun
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <html lang="cn">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="./config.js"></script>
        <Meta />
        <Links />
      </head>
      <body style={{margin:0,padding:0}}>
      {contextHolder}
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

