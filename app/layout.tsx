import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import DashboardLayout from '@/components/layouts/DashboardLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Modern Dashboard',
  description: 'A modern dashboard application built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}