import "./globals.css";
import { AuraProvider } from "@/lib/store";

export const metadata = {
  title: "Aura — Style Vault",
  description: "Eight aesthetics, every piece linked. Find looks that already sound like you.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0910",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="field" aria-hidden="true">
          <div className="orb orb-a" /><div className="orb orb-b" /><div className="grain" />
        </div>
        <AuraProvider>{children}</AuraProvider>
      </body>
    </html>
  );
}
