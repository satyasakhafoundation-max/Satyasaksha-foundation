import './globals.css'
import Navbar from '@/components/Navbar/Navbar'
import Footer from '@/components/Footer/Footer'
import RevealProvider from '@/components/RevealProvider'

export const metadata = {
  title: 'Satyasaksha Foundation | The Witness of Truth',
  description: 'A premium, modern foundation dedicated to protecting nature, supporting communities, and acting with compassion.',
  keywords: ['NGO', 'Foundation', 'Wildlife Conservation', 'Rural Education', 'Animal Welfare', 'Sustainability', 'India'],
  authors: [{ name: 'Satyasaksha Foundation' }],
  creator: 'Satyasaksha Foundation',
  publisher: 'Satyasaksha Foundation',
  openGraph: {
    title: 'Satyasaksha Foundation | The Witness of Truth',
    description: 'A premium, modern foundation dedicated to protecting nature, supporting communities, and acting with compassion.',
    url: 'https://satyasakshafoundation.org',
    siteName: 'Satyasaksha Foundation',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Satyasaksha Foundation Hero Image',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Satyasaksha Foundation',
    description: 'Protecting nature, supporting communities, and acting with compassion.',
    images: ['https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1200&auto=format&fit=crop'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <RevealProvider />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
