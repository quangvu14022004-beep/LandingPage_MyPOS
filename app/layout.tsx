import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { LanguageProvider } from "@/lib/LanguageContext";

export const metadata: Metadata = {
  title: "myPOS - Quản lý kinh doanh cho hộ kinh doanh Việt Nam",
  description: "myPOS là công cụ quản lý hoàn chỉnh dành cho hộ kinh doanh.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}