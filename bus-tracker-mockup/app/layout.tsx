import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BusTrack — Live school bus tracking",
  description:
    "Mockup of a live bus tracking platform for parents and operating entities (schools, transport providers).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
