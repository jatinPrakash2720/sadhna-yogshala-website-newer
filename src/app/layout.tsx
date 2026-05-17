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
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased text-gray-900 bg-white selection:bg-brand-100 selection:text-brand-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
