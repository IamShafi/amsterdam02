import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ReactQueryProvider from "@/components/ReactQueryProvider";

// ---- SEO Metadata ---- //
export const metadata: Metadata = {
  title: "Masterdam Tours - Free Walking Tours Amsterdam | Pay What You Want",
  description:
    "Discover Amsterdam with passionate local guides. Free walking tours daily. Explore the Red Light District, canals, and hidden gems. Pay what you want. 20,000+ happy travelers.",
  authors: [{ name: "Masterdam Tours" }],
  openGraph: {
    type: "website",
    title: "Masterdam Tours - Free Walking Tours Amsterdam | Pay What You Want",
    description:
      "Discover Amsterdam with passionate local guides. Free walking tours daily. Explore the Red Light District, canals, and hidden gems. Pay what you want. 20,000+ happy travelers.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@lovable_dev",
    title: "Masterdam Tours - Free Walking Tours Amsterdam | Pay What You Want",
    description:
      "Discover Amsterdam with passionate local guides. Free walking tours daily. Explore the Red Light District, canals, and hidden gems. Pay what you want. 20,000+ happy travelers.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          :root { --color-background: #fcfcfc; --color-foreground: #1d2430; }
        `,
          }}
        ></style>

        {/* ---------------------------------------------- */}
        {/*  PRECONNECT (always before preload)             */}
        {/* ---------------------------------------------- */}
        <link rel="preload" href="/_next/static/css/716864fe.css" as="style" />
        <link rel="preload" as="image" href="/masterdam-logo-transparent.png" />
        <link rel="preload" as="image" href="/assets/hero-grid.webp" />
        {/* Supabase (API, auth, db) */}
        <link
          rel="preconnect"
          href="https://uqaxivqaphztmnmroqbv.supabase.co"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://ckgsdkifvijxxvjlhsaa.supabase.co"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://ckgsdkifvijxxvjlhsaa.supabase.co"
        />

        {/* Analytics preconnect (saves 100–150ms) */}
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://www.clarity.ms"
          crossOrigin="anonymous"
        />

        {/* ---------------------------------------------- */}
        {/*  PRELOAD (LCP image)                           */}
        {/* ---------------------------------------------- */}
        <link
          rel="preload"
          href="/assets/walking-tour/tour-1.webp"
          as="image"
          fetchPriority="high"
        />
      </head>

      <body className="font-sans antialiased">
        <ReactQueryProvider>{children}</ReactQueryProvider>

        {/* ---------------------------------------------- */}
        {/*  GOOGLE ANALYTICS (Non-blocking)               */}
        {/* ---------------------------------------------- */}
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17701055847');
          `}
        </Script>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17701055847"
          strategy="lazyOnload"
        />

        {/* ---------------------------------------------- */}
        {/*  MICROSOFT CLARITY (Optimized)                 */}
        {/* ---------------------------------------------- */}
        <Script id="clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "u4421jiovp");
          `}
        </Script>
      </body>
    </html>
  );
}
