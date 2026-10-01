import type { Metadata } from "next";
import { Cormorant_Garamond, Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { LuxuryNavbar } from "@/components/LuxuryNavbar";
import { LuxuryFooter } from "@/components/LuxuryFooter";
import { Providers } from "@/components/Providers";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-cinzel",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AURA Luxury Fragrances",
  description: "Perfumería importada y original. Fragancias que se reconocen antes de olerlas.",
  openGraph: {
    title: "AURA Luxury Fragrances",
    description: "Perfumería importada y original.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${cinzel.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Providers>
          <LuxuryNavbar />
          <main className="flex-grow">{children}</main>
          <LuxuryFooter />
        </Providers>
      </body>
    </html>
  );
}
