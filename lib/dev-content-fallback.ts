// Development fallback for when external content is not available
import { Article } from './articles';

// Extract ID from filename following the established pattern: {slug}-{8charhex}.mdx
function extractIdFromFilename(filename: string): string {
  const match = filename.match(/-([a-f0-9]{8})\.mdx$/);
  if (!match) {
    throw new Error(`Invalid filename pattern: ${filename}. Must be {slug}-{8charhex}.mdx`);
  }
  return match[1];
}

// Simple fallback data for development AND production (until content repo is created)
export function getLocalArticlesForDev(): Article[] {
  // All 12 articles from your temp-files directory
  return [
    // Auto-extract ID from filename to ensure consistency  
    (() => {
      const filename = "how-to-do-word-counts-for-a-mixture-of-english-and-chinese-171c50c3.mdx";
      return {
        id: extractIdFromFilename(filename),
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
        filename
      };
    })(),
    (() => {
      const filename = "parse-query-string-in-javascript-3749489f.mdx";
      return {
        id: extractIdFromFilename(filename),
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
        filename
      };
    })(),
    (() => {
      const filename = "size-of-numpy-array-30e24d02.mdx";
      return {
        id: extractIdFromFilename(filename),
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
      filename
      };
    })(),
    (() => {
      const filename = "how-to-calculate-median-in-aws-redshift-faa9b536.mdx";
      return {
        id: extractIdFromFilename(filename),
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
      filename
      };
    })(),
    (() => {
      const filename = "dependency-resolution-fails-on-installed-library-debc8982.mdx";
      return {
        id: extractIdFromFilename(filename),
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
        filename
      };
    })(),
    (() => {
      const filename = "logit-regression-and-singular-matrix-error-in-python-bbd1fbd5.mdx";
      return {
        id: extractIdFromFilename(filename),
        slug: "logit-regression-and-singular-matrix-error-in-python",
        title: "Logit Regression and Singular Matrix Error in Python: 4 Solutions",
        category: "programming-languages",
        subcategory: "python",
        description: "Fix singular matrix errors in logistic regression with practical solutions including regularization, feature selection, and data preprocessing.",
        tags: ["python", "machine-learning", "logistic-regression", "sklearn", "data-science"],
        difficulty: "intermediate" as const,
        readTime: 18,
        lastUpdated: "2025-09-18T07:29:53.000Z", 
        featured: false,
        filename
      };
    })(),
    (() => {
      const filename = "why-does-my-javascript-code-receive-a-no-access-control-d0cc8ebb.mdx";
      return {
        id: extractIdFromFilename(filename),
        slug: "why-does-my-javascript-code-receive-a-no-access-control",
        title: "Why Does My JavaScript Code Receive a 'No Access Control' Error?",
        category: "web-frontend",
        subcategory: "javascript",
        description: "Understand and fix CORS errors in JavaScript with comprehensive solutions for API calls, fetch requests, and cross-origin issues.",
        tags: ["javascript", "cors", "api", "fetch", "web-development"],
        difficulty: "intermediate" as const,
        readTime: 15,
        lastUpdated: "2025-09-18T07:29:53.000Z", 
        featured: false,
        filename
      };
    })(),
    (() => {
      const filename = "representational-state-transfer-rest-and-simple-object-dc385f3c.mdx";
      return {
        id: extractIdFromFilename(filename),
        slug: "representational-state-transfer-rest-and-simple-object",
        title: "Representational State Transfer (REST) and Simple Object Access Protocol (SOAP)",
        category: "web-frontend",
        subcategory: "api",
        description: "Complete comparison of REST vs SOAP protocols with practical examples, advantages, and implementation guidelines.",
        tags: ["rest", "soap", "api", "web-services", "architecture"],
        difficulty: "intermediate" as const,
        readTime: 20,
        lastUpdated: "2025-09-18T07:29:53.000Z", 
        featured: false,
        filename
      };
    })(),
    (() => {
      const filename = "how-can-apache-camel-be-used-to-monitor-file-changes-ae1d627b.mdx";
      return {
        id: extractIdFromFilename(filename),
        slug: "how-can-apache-camel-be-used-to-monitor-file-changes",
        title: "How Can Apache Camel Be Used to Monitor File Changes?",
        category: "system-devops",
        subcategory: "integration",
        description: "Learn to monitor file system changes with Apache Camel using file watchers, polling, and event-driven patterns.",
        tags: ["apache-camel", "file-monitoring", "integration", "java", "automation"],
        difficulty: "advanced" as const,
        readTime: 22,
        lastUpdated: "2025-09-18T07:29:53.000Z", 
        featured: false,
        filename
      };
    })(),
    (() => {
      const filename = "how-to-change-font-and-size-of-buttons-and-frame-in-tkinter-5eb2a04f.mdx";
      return {
        id: extractIdFromFilename(filename),
        slug: "how-to-change-font-and-size-of-buttons-and-frame-in-tkinter",
        title: "How to Change Font and Size of Buttons and Frame in Tkinter",
        category: "programming-languages",
        subcategory: "python",
        description: "Complete guide to customizing Tkinter widget fonts, sizes, and styling with practical examples and best practices.",
        tags: ["python", "tkinter", "gui", "font", "styling"],
        difficulty: "beginner" as const,
        readTime: 12,
        lastUpdated: "2025-09-18T07:29:53.000Z", 
        featured: false,
        filename
      };
    })(),
    (() => {
      const filename = "retrieve-data-from-stored-procedure-which-has-multiple-c335a59c.mdx";
      return {
        id: extractIdFromFilename(filename),
        slug: "retrieve-data-from-stored-procedure-which-has-multiple",
        title: "Retrieve Data from Stored Procedure Which Has Multiple Result Sets",
        category: "databases",
        subcategory: "sql",
        description: "Handle multiple result sets from stored procedures in SQL Server, MySQL, and PostgreSQL with practical examples.",
        tags: ["sql", "stored-procedures", "database", "result-sets", "sql-server"],
        difficulty: "intermediate" as const,
        readTime: 16,
        lastUpdated: "2025-09-18T07:29:53.000Z", 
        featured: false,
        filename
      };
    })()
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