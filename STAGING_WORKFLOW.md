# 🔄 Content Staging Workflow

## 🎯 **Why Staging Validation Matters**

The staging area ensures content quality before production:
- ✅ **Schema Validation**: Ensures all required fields are present and correctly formatted
- ✅ **SEO Compliance**: Validates description length, heading structure, etc.
- ✅ **Consistency**: Enforces filename conventions and content standards
- ✅ **Error Prevention**: Catches issues before they reach production

## 📋 **Complete Workflow**

### **Step 1: Generate to Staging**
```bash
# Your upstream generates articles to staging
/nextjs-deepv-content/staging/guides/*.mdx
/nextjs-deepv-content/staging/config/article-index-update.json
```

### **Step 2: Validate Content**
```bash
# Option A: Run from main repository
cd nextjs-deepv-docs
npm run validate:content

# Option B: Run from content repository
cd nextjs-deepv-content
node validate-content.js staging/guides ../nextjs-deepv-docs/config/content-schema.json
```

**Validation Checks:**
- ✅ Filename format: `{descriptive-title}-{uniqueId}.mdx`
- ✅ Required frontmatter fields (title, slug, category, etc.)
- ✅ Field types and formats (dates, enums, lengths)
- ✅ SEO requirements (description 20-200 chars)
- ⚠️ Content quality warnings (length, headings, code blocks)

### **Step 3: Promote to Production** 
```bash
# Option A: Automatic promotion (validates first)
cd nextjs-deepv-docs
npm run promote:content

# Option B: Manual promotion (after validation passes)
cd nextjs-deepv-content
mv staging/guides/*.mdx guides/
mv staging/config/article-index-update.json config/article-index.json
git add . && git commit -m "Add new articles" && git push
```

### **Step 4: ISR Updates**
- 🕐 **Automatic**: Content appears within 5 minutes (ISR revalidation)
- ⚡ **Manual**: Trigger immediate revalidation (optional)

## 🛠️ **Available Scripts**

### **From Main Repository (`nextjs-deepv-docs`):**
```bash
npm run validate:content    # Validate staging content
npm run promote:content     # Validate + promote + git push
```

### **From Content Repository (`nextjs-deepv-content`):**
```bash
node validate-content.js staging/guides ../nextjs-deepv-docs/config/content-schema.json
```

## 📊 **Validation Output Examples**

### **✅ Success Example:**
```
🔍 Validating 3 MDX files in staging/guides

📄 Validating: how-to-parse-json-in-javascript-abc12345.mdx
  ✅ Valid

📄 Validating: understanding-react-hooks-def67890.mdx  
  ✅ Valid

📊 Validation Summary:
✅ All files are valid!
✅ Validation successful! Content is ready for production.
```

### **❌ Error Example:**
```
📄 Validating: bad-filename.mdx
  ❌ Filename must match pattern: {descriptive-title}-{uniqueId}.mdx
  ❌ Missing required field: description
  ❌ difficulty must be one of: beginner, intermediate, advanced

📊 Validation Summary:
❌ Found 3 error(s):
   • bad-filename.mdx: Filename must match pattern
   • bad-filename.mdx: Missing required field: description
   • bad-filename.mdx: difficulty must be one of: beginner, intermediate, advanced
❌ Validation failed! Content cannot be promoted to production.
```

## 🔧 **Configuration**

All validation rules are defined in:
- **Schema**: `/config/content-schema.json` 
- **Categories**: `/content/config/categories.json`

## 🚨 **Common Validation Errors**

### **Filename Issues:**
- ❌ `my_article.mdx` → ✅ `my-article-abc12345.mdx`
- ❌ `Article Title.mdx` → ✅ `article-title-def67890.mdx`

### **Frontmatter Issues:**
- ❌ Missing `description` field
- ❌ `difficulty: "easy"` → ✅ `difficulty: "beginner"`
- ❌ `tags: ""` → ✅ `tags: ["javascript", "react"]`

### **SEO Issues:**
- ❌ `description: "Too short"` → ✅ `description: "Comprehensive guide explaining..."`
- ❌ Description > 200 chars → ✅ Keep under 200 chars

## 🎯 **Benefits of This Workflow**

### **Quality Assurance:**
- ✅ Prevents broken pages in production
- ✅ Ensures SEO optimization
- ✅ Maintains content consistency
- ✅ Catches errors early

### **Automated Workflow:**
- ✅ Single command promotion (`npm run promote:content`)
- ✅ Automatic git operations
- ✅ ISR integration
- ✅ Clear error reporting

### **Scalability:**
- ✅ Works with 1 or 100,000 articles
- ✅ Fast validation (runs in seconds)
- ✅ Extensible validation rules
- ✅ CI/CD ready

**This staging workflow ensures high-quality content while maintaining the fast, scalable ISR architecture!** 🚀