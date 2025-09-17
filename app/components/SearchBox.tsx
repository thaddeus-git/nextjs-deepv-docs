'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Article } from '@/lib/articles'

interface SearchBoxProps {
  articles: Article[]
}

export default function SearchBox({ articles }: SearchBoxProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Article[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    const searchTerm = query.toLowerCase()
    const filteredArticles = articles.filter(article => {
      const tags = Array.isArray(article.tags) ? article.tags : article.tags.split(',').map(t => t.trim())
      
      return article.title.toLowerCase().includes(searchTerm) ||
        article.description.toLowerCase().includes(searchTerm) ||
        tags.some(tag => tag.toLowerCase().includes(searchTerm))
    }).slice(0, 5) // Limit to 5 results

    setResults(filteredArticles)
    setIsOpen(filteredArticles.length > 0)
  }, [query, articles])

  const handleResultClick = () => {
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
          <div className="py-2">
            {results.map((article) => (
              <Link
                key={article.slug}
                href={`/guides/${article.slug}`}
                onClick={handleResultClick}
                className="block px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {article.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-gray-500">
                        {article.category} → {article.subcategory}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        article.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        article.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {article.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {query && results.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">
              No articles found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  )
}