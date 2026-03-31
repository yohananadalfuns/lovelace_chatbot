import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import "./globals.css";
import { absoluteFilePath, baseURL } from "@/lib/utils";
import { logo } from "../../public/images";

export const metadata: Metadata = {
  title: "Lovelace AI — Your Intelligent Companion",
  description:
    "Engage with Lovelace, a clean, minimal AI chatbot designed to help you code, create, and explore. Fast, intuitive, and powered by gemini-2.5-flash-lite.",
  keywords: ["AI Chat", "Lovelace", "Next.js AI", "Chatbot", "Assistant"],
  robots: "index, follow",
  openGraph: {
    title: "Lovelace AI — Intelligent Conversations",
    description:
      "Start a conversation with Lovelace. Get help with coding, brainstorming, and deep technical questions in real-time.",
    images: [
      {
        url: `${baseURL}/og-image.jpg`,
        alt: "Lovelace AI Interface Preview",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lovelace AI",
    description: "Your next-generation AI assistant.",

    images: [`${baseURL}/og-image.jpg`],
  },
  icons: {
    icon: absoluteFilePath(logo.src).href,

    shortcut: absoluteFilePath(logo.src).href,

    apple: absoluteFilePath(logo.src).href,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0 }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
