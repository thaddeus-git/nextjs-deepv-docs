# 📋 Schema Management Guide

## 🎯 **Schema Duplication Pattern**

To maintain repository independence while ensuring validation consistency, we use a **schema duplication pattern**:

- ✅ **Main Repository**: Owns authoritative schemas
- ✅ **Content Repository**: Gets copies for independent validation  
- ✅ **Zero Coupling**: Repositories work independently
- ✅ **Manual Sync**: Update copies when schemas change (rare)

## 📁 **Schema Locations**

### **Authoritative (Main Repo)**
```
nextjs-deepv-docs/config/
├── content-schema.json    # ← SOURCE OF TRUTH
├── project.json          # (app-specific, not copied)
└── tech-stack.json       # (app-specific, not copied)
```

### **Working Copy (Content Repo)**
```
nextjs-deepv-content/
├── content-schema.json    # ← COPY for validation
├── validate-content.js
└── staging/guides/
```

## 🔄 **Schema Update Process**

### **When Schema Changes:**
```bash
# 1. Update authoritative schema
vim nextjs-deepv-docs/config/content-schema.json

# 2. Update version metadata
{
  "_metadata": {
    "version": "1.1.0",      # ← Increment version
    "lastUpdated": "2024-09-18"
  }
}

# 3. Copy to content repository
cp nextjs-deepv-docs/config/content-schema.json nextjs-deepv-content/

# 4. Commit both repositories
cd nextjs-deepv-docs
git commit -m "Update content schema to v1.1.0"

cd nextjs-deepv-content  
git commit -m "Sync content schema to v1.1.0"
```

## 📊 **Schema Versioning**

Each schema includes metadata:
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

## ✅ **Files That Follow This Pattern**

### **Copied to Content Repo:**
- ✅ `content-schema.json` (validation requirements)

### **NOT Copied (App-Specific):**
- ❌ `project.json` (deployment info)
- ❌ `tech-stack.json` (technology choices)

## 🎯 **Benefits**

### **Repository Independence:**
- ✅ Content repo works without main repo access
- ✅ CI/CD pipelines can validate independently
- ✅ Content creators have everything they need
- ✅ Zero coupling between repositories

### **Maintenance:**
- ✅ Clear ownership (main repo is source of truth)
- ✅ Infrequent updates (schemas are stable)
- ✅ Version tracking for compatibility
- ✅ Simple manual sync process

## 🚨 **Important Rules**

### **DO:**
- ✅ Always update main repo schema first
- ✅ Copy to content repo after changes
- ✅ Update version metadata
- ✅ Commit both repositories

### **DON'T:**
- ❌ Edit schema directly in content repo
- ❌ Let schemas drift out of sync
- ❌ Skip version updates
- ❌ Add app-specific configs to content repo

## 🔧 **Quick Commands**

```bash
# Sync schema after changes
cp nextjs-deepv-docs/config/content-schema.json nextjs-deepv-content/

# Validate with local schema  
cd nextjs-deepv-content
node validate-content.js staging/guides content-schema.json

# Check schema version
grep -A5 "_metadata" content-schema.json
```

**This pattern ensures zero coupling while maintaining validation consistency across repositories.** 🎯