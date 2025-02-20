import { Inter } from 'next/font/google';
import './globals.css'

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Sketchify - AI Canvas Assistant',
  description: 'Transform your sketches into insights with AI-powered analysis',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
        />
      </head>
      <body className={inter.className}>
        <div className="font-sans">
          {children}
        </div>
      </body>
    </html>
  );
} 