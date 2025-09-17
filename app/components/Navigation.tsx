// app/components/Navigation.tsx
'use client'

import Link from 'next/link'
import { getAllCategories } from '@/lib/navigation'
import { useState, useEffect } from 'react'
import SearchBox from './SearchBox'
import { Article } from '@/lib/articles'

export default function Navigation() {
  const categories = getAllCategories()
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    // Load articles from static data for search
    import('@/content/config/article-index.json')
      .then(data => setArticles(data.articles as Article[]))
      .catch(() => setArticles([]))
  }, [])

  return (
    <nav className="w-64 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-4">
        <Link href="/" className="text-xl font-bold text-gray-900 mb-6 block">
          DeepV Code
        </Link>
        
        {/* Search Box */}
        <div className="mb-6">
          <SearchBox articles={articles} />
        </div>
        
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category.id}>
              <button
                onClick={() => setExpandedCategory(
                  expandedCategory === category.id ? null : category.id
                )}
                className="flex items-center justify-between w-full text-left px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                {category.title}
                <svg 
                  className={`w-4 h-4 transition-transform ${
                    expandedCategory === category.id ? 'rotate-90' : ''
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {expandedCategory === category.id && (
                <div className="ml-4 mt-1 space-y-1">
                  {category.subcategories.map(subcategory => (
                    <Link
                      key={subcategory.id}
                      href={`/${category.id}/${subcategory.id}`}
                      className="block px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      {subcategory.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link 
            href="/guides" 
            className="block px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            All Guides
          </Link>
        </div>
      </div>
    </nav>
  )
}
