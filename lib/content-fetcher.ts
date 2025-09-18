// Content fetcher for external content repository
import { Article } from './articles';
import { createDevArticleIndex, getLocalArticlesForDev } from './dev-content-fallback';

const CONTENT_REPO_URL = process.env.NODE_ENV === 'development' 
  ? null  // Force fallback in development
  : (process.env.CONTENT_REPO_URL || 'https://api.github.com/repos/thaddeus-git/nextjs-deepv-content');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

interface GitHubFile {
  name: string;
  path: string;
  download_url: string;
  content?: string;
}

// Fetch article index from content repository
export async function fetchArticleIndex(): Promise<{
  lastUpdated: string;
  totalArticles: number;
  categories: string[];
  technologies: string[];
  articles: Article[];
}> {
  // In development, always use local fallback (Next.js best practice)
  if (process.env.NODE_ENV === 'development' || !CONTENT_REPO_URL) {
    console.log('🔄 Using local development data...');
    return createDevArticleIndex();
  }

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    // Fetch the article index file  
    const response = await fetch(`${CONTENT_REPO_URL}/contents/config/article-index.json`, {
      headers,
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch article index: ${response.status}`);
    }

    const fileData = await response.json();
    const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error fetching article index:', error);
    
    // Fallback to local data
    console.log('🔄 Falling back to local data...');
    return createDevArticleIndex();
  }
}

// Fetch individual article content
export async function fetchArticleContent(filename: string): Promise<string> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3.raw',
    };
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const response = await fetch(`${CONTENT_REPO_URL}/contents/guides/${filename}`, {
      headers,
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch article content: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error(`Error fetching article content for ${filename}:`, error);
    
    // In development, try to find the file in temp-files
    if (process.env.NODE_ENV === 'development') {
      const localArticles = getLocalArticlesForDev();
      const localArticle = localArticles.find(a => a.filename === filename);
      if (localArticle && localArticle.content) {
        console.log(`🔄 Using local content for ${filename}`);
        return localArticle.content;
      }
    }
    
    // No local fallback for article content in production build
    throw new Error(`Article not found: ${filename}`)
  }
}

interface CategoryData {
  id: string;
  title: string;
  description: string;
  subcategories: Array<{
    id: string;
    title: string;
    color: string;
  }>;
}

// Fetch categories configuration from content repository  
export async function fetchCategories(): Promise<{ categories: CategoryData[] }> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    // Fetch the categories config file
    const response = await fetch(`${CONTENT_REPO_URL}/contents/config/categories.json`, {
      headers,
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const fileData = await response.json();
    const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return empty structure for build-time when external content is not available
    return { categories: [] }
  }
}

// Fetch all article files from the content repository
export async function fetchAllArticleFiles(): Promise<GitHubFile[]> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const response = await fetch(`${CONTENT_REPO_URL}/contents/guides`, {
      headers,
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch article files: ${response.status}`);
    }

    const files = await response.json();
    return files.filter((file: GitHubFile) => file.name.endsWith('.mdx'));
  } catch (error) {
    console.error('Error fetching article files:', error);
    return [];
  }
}