import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const fixel = localFont({ src: "../public/FixelText-Regular.woff2" });

export const metadata: Metadata = {
  title: "Roots of resilience questionnaire",
  description: "Kateryna Lopatiuk, Elizabeth Wood, MIT DUSP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fixel.className}>{children}</body>
    </html>
  );
}
