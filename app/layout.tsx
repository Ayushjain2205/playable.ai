import type { Metadata } from "next";
import PlausibleProvider from "next-plausible";
import { Providers } from "./providers";
import "./globals.css";

let title = "Playable.ai ";
let description = "Create games with prompts";
let url = "https://playable.ai/";
let ogimage = "https://playable.ai/og-image.png";
let sitename = "playable.ai";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <PlausibleProvider domain="playable.ai" />
      </head>
      <body className="h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
