import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { GeistMono } from 'geist/font/mono';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ThemeSwitch } from '@/components/ui/theme-switch';
import './globals.css';

export const metadata: Metadata = {
  title: 'TypeWriter',
  description: 'Practice typing with New York Times articles',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistMono.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeSwitch className="fixed top-4 right-4 z-50" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
