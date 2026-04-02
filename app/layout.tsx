import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ShadowLens | Shadow AI Visibility Dashboard',
  description: 'Discover, score, and manage shadow AI usage in one dashboard.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
