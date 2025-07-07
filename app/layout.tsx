import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import ModalProvider from "@/providers/modal-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Cybermind - Job Portal",
  description:
    " A smart job portal connecting tech talent with top opportunities through AI-driven matching",
  icons: "/app/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`w-full antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={false}
          storageKey="cyberworks-theme"
        >
          <ModalProvider />
          {children}
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
