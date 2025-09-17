// lib/navigation.ts
import { fetchCategories } from './content-fetcher'

export interface Category {
  id: string
  title: string
  description: string
  subcategories: Subcategory[]
}

export interface Subcategory {
  id: string
  title: string
  color: string
}

// Cached categories data
let categoriesCache: Category[] | null = null

// Sync function for client-side use
export function getAllCategories(): Category[] {
  // Return hardcoded categories for client-side (Navigation component)
  return [
    {
      id: 'databases',
      title: 'Databases',
      description: 'Database management and optimization',
      subcategories: [
        { id: 'mongodb', title: 'MongoDB', color: '#4DB33D' },
        { id: 'mysql', title: 'MySQL', color: '#F29111' },
        { id: 'postgresql', title: 'PostgreSQL', color: '#336791' },
        { id: 'sql', title: 'SQL', color: '#1F4E79' }
      ]
    },
    {
      id: 'mobile',
      title: 'Mobile Development',
      description: 'Mobile app development and frameworks',
      subcategories: [
        { id: 'android', title: 'Android', color: '#A4C639' },
        { id: 'ios', title: 'iOS', color: '#000000' }
      ]
    },
    {
      id: 'programming-languages',
      title: 'Programming Languages',
      description: 'Programming languages, syntax, and best practices',
      subcategories: [
        { id: 'c', title: 'C', color: '#00599C' },
        { id: 'cpp', title: 'C++', color: '#00599C' },
        { id: 'csharp', title: 'C#', color: '#68217A' },
        { id: 'go', title: 'Go', color: '#00ADD8' },
        { id: 'java', title: 'Java', color: '#ED8B00' },
        { id: 'php', title: 'PHP', color: '#777BB4' },
        { id: 'python', title: 'Python', color: '#3776AB' },
        { id: 'ruby', title: 'Ruby', color: '#CC342D' },
        { id: 'rust', title: 'Rust', color: '#000000' }
      ]
    },
    {
      id: 'system-devops',
      title: 'System & DevOps',
      description: 'System administration and DevOps practices',
      subcategories: [
        { id: 'cloud', title: 'Cloud', color: '#FF9900' },
        { id: 'containerization', title: 'Containerization', color: '#2496ED' },
        { id: 'linux', title: 'Linux', color: '#FCC624' },
        { id: 'package-management', title: 'Package Management', color: '#8B4513' },
        { id: 'shell', title: 'Shell', color: '#4EAA25' },
        { id: 'version-control', title: 'Version Control', color: '#F05032' }
      ]
    },
    {
      id: 'web-frontend',
      title: 'Web Frontend',
      description: 'Frontend development and technologies',
      subcategories: [
        { id: 'css', title: 'CSS', color: '#1572B6' },
        { id: 'html', title: 'HTML', color: '#E34F26' },
        { id: 'javascript', title: 'JavaScript', color: '#F7DF1E' }
      ]
    }
  ]
}

// Async version for server components
export async function getAllCategoriesAsync(): Promise<Category[]> {
  try {
    const categoriesData = await fetchCategories()
    categoriesCache = categoriesData.categories as Category[]
    return categoriesCache
  } catch (error) {
    console.error('Error fetching categories:', error)
    // Fallback to sync version
    return getAllCategories()
  }
}

export function getCategoryById(id: string): Category | null {
  const categories = getAllCategories()
  return categories.find(cat => cat.id === id) || null
}

export function getSubcategoryById(categoryId: string, subcategoryId: string): Subcategory | null {
  const category = getCategoryById(categoryId)
  if (!category) return null
  
  return category.subcategories.find(sub => sub.id === subcategoryId) || null
}

export function generateBreadcrumbs(category?: string, subcategory?: string, articleTitle?: string) {
  const breadcrumbs = [{ label: 'Home', href: '/' }]
  
  if (category) {
    const cat = getCategoryById(category)
    if (cat) {
      breadcrumbs.push({ label: cat.title, href: `/${category}` })
    }
  }
  
  if (subcategory && category) {
    const sub = getSubcategoryById(category, subcategory)
    if (sub) {
      breadcrumbs.push({ label: sub.title, href: `/${category}/${subcategory}` })
    }
  }
  
  if (articleTitle) {
    breadcrumbs.push({ label: articleTitle, href: '#' })
  }
  
  return breadcrumbs
}
