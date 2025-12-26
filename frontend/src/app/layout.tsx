import type { Metadata } from "next";
import { Header } from "./components/Header";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "UrbanScore",
  description:
    "Découvrez le classement des quartiers. Explorez et comparez les scores urbains pour trouver le quartier idéal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={poppins.variable}>
        <Header />
        {children}
      </body>
    </html>
  );
}
