import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import db from "@/lib/supabase/db";
import { ThemeProvider } from "@/lib/provider/next-theme-provider";
import { SupabaseUserProvider } from "@/lib/provider/supabase-user-provider";
import { ToastProvider } from "@/components/ui/toast";
import AppStateProvider from "@/lib/provider/state-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cypress",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  db;
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark" attribute="class" enableSystem>
          <AppStateProvider>
            <SupabaseUserProvider>
              {children}
              <ToastProvider />
            </SupabaseUserProvider>
          </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
