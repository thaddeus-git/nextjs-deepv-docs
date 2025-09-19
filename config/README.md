# DeepV Code Configuration

This directory contains the essential configuration files and schemas for the DeepV Code platform.

## 🎯 **For Upstream: Start Here**

**`upstream-schemas-index.json`** - Master index with all schemas your upstream needs
```bash
curl -s https://raw.githubusercontent.com/thaddeus-git/nextjs-deepv-docs/main/config/upstream-schemas-index.json
```

## Essential Schemas (5 files)

### Required for Content Generation
1. **`content-schema.json` v3.0.0** - Complete content requirements
   - Frontmatter structure and validation
   - Code language specifications (100+ languages)
   - Mermaid diagram support  
   - SEO optimization requirements
   - Content quality standards

2. **`content-templates.json`** - Ready-to-use examples
   - Complete MDX article templates
   - Code examples for major languages
   - Frontmatter examples by category
   - Quality checklists and best practices

3. **`article-index-schema.json`** - Article indexing
   - Index structure and consistency requirements
   - URL patterns (/guides/{slug}-{id})
   - Metadata validation rules

4. **`categories.json`** - Navigation structure (in `/content/config/`)
   - Valid category/subcategory combinations
   - UI color schemes
   - Site navigation hierarchy

### Project Context
5. **`project.json`** - Project metadata
   - Architecture details (ISR, Vercel)
   - Environment variables
   - Repository structure

6. **`tech-stack.json`** - Technology stack
   - Next.js 15 configuration
   - Dependencies and deployment setup

## Upstream Integration

### Quick Start
```bash
# Get the master index (contains all URLs)
curl -s https://raw.githubusercontent.com/thaddeus-git/nextjs-deepv-docs/main/config/upstream-schemas-index.json > schemas-index.json

# Download essential schemas
curl -s https://raw.githubusercontent.com/thaddeus-git/nextjs-deepv-docs/main/config/content-schema.json > content-schema.json
curl -s https://raw.githubusercontent.com/thaddeus-git/nextjs-deepv-docs/main/config/content-templates.json > content-templates.json
curl -s https://raw.githubusercontent.com/thaddeus-git/nextjs-deepv-docs/main/content/config/categories.json > categories.json
```

### Critical Requirements
- ✅ **Code blocks MUST specify language** (`javascript`, `python`, `mermaid`)
- ✅ **SEO optimization** (titles 5-70 chars, descriptions 20-200 chars)
- ✅ **Valid categories** (must exist in categories.json)
- ✅ **URL structure** (/guides/{slug}-{id} pattern)
- ✅ **Mermaid diagrams** (use `mermaid` language tag)

## Validation Tools

Available validation scripts:
- `validate-content.js` - Validates MDX files against schemas
- `validate-article-index.js` - Validates article index consistency

## Architecture

- **Platform:** Next.js 15 with App Router
- **Deployment:** Vercel with ISR
- **Content:** External GitHub repository
- **Scale:** 10K+ articles supported
- **Performance:** 5-minute ISR revalidation

## Schema Versions

- Content Schema: v3.0.0 (includes merged SEO requirements)
- Article Index: v1.0.0 
- Templates: v1.0.0
- Categories: stable

All schemas include version tracking for safe upstream integration.