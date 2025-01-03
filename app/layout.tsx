import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Blogify",
  description: "A blog platform built where you can write and share your thoughts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <Providers>
        <Toaster position="bottom-right" richColors />
          <Header />
           {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
