import { Outfit } from "next/font/google";
import "./globals.css";
import { SessionProvider } from 'next-auth/react'

import { dbConnect } from "@/lib/mongo";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "SampurnahSync App",
  description: "Track yoga sessions, monitor teacher contributions, and streamline studio management — all in one place.",
};

export default async function RootLayout({ children }) {
  const conn = await dbConnect();
  return (
    <html lang="en">
      <body className={outfit.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
