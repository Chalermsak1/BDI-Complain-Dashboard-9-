import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: "Complaint Intelligence · เทศบาลนครขอนแก่น",
  description: "Smart City Complaint Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={sarabun.variable}>
      <body className="bg-[#F0F4F8]">
        {children}
      </body>
    </html>
  );
}
