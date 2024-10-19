import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Tasty Temple',
  description: 'Discover delicious recipes and culinary inspiration',
  openGraph: {
    title: 'Tasty Temple',
    description: 'Discover delicious recipes and culinary inspiration',
    url: 'https://tastytemple.com',
    siteName: 'Tasty Temple',
    images: [
      {
        url: 'https://tastytemple.com/cover.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tasty Temple',
    description: 'Discover delicious recipes and culinary inspiration',
    images: ['https://tastytemple.com/cover.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
