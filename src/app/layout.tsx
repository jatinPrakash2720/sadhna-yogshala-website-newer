import type { Metadata } from "next";
import { Inter, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Sadhna Yogshala | Online Yoga & Wellness",
  description: "Transform your life with expert-led online yoga, meditation, and breathwork courses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-cream-50 text-gray-900 selection:bg-brand-100 selection:text-brand-900 dark:bg-[#0a120a] dark:text-sage-100 dark:selection:bg-brand-900 dark:selection:text-brand-100">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
