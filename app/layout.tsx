import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fashionboxe | Cinematic Live Commerce",
  description: "Experience the runway in real-time. Direct-from-stage ordering and virtual personal shoppers for the most exclusive fashion brands.",
  keywords: ["fashion", "live commerce", "runway", "luxury shopping", "virtual personal shopper"],
  openGraph: {
    title: "Fashionboxe | Disrupting the Runway",
    description: "The next generation of high-fashion shopping concessions with real-time virtual showrooms.",
    url: "https://fashionboxe.com",
    siteName: "Fashionboxe",
    images: [
      {
        url: "/og-image.png", // Ensure this exists in public or use a full URL
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fashionboxe | Cinematic Live Commerce",
    description: "Direct-from-stage ordering and virtual personal shoppers.",
    images: ["/og-image.png"],
  },
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scrollbar-hide">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased selection:bg-accent selection:text-black`}
      >
        <Toaster position="bottom-right" />
        {children}
      </body>
    </html>
  );
}
