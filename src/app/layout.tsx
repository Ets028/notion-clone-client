import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/components/providers/QueryProvider';
import { ThemeProvider } from '@/components/providers/ThemeProviders';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Notion Clone - Your Digital Workspace',
  description: 'A powerful note-taking and productivity app inspired by Notion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster position="top-right" richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}