import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alumo',
  description: 'University Learning Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}