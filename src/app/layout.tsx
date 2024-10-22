import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script'
import RecipeGenerationStatus from '@/components/RecipeGenerationStatus'

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
        url: 'https://tastytemple.com/og-image.jpg',
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
    images: ['https://tastytemple.com/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7456835418426502"
          crossOrigin="anonymous"
        />
        <meta property="og:image" content="https://tastytemple.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://tastytemple.com/og-image.jpg" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>
      <body className={inter.className}>
        <RecipeGenerationStatus />
        {children}
      </body>
      <Analytics />
    </html>
  )
}
