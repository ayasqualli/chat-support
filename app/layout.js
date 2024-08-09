import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import {SpeedInsights} from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BotBuddy",
  description: "Your friendly AI assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" claassName="light">
      <body className={inter.className}>{children}</body>
      <Analytics />
      <SpeedInsights />
    </html>
  );
}
