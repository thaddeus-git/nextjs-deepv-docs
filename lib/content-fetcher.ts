// Content fetcher for external content repository
import { Article } from './articles';

const CONTENT_REPO_URL = process.env.CONTENT_REPO_URL || 'https://api.github.com/repos/YOUR_USERNAME/nextjs-deepv-content';
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
    // Fallback to local file if external fetch fails
    try {
      const fs = await import('fs/promises');
      const localContent = await fs.readFile('./content/config/article-index.json', 'utf-8');
      return JSON.parse(localContent);
    } catch (localError) {
      console.error('Fallback to local file failed:', localError);
      return {
        lastUpdated: new Date().toISOString(),
        totalArticles: 0,
        categories: [],
        technologies: [],
        articles: []
      };
    }
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
    // Fallback to local file if external fetch fails
    try {
      const fs = await import('fs/promises');
      return await fs.readFile(`./content/guides/${filename}`, 'utf-8');
    } catch (localError) {
      console.error('Fallback to local file failed:', localError);
      throw new Error(`Article not found: ${filename}`);
    }
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