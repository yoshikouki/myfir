import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/src/components/ui/ErrorBoundary";
import { GlobalLevelUpNotification } from "@/src/components/ui/GlobalLevelUpNotification";
import { PlayerProvider } from "@/src/contexts/PlayerContext";
import { setupGlobalErrorHandlers } from "@/src/lib/errorHandling";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyFir - はじめての パソコン がくしゅう",
  description: "3-6さいの おともだちが たのしく パソコンを まなべる ウェブサイトです",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // グローバルエラーハンドラーのセットアップ
  if (typeof window !== "undefined") {
    setupGlobalErrorHandlers();
  }

  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ErrorBoundary level="app">
          <PlayerProvider>
            {children}
            <GlobalLevelUpNotification />
          </PlayerProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
