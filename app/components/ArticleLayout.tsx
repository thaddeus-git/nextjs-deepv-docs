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
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800', 
    advanced: 'bg-red-100 text-red-800'
  }

  return (
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
                <span className="text-gray-500 text-sm">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-blue-600 hover:text-blue-800 text-sm">
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[article.difficulty]}`}>
            {article.difficulty}
          </span>
          <span>{article.readTime} min read</span>
          <span>Updated {new Date(article.lastUpdated).toLocaleDateString()}</span>
        </div>
        
        <p className="text-lg text-gray-700">{article.description}</p>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {(() => {
            const tags = Array.isArray(article.tags) ? article.tags : article.tags.split(',').map(t => t.trim()).filter(t => t)
            return tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {tag}
              </span>
            ))
          })()}
        </div>
      </header>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none">
        {children}
      </article>
    </div>
  )
}
