// app/page.tsx
import Link from 'next/link'
import { getAllCategories } from '@/lib/navigation'
import { getFeaturedArticles } from '@/lib/articles'

export default async function HomePage() {
  const categories = getAllCategories()
  const featuredArticles = await getFeaturedArticles()

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          DeepV Code Documentation
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive programming guides and tutorials. Find solutions to your coding challenges with practical examples and performance comparisons.
        </p>
      </header>

      {/* Categories Grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <Link
              key={category.id}
              href={`/${category.id}`}
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {category.title}
              </h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <div className="flex flex-wrap gap-2">
                {category.subcategories.slice(0, 3).map(sub => (
                  <span 
                    key={sub.id}
                    className="px-2 py-1 text-xs rounded-full"
                    style={{ backgroundColor: sub.color + '20', color: sub.color }}
                  >
                    {sub.title}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Guides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map(article => (
              <Link
                key={article.slug}
                href={`/guides/${article.slug}`}
                className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4">{article.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{article.readTime} min read</span>
                  <span className="capitalize">{article.difficulty}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
