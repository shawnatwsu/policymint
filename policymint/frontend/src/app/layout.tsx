import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "../context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PolicyMint - AI-Driven Policy Generator",
  description: "Generate professional privacy policies and terms of service with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <AuthProvider>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="py-6 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} PolicyMint. All rights reserved.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
} 