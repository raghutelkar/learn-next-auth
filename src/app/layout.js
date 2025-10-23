import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from 'next-auth/react'

import { dbConnect } from "@/lib/mongo";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Next-Auth V5 - tapaScript",
  description: "Learn Next-Auth Practically",
};

export default async function RootLayout({ children }) {
  const conn = await dbConnect();
  return (
    <html lang="en">
      <body className={inter.className}>
      <SessionProvider>
        {children}
      </SessionProvider>
      </body>
    </html>
  );
}
