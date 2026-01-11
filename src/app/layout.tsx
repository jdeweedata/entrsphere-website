import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://entrsphere.com"),
  title: {
    default: "EntrSphere | Protect Your Profits with AI-Native Development Frameworks",
    template: "%s | EntrSphere",
  },
  description:
    "Stop losing R20,000-R50,000 per project on rework. EntrSphere provides AI-native frameworks that turn vague ideas into production-ready specs. For agencies, founders, and product teams.",
  keywords: [
    "AI development",
    "product requirements",
    "PRD templates",
    "discovery framework",
    "scope creep",
    "software development",
    "AI automation",
    "South Africa",
  ],
  authors: [{ name: "EntrSphere" }],
  creator: "EntrSphere",
  publisher: "EntrSphere",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://entrsphere.com",
    siteName: "EntrSphere",
    title: "EntrSphere | Protect Your Profits with AI-Native Development Frameworks",
    description:
      "Stop losing R20,000-R50,000 per project on rework. AI-native frameworks that turn vague ideas into production-ready specs.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EntrSphere - AI-Native Development Frameworks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@entrsphere",
    creator: "@entrsphere",
    title: "EntrSphere | Protect Your Profits with AI-Native Development Frameworks",
    description:
      "Stop losing R20,000-R50,000 per project on rework. AI-native frameworks that turn vague ideas into production-ready specs.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "EntrSphere",
              url: "https://entrsphere.com",
              logo: "https://entrsphere.com/favicon.png",
              description:
                "AI-native development frameworks that turn vague ideas into production-ready specs. For agencies, founders, and product teams.",
              contactPoint: {
                "@type": "ContactPoint",
                email: "hello@entrsphere.com",
                contactType: "customer service",
              },
              sameAs: ["https://twitter.com/entrsphere"],
              address: {
                "@type": "PostalAddress",
                addressCountry: "ZA",
              },
            }),
          }}
        />
        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "EntrSphere",
              url: "https://entrsphere.com",
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
