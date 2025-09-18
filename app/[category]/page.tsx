// app/[category]/page.tsx
import { getArticlesByCategory } from '@/lib/articles'
import { getAllCategoriesAsync, getAllCategories } from '@/lib/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import MobileMenu from '../components/MobileMenu'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  try {
    const categories = await getAllCategoriesAsync()
    if (categories.length > 0) {
      return categories.map((category) => ({
        category: category.id,
      }))
    }
  } catch (error) {
    console.error('Failed to fetch categories for static generation:', error)
  }
  
  // Fallback to hardcoded categories to ensure routes are always generated (Next.js best practice)
  const { getAllCategories } = await import('@/lib/navigation')
  const fallbackCategories = getAllCategories()
  console.log('🔄 Using fallback categories for static generation:', fallbackCategories.map(c => c.id))
  
  return fallbackCategories.map((category) => ({
    category: category.id,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const categories = await getAllCategoriesAsync()
  const category = categories.find(cat => cat.id === resolvedParams.category)
  
  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.title} | DeepV Docs`,
    description: category.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  
  // Try async first, fallback to sync categories
  let categories = await getAllCategoriesAsync()
  if (categories.length === 0) {
    categories = getAllCategories()
  }
  
  const category = categories.find(cat => cat.id === resolvedParams.category)
  
  if (!category) {
    notFound()
  }

  const articles = await getArticlesByCategory(resolvedParams.category)
  
  // Group articles by subcategory
  const articlesBySubcategory = category.subcategories.reduce((acc, sub) => {
    acc[sub.id] = articles.filter(article => article.subcategory === sub.id)
    return acc
  }, {} as Record<string, typeof articles>)

  return (
    <div className="min-h-screen bg-white">
      <MobileMenu />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{category.title}</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {category.title}
          </h1>
          <p className="text-lg text-gray-600">
            {category.description}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {articles.length} articles available
          </p>
        </div>

        {/* Subcategories Grid */}
        <div className="grid gap-8">
          {category.subcategories.map((subcategory) => {
            const subcategoryArticles = articlesBySubcategory[subcategory.id] || []
            
            return (
              <div key={subcategory.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: subcategory.color }}
                    />
                    <h2 className="text-xl font-semibold text-gray-900">
                      {subcategory.title}
                    </h2>
                    <span className="text-sm text-gray-500">
                      ({subcategoryArticles.length} articles)
                    </span>
                  </div>
                  {subcategoryArticles.length > 0 && (
                    <Link
                      href={`/${resolvedParams.category}/${subcategory.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View all →
                    </Link>
                  )}
                </div>

                {subcategoryArticles.length === 0 ? (
                  <p className="text-gray-500 text-sm">No articles yet</p>
                ) : (
                  <div className="grid gap-4">
                    {subcategoryArticles.slice(0, 3).map((article) => (
                      <Link
                        key={article.slug}
                        href={`/guides/${article.slug}-${article.id}`}
                        className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">
                              {article.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {article.description}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className={`px-2 py-1 rounded-full ${
                                article.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                                article.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {article.difficulty}
                              </span>
                              <span>{article.readTime} min read</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {subcategoryArticles.length > 3 && (
                      <Link
                        href={`/${resolvedParams.category}/${subcategory.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800 text-center py-2"
                      >
                        View {subcategoryArticles.length - 3} more articles →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}