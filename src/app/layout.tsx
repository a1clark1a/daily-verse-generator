import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Permanent_Marker, Caveat, Source_Code_Pro } from "next/font/google";
import { Provider } from "@/components/ui/provider";
import { GoogleAnalytics } from "@/components/googleAnalytics/GoogleAnalytics";

const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-permanent-marker",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["200"],
  variable: "--font-source-code-pro",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0A4D4E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  // Also supported but less commonly used
  // interactiveWidget: 'resizes-visual',
};

export const metadata: Metadata = {
  title: "Daily Verse - Bible Verse Generator",
  description: "Generate and share daily inspirational Bible verses",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/180x180.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Daily Verse",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Daily Verse",
    title: "Daily Verse - Bible Verse Generator",
    description: "Generate and share daily inspirational Bible verses",
  },
  twitter: {
    card: "summary",
    title: "Daily Verse - Bible Verse Generator",
    description: "Generate and share daily inspirational Bible verses",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${permanentMarker.variable} ${caveat.variable} ${sourceCodePro.variable}`}
        suppressHydrationWarning
      >
        <Provider>{children}</Provider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
