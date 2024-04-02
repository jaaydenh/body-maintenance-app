import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import Header from "@/components/Header";
import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${inter.variable} min-h-screen bg-[#2e026d] bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white antialiased`}
      >
        <TRPCReactProvider>
          <Header />
          {children}
        </TRPCReactProvider>
        <Analytics />
      </body>
    </html>
  );
}
