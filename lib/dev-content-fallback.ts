// Development fallback for when external content is not available
import { Article } from './articles';

// Simple fallback data for development
export function getLocalArticlesForDev(): Article[] {
  // Hardcoded sample articles based on your temp-files for development
  return [
    {
      slug: "how-to-do-word-counts-for-a-mixture-of-english-and-chinese",
      title: "How to do word counts for a mixture of English and Chinese in Javascript",
      category: "web-frontend",
      subcategory: "javascript",
      description: "Learn 3 different methods to count words in mixed English and Chinese text with performance comparisons and practical examples.",
      tags: ["javascript", "jquery", "character", "counter", "word-count", "frontend", "web", "js"],
      difficulty: "beginner" as const,
      readTime: 22,
      lastUpdated: "2025-09-18T07:29:53.000Z",
      featured: true,
      filename: "how-to-do-word-counts-for-a-mixture-of-english-and-chinese-171c50c3.mdx"
    },
    {
      slug: "parse-query-string-in-javascript",
      title: "Parse Query String in JavaScript: 5 Modern Methods",
      category: "web-frontend", 
      subcategory: "javascript",
      description: "Complete guide to parsing URL query strings in JavaScript with URLSearchParams, regex, and custom solutions.",
      tags: ["javascript", "url", "query-string", "web", "frontend"],
      difficulty: "intermediate" as const,
      readTime: 15,
      lastUpdated: "2025-09-18T07:29:53.000Z",
      featured: true,
      filename: "parse-query-string-in-javascript-3749489f.mdx"
    },
    {
      slug: "size-of-numpy-array",
      title: "Size of NumPy Array: Complete Guide to Shape, Size, and Memory",
      category: "programming-languages",
      subcategory: "python", 
      description: "Learn different methods to get NumPy array dimensions, total elements, and memory usage with practical examples.",
      tags: ["python", "numpy", "arrays", "data-science", "memory"],
      difficulty: "beginner" as const,
      readTime: 12,
      lastUpdated: "2025-09-18T07:29:53.000Z",
      featured: false,
      filename: "size-of-numpy-array-30e24d02.mdx"
    },
    {
      slug: "how-to-calculate-median-in-aws-redshift",
      title: "How to Calculate Median in AWS Redshift: 4 Methods",
      category: "databases",
      subcategory: "sql",
      description: "Comprehensive guide to calculating median values in AWS Redshift using PERCENTILE_CONT, window functions, and more.",
      tags: ["aws", "redshift", "sql", "median", "analytics", "database"],
      difficulty: "intermediate" as const,
      readTime: 18,
      lastUpdated: "2025-09-18T07:29:53.000Z",
      featured: false,
      filename: "how-to-calculate-median-in-aws-redshift-faa9b536.mdx"
    },
    {
      slug: "dependency-resolution-fails-on-installed-library",
      title: "Dependency Resolution Fails on Installed Library: Solutions",
      category: "system-devops",
      subcategory: "package-management",
      description: "Troubleshoot and fix dependency resolution errors in npm, pip, and other package managers with step-by-step solutions.",
      tags: ["npm", "dependencies", "package-management", "troubleshooting", "node"],
      difficulty: "advanced" as const,
      readTime: 25,
      lastUpdated: "2025-09-18T07:29:53.000Z", 
      featured: false,
      filename: "dependency-resolution-fails-on-installed-library-debc8982.mdx"
    }
  ];
}

export function createDevArticleIndex(): {
  lastUpdated: string;
  totalArticles: number;
  categories: string[];
  technologies: string[];
  articles: Article[];
} {
  const articles = getLocalArticlesForDev();
  
  const categories = [...new Set(articles.map(a => a.category))];
  const technologies = [...new Set(articles.flatMap(a => 
    Array.isArray(a.tags) ? a.tags : a.tags.split(',').map(t => t.trim()).filter(t => t)
  ))];

  return {
    lastUpdated: new Date().toISOString(),
    totalArticles: articles.length,
    categories,
    technologies,
    articles
  };
}