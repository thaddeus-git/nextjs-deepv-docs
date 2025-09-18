// app/guides/[slug-id]/page.tsx
import { getArticleBySlugId, getAllArticles } from '@/lib/articles'
import ArticleLayout from '@/app/components/ArticleLayout'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/app/components/MDXComponents'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

// Enable ISR with revalidation
export const revalidate = 3600 // Revalidate every hour
export const dynamicParams = true // Allow dynamic generation of non-prebuilt pages

// Pre-render all articles for reliable production deployment
export async function generateStaticParams() {
  try {
    const articles = await getAllArticles()
    // Pre-render ALL articles to ensure reliability
    // This follows Next.js best practices for small to medium content sets
    console.log(`📦 Pre-rendering ${articles.length} articles for static generation`)
    
    return articles.map((article) => ({
      'slug-id': `${article.slug}-${article.id}`,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    // Fallback: return empty array and rely on ISR
    return []
  }
}

interface GuidePageProps {
  params: Promise<{
    'slug-id': string
  }>
}

export default async function GuidePage({ params }: GuidePageProps) {
  const resolvedParams = await params
  
  try {
    const article = await getArticleBySlugId(resolvedParams['slug-id'])
    
    if (!article) {
      console.error(`Article not found for slug-id: ${resolvedParams['slug-id']}`)
      notFound()
    }

    if (!article.content) {
      console.error(`Article content missing for: ${article.title} (${article.id})`)
      notFound()
    }

    return (
      <ArticleLayout article={article}>
        <MDXRemote 
          source={article.content} 
          components={mdxComponents}
        />
      </ArticleLayout>
    )
  } catch (error) {
    console.error(`Error loading article ${resolvedParams['slug-id']}:`, error)
    notFound()
  }
}

// Generate metadata for each article
export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const resolvedParams = await params
  const article = await getArticleBySlugId(resolvedParams['slug-id'])
  
  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: `${article.title} | DeepV Docs`,
    description: article.description,
    keywords: Array.isArray(article.tags) ? article.tags.join(', ') : article.tags,
    authors: [{ name: 'DeepV Code' }],
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.lastUpdated,
      tags: Array.isArray(article.tags) ? article.tags : [article.tags],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  }
}