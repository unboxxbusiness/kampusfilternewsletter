import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { ThemeProvider } from "@/providers/ThemeProvider";
import ServiceWorkerRegister from "@/components/layout/ServiceWorkerRegister";
import { InstallProvider } from "@/providers/InstallProvider";
import InstallGuideModal from "@/components/common/InstallGuideModal";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kampusfilter.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Kampus Filter - Student Intelligence Platform",
    template: "%s | Kampus Filter",
  },
  description: "Discover opportunities, scholarships, career frameworks, and future-skills intelligence for ambitious students.",
  icons: {
    icon: [
      {
        url: "https://res.cloudinary.com/dhrigocvd/image/upload/v1770054380/logo_Kampus_Filter_Png_ltv2j8.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "https://res.cloudinary.com/dhrigocvd/image/upload/v1770054380/logo_Kampus_Filter_Png_ltv2j8.png",
        type: "image/png",
      },
    ],
    shortcut: "https://res.cloudinary.com/dhrigocvd/image/upload/v1770054380/logo_Kampus_Filter_Png_ltv2j8.png",
  },
  alternates: {
    canonical: "./",
    types: {
      "application/rss+xml": `${baseUrl}/feed.xml`,
    },
  },
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
    title: "Kampus Filter - Student Intelligence Platform",
    description: "Discover opportunities, scholarships, career frameworks, and future-skills intelligence for ambitious students.",
    url: baseUrl,
    siteName: "Kampus Filter",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dhrigocvd/image/upload/v1770054380/logo_Kampus_Filter_Png_ltv2j8.png",
        width: 512,
        height: 512,
        alt: "Kampus Filter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kampus Filter - Student Intelligence Platform",
    description: "Discover opportunities, scholarships, career frameworks, and future-skills intelligence for ambitious students.",
    images: ["https://res.cloudinary.com/dhrigocvd/image/upload/v1770054380/logo_Kampus_Filter_Png_ltv2j8.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col justify-between">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <InstallProvider>
            <ServiceWorkerRegister />
            <ConditionalLayout>{children}</ConditionalLayout>
            <InstallGuideModal />
          </InstallProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
