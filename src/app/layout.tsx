import type { Metadata } from 'next';
import './globals.css';
import StoreInitializer from '@/components/shared/StoreInitializer';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'VibeHack',
  description: 'A next-generation hackathon platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <StoreInitializer />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
