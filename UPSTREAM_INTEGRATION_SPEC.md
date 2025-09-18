# 🤖 Upstream Integration Specification

## 📋 **Schema Fetching Requirements**

### **Before Content Generation:**

```bash
# 1. Fetch latest content schema
curl -s https://raw.githubusercontent.com/thaddeus-git/nextjs-deepv-docs/main/config/content-schema.json > content-schema.json

# 2. Fetch latest categories
curl -s https://raw.githubusercontent.com/thaddeus-git/nextjs-deepv-docs/main/content/config/categories.json > categories.json

# 3. Parse and validate schema version
SCHEMA_VERSION=$(cat content-schema.json | grep '"version"' | cut -d'"' -f4)
echo "Using content schema version: $SCHEMA_VERSION"
```

### **Schema URLs:**
- **Content Schema**: `https://raw.githubusercontent.com/thaddeus-git/nextjs-deepv-docs/main/config/content-schema.json`
- **Categories**: `https://raw.githubusercontent.com/thaddeus-git/nextjs-deepv-docs/main/content/config/categories.json`

## 🎯 **Content Requirements (From Schema)**

### **Required Frontmatter Fields:**

```yaml
---
title: "string (5-100 characters)"
slug: "kebab-case-string"
category: "one of: databases, mobile, programming-languages, system-devops, web-frontend"
subcategory: "must exist in categories.json for the chosen category"
description: "string (20-200 characters, essential for SEO)"
tags: ["array", "of", "strings"] # or "comma,separated,string"
difficulty: "beginner|intermediate|advanced"
readTime: 15 # number (1-60 minutes)
lastUpdated: "2024-09-18T13:47:00.000Z" # ISO date string
---
```

### **Optional Frontmatter Fields:**

```yaml
featured: false # boolean
filename: "auto-generated-if-not-provided.mdx" # string
```

### **Filename Format:**

```
{descriptive-title}-{uniqueId}.mdx

Examples:
- how-to-parse-json-in-javascript-abc12345.mdx
- understanding-react-hooks-def67890.mdx
- python-data-analysis-guide-123abc45.mdx
```

## 📊 **Valid Categories & Subcategories**

### **databases**
- mongodb
- mysql  
- postgresql
- sql

### **mobile**
- android
- ios

### **programming-languages**
- c
- cpp
- csharp
- go
- java
- php
- python
- ruby
- rust

### **system-devops**
- cloud
- containerization
- linux
- package-management
- shell
- version-control

### **web-frontend**
- css
- html
- javascript

## 📁 **Output Location Requirements**

### **Staging Output Paths:**

```bash
# Article files
/nextjs-deepv-content/staging/guides/{article-name}-{id}.mdx

# Article index update
/nextjs-deepv-content/staging/config/article-index-update.json
```

### **Article Index Format:**

```json
{
  "lastUpdated": "2024-09-18T13:47:00.000Z",
  "totalArticles": 5,
  "categories": ["web-frontend", "system-devops"],
  "technologies": ["JavaScript", "Python", "Linux"],
  "articles": [
    {
      "id": "abc12345",
      "title": "Article Title",
      "slug": "article-slug",
      "category": "web-frontend",
      "subcategory": "javascript",
      "difficulty": "intermediate",
      "technology": "JavaScript",
      "readTime": 15,
      "publishedAt": "2024-09-18",
      "featured": false,
      "description": "SEO description 20-200 chars",
      "tags": ["javascript", "tutorial"],
      "filename": "article-title-abc12345.mdx",
      "lastUpdated": "2024-09-18T13:47:00.000Z"
    }
  ]
}
```

## ✅ **Pre-Generation Checklist**

- [ ] Fetched latest content-schema.json
- [ ] Fetched latest categories.json  
- [ ] Validated schema version compatibility
- [ ] Confirmed valid category/subcategory combinations
- [ ] Generated unique IDs for articles
- [ ] Created proper frontmatter for each article
- [ ] Generated complete article-index-update.json
- [ ] Validated all content before output

## 🔄 **Integration Workflow**

```bash
# 1. Fetch schemas
fetch_latest_schemas()

# 2. Generate content
generate_articles_with_schema_compliance()

# 3. Create complete article index
merge_existing_index_with_new_articles()

# 4. Output to staging
write_to_staging_directories()

# 5. Validate (optional pre-check)
run_content_validation()
```

## 🚨 **Error Handling**

### **Schema Fetch Failures:**
- Fall back to local schema cache
- Log warning about potential version mismatch
- Continue with generation

### **Validation Failures:**
- Stop generation process
- Report specific validation errors
- Fix and retry

### **Category Mismatches:**
- Map to closest valid category
- Log mapping decisions
- Update content accordingly
```