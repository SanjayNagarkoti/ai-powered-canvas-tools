"use client";
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './styles/theme';
import { Layout } from './components';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sketchify - AI-Powered Drawing Tool',
  description: 'Transform your sketches into reality with AI-powered tools',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  )
}