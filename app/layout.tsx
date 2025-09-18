import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DeepV Code - AI-Powered Technical Documentation',
  description: 'Comprehensive technical guides and tutorials on programming, databases, mobile development, and system administration. Learn with our AI-curated content.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900`}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <Link href="/" className="text-xl font-bold text-gray-900">
                    DeepV Code
                  </Link>
                </div>
                
                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8">
                  <Link href="/databases" className="text-gray-600 hover:text-gray-900">Databases</Link>
                  <Link href="/mobile" className="text-gray-600 hover:text-gray-900">Mobile</Link>
                  <Link href="/programming-languages" className="text-gray-600 hover:text-gray-900">Programming</Link>
                  <Link href="/system-devops" className="text-gray-600 hover:text-gray-900">DevOps</Link>
                  <Link href="/web-frontend" className="text-gray-600 hover:text-gray-900">Frontend</Link>
                  <Link href="/guides" className="text-gray-600 hover:text-gray-900">All Guides</Link>
                </nav>

                {/* Mobile menu button */}
                <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center">
                <p className="text-gray-600">
                  MIT {new Date().getFullYear()} © DeepV Code. AI-Powered Technical Documentation.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
