import type { Metadata } from "next";
import { Geist, Geist_Mono, Permanent_Marker, Caveat } from "next/font/google";
import { Provider } from "@/components/ui/provider";

const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-permanent-marker",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inspirational Quote App",
  description: "Generate Inspirational Quotes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${permanentMarker.variable} ${caveat.variable}`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
