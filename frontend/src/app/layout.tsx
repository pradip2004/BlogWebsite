import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import { AppProvider } from "@/context/AppContext";


export const metadata: Metadata = {
  title: "DevStories",
  description: "A platform for developers to share their stories and experiences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-primary">
        <AppProvider>
          <Navbar />
          <div className="w-full">
            {children}
          </div>
        </AppProvider>


      </body>
    </html>
  );
}