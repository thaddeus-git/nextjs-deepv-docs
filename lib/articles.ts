// lib/articles.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fetchArticleIndex, fetchArticleContent } from './content-fetcher'

export interface Article {
  slug: string
  title: string
  category: string
  subcategory: string
  description: string
  tags: string | string[]  // Support both formats for backward compatibility
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  readTime: number
  lastUpdated: string
  featured?: boolean
  content?: string
}

export async function getAllArticles(): Promise<Article[]> {
  try {
    const index = await fetchArticleIndex()
    return index.articles as Article[]
  } catch (error) {
    console.error('Error fetching articles:', error)
    // Fallback to local file
    try {
      const localIndex = await import('@/content/config/article-index.json')
      return localIndex.default.articles as Article[]
    } catch (localError) {
      console.error('Local fallback failed:', localError)
      return []
    }
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    // Get article metadata from index first
    const index = await fetchArticleIndex()
    const articleMeta = index.articles.find(a => a.slug === slug)
    
    if (!articleMeta) {
      return null
    }

    // Fetch content from external repository or local fallback
    let fileContent: string
    try {
      fileContent = await fetchArticleContent(articleMeta.filename)
    } catch (error) {
      console.error(`Error fetching external content for ${articleMeta.filename}:`, error)
      // Fallback to local file
      const filePath = path.join(process.cwd(), 'content/guides', articleMeta.filename)
      
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`)
        return null
      }
      fileContent = fs.readFileSync(filePath, 'utf8')
    }

    const { data, content } = matter(fileContent)

    return {
      ...articleMeta,
      content,
      ...data // Allow frontmatter to override
    } as Article
  } catch (error) {
    console.error(`Error loading article ${slug}:`, error)
    return null
  }
}

export async function getArticlesByCategory(category: string, subcategory?: string): Promise<Article[]> {
  const allArticles = await getAllArticles()
  
  return allArticles.filter(article => {
    if (subcategory) {
      return article.category === category && article.subcategory === subcategory
    }
    return article.category === category
  })
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const allArticles = await getAllArticles()
  return allArticles.filter(article => article.featured)
}

export async function searchArticles(query: string): Promise<Article[]> {
  const allArticles = await getAllArticles()
  const searchTerm = query.toLowerCase()
  
  return allArticles.filter(article => {
    const tags = Array.isArray(article.tags) ? article.tags : article.tags.split(',').map(t => t.trim())
    
    return article.title.toLowerCase().includes(searchTerm) ||
      article.description.toLowerCase().includes(searchTerm) ||
      tags.some(tag => tag.toLowerCase().includes(searchTerm))
  })
}
