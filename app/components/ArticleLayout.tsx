// app/components/ArticleLayout.tsx
import { Article } from '@/lib/articles'
import { generateBreadcrumbs } from '@/lib/navigation'
import Link from 'next/link'

interface ArticleLayoutProps {
  article: Article
  children: React.ReactNode
}

export default function ArticleLayout({ article, children }: ArticleLayoutProps) {
  const breadcrumbs = generateBreadcrumbs(article.category, article.subcategory, article.title)
  
  const difficultyColors = {
    beginner: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    intermediate: 'bg-amber-100 text-amber-800 border-amber-200', 
    advanced: 'bg-red-100 text-red-800 border-red-200'
  }

  const difficultyIcons = {
    beginner: '🟢',
    intermediate: '🟡',
    advanced: '🔴'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.href} className="flex items-center">
                {index > 0 && (
                  <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-500 text-sm font-medium">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Article Header */}
          <header className="px-8 pt-8 pb-6 border-b border-gray-100">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">{article.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${difficultyColors[article.difficulty]}`}>
                <span>{difficultyIcons[article.difficulty]}</span>
                {article.difficulty}
              </div>
              
              <div className="flex items-center gap-1 text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">{article.readTime} min read</span>
              </div>
              
              <div className="flex items-center gap-1 text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Updated {new Date(article.lastUpdated).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-6">{article.description}</p>
            
            <div className="flex flex-wrap gap-2">
              {(() => {
                const tags = Array.isArray(article.tags) ? article.tags : article.tags.split(',').map(t => t.trim()).filter(t => t)
                return tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-md border border-blue-200 hover:bg-blue-100 transition-colors">
                    {tag}
                  </span>
                ))
              })()}
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none px-8 py-8">
            {children}
          </article>

          {/* Article Footer */}
          <footer className="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span>Last updated: {new Date(article.lastUpdated).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <Link 
                href="/guides" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to all guides
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
