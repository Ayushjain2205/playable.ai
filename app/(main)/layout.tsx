import Providers from "@/app/(main)/providers";
import { Toaster } from "@/components/ui/toaster";
import {
  DotGothic16,
  Plus_Jakarta_Sans,
  Pixelify_Sans,
} from "next/font/google";

// Heading font - playful/brand
const dotGothic16 = DotGothic16({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-heading",
});

// Display font - bold, industrial feel
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-jakarta",
});

// Pixel font for retro/arcade style
const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-pixel",
});

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`font-pixel min-h-screen font-display font-heading ${dotGothic16.variable} ${jakarta.variable} ${pixelifySans.variable}`}
    >
      <Providers>
        {children}
        <Toaster />
      </Providers>
    </div>
  );
}
