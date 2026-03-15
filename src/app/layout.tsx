import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "@/styles/globals.css";
import { ClientProviders } from "@/components/ClientProviders";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://entrsphere.com"),
  title: {
    default:
      "EntrSphere — I'll Tell You Exactly What's Broken and What to Fix First",
    template: "%s | EntrSphere",
  },
  description:
    "A 48-hour business audit. Fixed fee. No retainer. No fluff. Just a prioritized list of what to fix and in what order.",
  keywords: [
    "business audit",
    "online presence audit",
    "website review",
    "digital audit",
    "South Africa",
    "SME consulting",
    "business consulting",
    "fixed fee audit",
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
    title:
      "EntrSphere — I'll Tell You Exactly What's Broken and What to Fix First",
    description:
      "A 48-hour business audit. Fixed fee. No retainer. No fluff. Just a prioritized list of what to fix and in what order.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EntrSphere — Business Audit Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@entrsphere",
    creator: "@entrsphere",
    title:
      "EntrSphere — I'll Tell You Exactly What's Broken and What to Fix First",
    description:
      "A 48-hour business audit. Fixed fee. No retainer. No fluff. Just a prioritized list of what to fix and in what order.",
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
  themeColor: "#111519",
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
                "Fixed-fee business audits that tell you exactly what's broken in your online presence and what to fix first.",
              contactPoint: {
                "@type": "ContactPoint",
                email: "hello@entrsphere.com",
                contactType: "customer service",
              },
              address: {
                "@type": "PostalAddress",
                addressCountry: "ZA",
              },
            }),
          }}
        />
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
      <body
        className={`${inter.variable} ${instrumentSerif.variable} font-sans antialiased`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
