# 🚀 DeepV Code - AI-Powered Technical Documentation Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://deepvcode.com)
[![ISR](https://img.shields.io/badge/ISR-Enabled-green)](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)

> **Live Site**: [https://deepvcode.com](https://deepvcode.com)

DeepV Code is a Next.js 15 technical documentation platform that transforms Stack Overflow content into enterprise-grade, SEO-optimized articles using AI-powered content curation. Built for infinite scalability with ISR (Incremental Static Regeneration) architecture.

## 🏗️ **Architecture Overview**

### **Repositories**
- **🔧 Main Repository** (`nextjs-deepv-docs`): Application code and deployment
- **📝 Content Repository** (`nextjs-deepv-content`): MDX articles and configuration

### **Key Features**
- ✅ **Next.js 15 App Router** with React Server Components
- ✅ **ISR Architecture** - 5-page builds, on-demand generation
- ✅ **External Content Fetching** from GitHub API
- ✅ **100,000+ Article Scalability** without build timeouts
- ✅ **Zero Coupling** between code and content repositories
- ✅ **SEO Optimized** with structured metadata and ISR caching

## 🚀 **Getting Started**

### **Development Setup**
```bash
# Clone the repository
git clone git@github.com:thaddeus-git/nextjs-deepv-docs.git
cd nextjs-deepv-docs

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

### **Environment Variables**
```bash
# .env.local
CONTENT_REPO_URL=https://api.github.com/repos/thaddeus-git/nextjs-deepv-content
GITHUB_TOKEN=your_github_token_here  # Optional but recommended
NEXT_PUBLIC_APP_URL=https://deepvcode.com
```

## 📋 **Schema Management**

### **Schema Duplication Pattern**
To maintain repository independence while ensuring validation consistency:

- ✅ **Main Repository**: Owns authoritative schemas (`/config/`)
- ✅ **Content Repository**: Gets copies for independent validation  
- ✅ **Zero Coupling**: Repositories work independently
- ✅ **Manual Sync**: Update copies when schemas change (rare)

### **Schema Locations**
```
# Authoritative (Main Repo)
nextjs-deepv-docs/config/
├── content-schema.json    # ← SOURCE OF TRUTH
├── project.json          # (app-specific, not copied)
└── tech-stack.json       # (app-specific, not copied)

# Working Copy (Content Repo)
nextjs-deepv-content/
├── content-schema.json    # ← COPY for validation
├── validate-content.js
└── staging/guides/
```

### **Schema Update Process**
```bash
# 1. Update authoritative schema
vim config/content-schema.json

# 2. Update version metadata
{
  "_metadata": {
    "version": "1.1.0",      # ← Increment version
    "lastUpdated": "2024-09-18"
  }
}

# 3. Copy to content repository
cp config/content-schema.json ../nextjs-deepv-content/

# 4. Commit both repositories
git commit -m "Update content schema to v1.1.0"
cd ../nextjs-deepv-content && git commit -m "Sync content schema to v1.1.0"
```

## 🔄 **Content Workflow**

### **ISR Content Lifecycle**
```
Upstream generates → staging/guides/ → validate → production/guides/ → git push → ISR auto-revalidates (5 min)
```

### **Content Validation**
```bash
# From content repository
cd ../nextjs-deepv-content
npm run validate  # Validates staging content against schema
```

### **Content Promotion**
```bash
# From main repository  
npm run promote:content  # Validates + promotes + pushes to GitHub
```

## 🛠️ **Available Scripts**

```bash
npm run dev           # Start development server with Turbopack
npm run build         # Build for production with Turbopack  
npm run start         # Start production server
npm run lint          # Run ESLint
npm run promote:content  # Validate and promote content (cross-repo)
```

## 📁 **Project Structure**

```
nextjs-deepv-docs/
├── app/                    # Next.js 15 App Router
│   ├── components/         # React components
│   ├── guides/[slug]/      # Dynamic article pages
│   └── [category]/         # Category pages
├── lib/                    # Utilities and content fetching
│   ├── articles.ts         # Article data management
│   ├── content-fetcher.ts  # GitHub API integration
│   └── navigation.ts       # Category management
├── config/                 # Configuration files (source of truth)
│   ├── content-schema.json # Content validation schema
│   ├── project.json        # Project configuration
│   └── tech-stack.json     # Technology stack info
├── scripts/                # Automation scripts
└── content/config/         # Build-time fallback configs
```

## 🎯 **Technology Stack**

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: MDX with `next-mdx-remote/rsc`
- **Deployment**: Vercel with ISR
- **Content Storage**: External GitHub repository
- **Build Tool**: Turbopack

## 📊 **Performance & Scalability**

### **ISR Configuration**
- ✅ **5 pages** pre-rendered at build time (< 2 minute builds)
- ✅ **On-demand generation** for 100,000+ articles
- ✅ **5-minute revalidation** for fresh content
- ✅ **Edge caching** via Vercel CDN

### **Build Optimization**
- ✅ **Webpack memory optimization** for large-scale content
- ✅ **Content separation** prevents build size limits
- ✅ **External content fetching** with graceful fallbacks
- ✅ **Turbopack** for fast development builds

## 🔐 **Schema Versioning**

All schemas include version metadata:
```json
{
  "_metadata": {
    "version": "1.0.0",
    "source": "nextjs-deepv-docs/config/content-schema.json", 
    "lastUpdated": "2024-09-18",
    "description": "Authoritative content schema for DeepV Code articles"
  },
  "article_schema": { ... }
}
```

## 🚨 **Important Rules**

### **Schema Management DO's:**
- ✅ Always update main repo schema first
- ✅ Copy to content repo after changes
- ✅ Update version metadata
- ✅ Commit both repositories

### **Schema Management DON'Ts:**
- ❌ Edit schema directly in content repo
- ❌ Let schemas drift out of sync
- ❌ Skip version updates
- ❌ Add app-specific configs to content repo

## 🔧 **Quick Commands**

```bash
# Schema synchronization
cp config/content-schema.json ../nextjs-deepv-content/

# Content validation
cd ../nextjs-deepv-content && npm run validate

# Check schema version
grep -A5 "_metadata" config/content-schema.json
```

## 🌐 **Deployment**

The application is automatically deployed to [Vercel](https://vercel.com) on every push to the main branch:

- **Production**: [https://deepvcode.com](https://deepvcode.com)
- **Auto-deployment**: GitHub → Vercel
- **ISR**: Content updates within 5 minutes
- **CDN**: Global edge caching

## 📚 **Learn More**

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [ISR Guide](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
- [Vercel Deployment](https://nextjs.org/docs/deployment)
- [MDX Integration](https://mdxjs.com/docs/getting-started/)

## 🤝 **Contributing**

This project follows a decoupled architecture with separate repositories for code and content. See schema management guidelines above for contribution workflows.

---

**DeepV Code represents the next trend: AI content curation and systematization at scale, competing with platforms like GeeksforGeeks/MDN using automated content transformation.** 🚀
