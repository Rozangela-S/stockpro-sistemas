import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stock Systems | Controle de Estoque",
  description: "Sistemas de controle de estoque por nicho.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}