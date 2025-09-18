// app/[category]/[subcategory]/page.tsx
import { getArticlesByCategory } from '@/lib/articles'
import { getAllCategoriesAsync, getAllCategories } from '@/lib/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface SubcategoryPageProps {
  params: { 
    category: string
    subcategory: string 
  }
}

export async function generateStaticParams() {
  const params: { category: string; subcategory: string }[] = []
  
  try {
    const categories = await getAllCategoriesAsync()
    if (categories.length > 0) {
      categories.forEach((category) => {
        category.subcategories.forEach((subcategory) => {
          params.push({
            category: category.id,
            subcategory: subcategory.id,
          })
        })
      })
      return params
    }
  } catch (error) {
    console.error('Failed to fetch categories for subcategory static generation:', error)
  }
  
  // Fallback to hardcoded categories
  const { getAllCategories } = await import('@/lib/navigation')
  const fallbackCategories = getAllCategories()
  
  fallbackCategories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      params.push({
        category: category.id,
        subcategory: subcategory.id,
      })
    })
  })
  
  console.log('🔄 Using fallback categories for subcategory static generation')
  return params
}

export async function generateMetadata({ params }: SubcategoryPageProps) {
  const resolvedParams = await params
  const categories = await getAllCategoriesAsync()
  const category = categories.find(cat => cat.id === resolvedParams.category)
  const subcategory = category?.subcategories.find(sub => sub.id === resolvedParams.subcategory)
  
  if (!category || !subcategory) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: `${subcategory.title} | ${category.title} | DeepV Docs`,
    description: `${subcategory.title} articles and tutorials in ${category.title}`,
  }
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const resolvedParams = await params
  
  // Try async first, fallback to sync categories
  let categories = await getAllCategoriesAsync()
  if (categories.length === 0) {
    categories = getAllCategories()
  }
  
  const category = categories.find(cat => cat.id === resolvedParams.category)
  const subcategory = category?.subcategories.find(sub => sub.id === resolvedParams.subcategory)
  
  if (!category || !subcategory) {
    notFound()
  }

  const articles = await getArticlesByCategory(resolvedParams.category, resolvedParams.subcategory)
  
  // Sort articles by date (newest first)
  const sortedArticles = articles.sort((a, b) => 
    new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${resolvedParams.category}`} className="hover:text-gray-700">
            {category.title}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{subcategory.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div 
              className="w-6 h-6 rounded"
              style={{ backgroundColor: subcategory.color }}
            />
            <h1 className="text-3xl font-bold text-gray-900">
              {subcategory.title}
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-2">
            {subcategory.title} articles and tutorials
          </p>
          <p className="text-sm text-gray-500">
            {articles.length} articles available
          </p>
        </div>

        {/* Articles List */}
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No articles found in this category yet.</p>
            <Link
              href={`/${resolvedParams.category}`}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to {category.title}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedArticles.map((article) => (
              <article
                key={article.slug}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <Link href={`/guides/${article.slug}`} className="block">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {article.title}
                    </h2>
                    {article.featured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {article.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full ${
                        article.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        article.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {article.difficulty}
                      </span>
                      <span className="text-gray-500">{article.readTime} min read</span>
                      {article.tags && (
                        <div className="flex flex-wrap gap-1">
                          {(() => {
                            const tags = Array.isArray(article.tags) ? article.tags : article.tags.split(',').map(t => t.trim()).filter(t => t)
                            return tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))
                          })()}
                          {(() => {
                            const tags = Array.isArray(article.tags) ? article.tags : article.tags.split(',').map(t => t.trim()).filter(t => t)
                            return tags.length > 3 && (
                              <span className="text-gray-500 text-xs">
                                +{tags.length - 3} more
                              </span>
                            )
                          })()}
                        </div>
                      )}
                    </div>
                    <time className="text-gray-500">
                      {new Date(article.lastUpdated).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}