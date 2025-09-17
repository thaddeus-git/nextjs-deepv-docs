// lib/navigation.ts
import categoriesConfig from '@/content/config/categories.json'

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

export function getAllCategories(): Category[] {
  return categoriesConfig.categories as Category[]
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
