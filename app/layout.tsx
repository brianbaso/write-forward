import { Metadata } from "next";
import { Toaster } from "sonner";

import { AnalysisProvider } from "@/app/context/AnalysisContext";
import { Navbar } from "@/components/custom/navbar";
import { ThemeProvider } from "@/components/custom/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://writeforward.io"),
  title: "Write Forward",
  description: "Your Journal, Your Story",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnalysisProvider>
            <Toaster position="top-center" />
            <Navbar />
            {children}
          </AnalysisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
