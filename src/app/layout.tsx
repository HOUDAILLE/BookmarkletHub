import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookmarkletHub",
  description: "Hébergez, partagez et découvrez des bookmarklets utiles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}