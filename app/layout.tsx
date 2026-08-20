import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/app/components/language-provider";

export const metadata: Metadata = {
  title: "Al Salah | Find Your Next Home",
  description: "Discover homes, apartments, and rentals with Al Salah.",

  icons: {
    icon: "/icon.png",
  },

  openGraph: {
    title: "Al Salah | Find Your Next Home",
    description: "Discover homes, apartments, and rentals with Al Salah.",
    url: "https://www.al-salah.ma",
    siteName: "Al Salah",
    images: [
      {
        url: "https://www.al-salah.ma/al-salah-preview-v2.png",
        width: 1200,
        height: 630,
        alt: "Al Salah - Agence Immobilière",
      },
    ],
    locale: "fr_MA",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Al Salah | Find Your Next Home",
    description: "Discover homes, apartments, and rentals with Al Salah.",
    images: ["https://www.al-salah.ma/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}