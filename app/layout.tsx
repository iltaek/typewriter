import type { Metadata } from 'next';
import { GeistMono } from 'geist/font';
import './globals.css';

export const metadata: Metadata = {
  title: 'TypeWriter',
  description: 'Practice typing with New York Times articles',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistMono.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
