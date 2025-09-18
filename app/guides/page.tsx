import { getAllArticles } from '@/lib/articles'
import { getAllCategories } from '@/lib/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'


export const metadata = {
  title: 'All Guides | DeepV Code',
  description: 'Browse all our technical guides and tutorials on programming, databases, mobile development, and more.',
}

export const revalidate = 300 // 5 minutes

export default async function GuidesPage() {
  try {
    const articles = await getAllArticles()
    const categories = getAllCategories()

    if (!articles || articles.length === 0) {
      return (
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">All Guides</h1>
          <p className="text-gray-600">No guides available at the moment. Please check back later.</p>
        </div>
      )
    }

    // Group articles by category
    const articlesByCategory = articles.reduce((acc, article) => {
      if (!acc[article.category]) {
        acc[article.category] = []
      }
      acc[article.category].push(article)
      return acc
    }, {} as Record<string, typeof articles>)

    const difficultyColors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    }

    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Guides</h1>
          <p className="text-xl text-gray-600">
            Explore our comprehensive collection of technical guides and tutorials.
          </p>
          <div className="mt-6 flex items-center space-x-4 text-sm text-gray-500">
            <span>{articles.length} total guides</span>
            <span>•</span>
            <span>{Object.keys(articlesByCategory).length} categories</span>
          </div>
        </div>

        {/* Category Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map(category => {
            const categoryArticles = articlesByCategory[category.id] || []
            return (
              <Link
                key={category.id}
                href={`/${category.id}`}
                className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                <div className="text-blue-600 text-sm font-medium">
                  {categoryArticles.length} guide{categoryArticles.length !== 1 ? 's' : ''} →
                </div>
              </Link>
            )
          })}
        </div>

        {/* All Articles by Category */}
        {Object.entries(articlesByCategory).map(([categoryId, categoryArticles]) => {
          const category = categories.find(c => c.id === categoryId)
          if (!category) return null

          return (
            <div key={categoryId} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                <Link
                  href={`/${categoryId}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View all {categoryId.replace('-', ' ')} →
                </Link>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryArticles.slice(0, 6).map(article => (
                  <article key={article.slug} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[article.difficulty]}`}>
                        {article.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">{article.readTime} min</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                      <Link 
                        href={`/guides/${article.slug}-${article.id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {article.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          const tags = Array.isArray(article.tags) ? article.tags : article.tags.split(',').map(t => t.trim()).filter(t => t)
                          return tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {tag}
                            </span>
                          ))
                        })()}
                        {(() => {
                          const tags = Array.isArray(article.tags) ? article.tags : article.tags.split(',').map(t => t.trim()).filter(t => t)
                          return tags.length > 2 && (
                            <span className="text-xs text-gray-500">+{tags.length - 2}</span>
                          )
                        })()}
                      </div>
                      <time className="text-xs text-gray-500">
                        {new Date(article.lastUpdated).toLocaleDateString()}
                      </time>
                    </div>
                  </article>
                ))}
              </div>
              
              {categoryArticles.length > 6 && (
                <div className="mt-6 text-center">
                  <Link
                    href={`/${categoryId}`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View {categoryArticles.length - 6} more {category.title.toLowerCase()} guides
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  } catch (error) {
    console.error('Error loading guides:', error)
    notFound()
  }
}