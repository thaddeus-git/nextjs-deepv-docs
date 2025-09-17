# 🔄 Upstream Workflow Update Guide

## 📝 **What Changed**

Your articles now go to a **separate content repository** instead of the main code repository.

## 🎯 **New Output Locations**

### **Before (Main Repository):**
```bash
# OLD - Don't use anymore
/path/to/nextjs-deepv-docs/content/staging/guides/
/path/to/nextjs-deepv-docs/content/staging/config/article-index-update.json
```

### **After (Content Repository):**
```bash
# NEW - Use these paths
/path/to/nextjs-deepv-content/staging/guides/
/path/to/nextjs-deepv-content/staging/config/article-index-update.json
```

## 🔧 **Upstream Configuration**

Update your upstream workflow to point to the content repository:

### **Environment Variables:**
```bash
# Update these in your upstream workflow
export CONTENT_REPO_PATH="/path/to/nextjs-deepv-content"
export STAGING_DIR="${CONTENT_REPO_PATH}/staging"
export PRODUCTION_DIR="${CONTENT_REPO_PATH}"
```

### **Output Paths:**
```bash
# Staging area for new articles
STAGING_GUIDES_DIR="${CONTENT_REPO_PATH}/staging/guides"
STAGING_CONFIG_DIR="${CONTENT_REPO_PATH}/staging/config"

# Production area (after validation)
PRODUCTION_GUIDES_DIR="${CONTENT_REPO_PATH}/guides"
PRODUCTION_CONFIG_DIR="${CONTENT_REPO_PATH}/config"
```

## 📋 **Updated Workflow Steps**

### **Step 1: Generate Articles**
```bash
# Your upstream generates articles
./generate-articles.sh

# Output goes to content repository staging
echo "Articles generated in: ${CONTENT_REPO_PATH}/staging/guides/"
```

### **Step 2: Validation** 
```bash
# Validate staging content (same process as before)
./validate-staging.sh "${CONTENT_REPO_PATH}/staging"
```

### **Step 3: Deploy to Production**
```bash
# Move from staging to production (within content repo)
cp "${CONTENT_REPO_PATH}/staging/guides/"*.mdx "${CONTENT_REPO_PATH}/guides/"
cp "${CONTENT_REPO_PATH}/staging/config/article-index-update.json" "${CONTENT_REPO_PATH}/config/article-index.json"

# Commit and push content repository
cd "${CONTENT_REPO_PATH}"
git add .
git commit -m "Add new articles: $(date)"
git push origin main
```

### **Step 4: Trigger Website Rebuild**
```bash
# Option A: Automatic (Vercel webhook - recommended)
# Vercel will detect the content repo change and rebuild automatically

# Option B: Manual trigger (if needed)
curl -X POST "https://api.vercel.com/v1/integrations/deploy/YOUR_DEPLOY_HOOK"
```

## 🔄 **Migration Script for Upstream**

Here's a script to help update your upstream workflow:

```bash
#!/bin/bash
# upstream-migration.sh

echo "🔄 Updating upstream workflow paths..."

# Old paths
OLD_MAIN_REPO="/path/to/nextjs-deepv-docs"
OLD_STAGING="${OLD_MAIN_REPO}/content/staging"

# New paths  
NEW_CONTENT_REPO="/path/to/nextjs-deepv-content"
NEW_STAGING="${NEW_CONTENT_REPO}/staging"

echo "📁 Old staging path: ${OLD_STAGING}"
echo "📁 New staging path: ${NEW_STAGING}"

# Update your upstream scripts to use NEW_STAGING instead of OLD_STAGING
echo "✅ Update complete! Use the new paths in your upstream workflow."
```

## 🎯 **Benefits of New Workflow**

### **Faster Deployments:**
- Content changes don't trigger full website rebuilds
- Only content repository needs to be updated
- Website uses ISR for new articles

### **Better Separation:**
- Code changes vs content changes are isolated
- Easier to manage permissions (content team vs dev team)
- Better Git history and blame tracking

### **Scalability:**
- Content repository can grow to any size
- Main website repository stays small
- Build times remain fast regardless of article count

## 🚨 **Important Notes**

### **Two Repositories to Manage:**
1. **Main Repository** (`nextjs-deepv-docs`) - Code only
2. **Content Repository** (`nextjs-deepv-content`) - Articles only

### **Staging Validation:**
Your validation process remains the same, just in a different location:
```bash
# Validate articles in content repository
cd /path/to/nextjs-deepv-content
./validate-staging.sh staging/
```

### **Production Deployment:**
After validation, move files within the content repository:
```bash
# Move validated content to production (same repo)
mv staging/guides/* guides/
mv staging/config/article-index-update.json config/article-index.json
```

## 🎉 **Summary**

✅ **Staging folder preserved** in content repository  
✅ **Same validation process** as before  
✅ **Upstream outputs to content repo** instead of main repo  
✅ **Website automatically detects** content changes  
✅ **Faster builds** and deployments

Your workflow is now **infinitely scalable** and Vercel-ready! 🚀