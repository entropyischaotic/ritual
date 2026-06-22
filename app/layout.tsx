import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ritual — a digital altar",
  description: "a local-first digital altar for attention, reflection, and grounding",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
