// app/guides/[slug-id]/page.tsx
import { getArticleBySlugId, getAllArticles } from '@/lib/articles'
import ArticleLayout from '@/app/components/ArticleLayout'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

// Enable ISR with revalidation
export const revalidate = 3600 // Revalidate every hour
export const dynamicParams = true // Allow dynamic generation of non-prebuilt pages

// Only pre-render featured articles at build time for faster deployment
export async function generateStaticParams() {
  try {
    const articles = await getAllArticles()
    const featuredArticles = articles.filter(article => article.featured).slice(0, 10)
    
    return featuredArticles.map((article) => ({
      'slug-id': `${article.slug}-${article.id}`,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return [] // Return empty array if fetching fails
  }
}

interface GuidePageProps {
  params: {
    'slug-id': string
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const resolvedParams = await params
  const article = await getArticleBySlugId(resolvedParams['slug-id'])
  
  if (!article || !article.content) {
    notFound()
  }

  return (
    <ArticleLayout article={article}>
      <MDXRemote source={article.content} />
    </ArticleLayout>
  )
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