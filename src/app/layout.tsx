import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/components/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { ScrollToTop } from "@/components/ScrollToTop";
import { LanguageProvider } from "@/i18n";

export const metadata: Metadata = {
  title: "Flap Agent | AI Agent Builder",
  description: "Professional AI Agent Builder and Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <ScrollToTop />
              {children}
              <AuthModal />
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
