#!/bin/bash

# Content Repository GitHub Setup Script
# This script sets up your content repository for GitHub

echo "🚀 Setting up nextjs-deepv-content repository for GitHub..."

# Navigate to content repository
CONTENT_REPO_PATH="../nextjs-deepv-content"

if [ ! -d "$CONTENT_REPO_PATH" ]; then
    echo "❌ Content repository not found at $CONTENT_REPO_PATH"
    echo "Please run 'npm run migrate:content' first!"
    exit 1
fi

cd "$CONTENT_REPO_PATH"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
fi

# Add GitHub remote (update with your username)
echo "🔗 Adding GitHub remote..."
git remote remove origin 2>/dev/null || true
git remote add origin git@github.com:thaddeus-git/nextjs-deepv-content.git

# Create .gitignore for content repo
echo "📝 Creating .gitignore..."
cat > .gitignore << 'EOF'
# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Temporary files
*.tmp
*.temp
.cache/

# Log files
*.log
logs/

# Environment files (if any scripts added later)
.env
.env.local
.env.*.local
EOF

# Add all content files
echo "📁 Adding content files..."
git add .

# Commit
echo "💾 Committing content..."
git commit -m "🚀 Initial content repository setup

- Add all article content (MDX files)
- Add article index and configuration
- Add staging area for new articles
- Ready for ISR integration with Next.js app

Content repository for: https://github.com/thaddeus-git/nextjs-deepv-docs"

# Set main branch
echo "🌟 Setting main branch..."
git branch -M main

echo ""
echo "✅ Content repository setup complete!"
echo ""
echo "🔗 Next steps:"
echo "1. Push to GitHub:"
echo "   git push -u origin main"
echo ""
echo "2. Update your environment variables:"
echo "   CONTENT_REPO_URL=https://api.github.com/repos/thaddeus-git/nextjs-deepv-content"
echo ""
echo "3. Your upstream should now output to:"
echo "   ${PWD}/staging/guides/"
echo "   ${PWD}/staging/config/"
echo ""
echo "4. After validation, promote to production:"
echo "   mv staging/guides/* guides/"
echo "   mv staging/config/article-index-update.json config/article-index.json"
echo "   git add . && git commit -m 'Add new articles' && git push"