import type { LinksFunction } from "remix";
import { Links, LiveReload, Outlet, useLoaderData } from "remix";
import { createClient } from "@supabase/supabase-js";
import { SupabaseProvider } from "./utils/supabase-client";

import globalStylesUrl from "./styles/global.css";
import globalMediumStylesUrl from "./styles/global-medium.css";
import globalLargeStylesUrl from "./styles/global-large.css";

export const loader = () => {
  return {
    supabaseKey: process.env.SUPABASE_ANON_KEY,
    supabaseUrl: process.env.SUPABASE_URL,
  };
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: globalStylesUrl
    },
    {
      rel: "stylesheet",
      href: globalMediumStylesUrl,
      media: "print, (min-width: 640px)"
    },
    {
      rel: "stylesheet",
      href: globalLargeStylesUrl,
      media: "screen and (min-width: 1024px)"
    }
  ];
};

export default function App() {
  const loader = useLoaderData();
  const supabase = createClient(loader.supabaseUrl, loader.supabaseKey);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Remix: So great, it's funny!</title>
        <Links />
      </head>
      <body>
      <SupabaseProvider supabase={supabase}>
        <Outlet />
        {process.env.NODE_ENV === "development" ? (
          <LiveReload />
        ) : null}
      </SupabaseProvider>
      </body>
    </html>
  );
}
