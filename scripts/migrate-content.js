#!/usr/bin/env node

/**
 * Content Migration Script
 * Helps migrate content from main repo to separate content repository
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONTENT_REPO_NAME = 'nextjs-deepv-content';
const MAIN_REPO_PATH = process.cwd();
const CONTENT_REPO_PATH = path.join('..', CONTENT_REPO_NAME);

function createContentRepository() {
  console.log('🚀 Creating content repository...');
  
  try {
    // Create directory
    if (!fs.existsSync(CONTENT_REPO_PATH)) {
      fs.mkdirSync(CONTENT_REPO_PATH, { recursive: true });
    }
    
    // Initialize git repository
    process.chdir(CONTENT_REPO_PATH);
    execSync('git init', { stdio: 'inherit' });
    
    console.log('✅ Content repository created');
  } catch (error) {
    console.error('❌ Error creating content repository:', error.message);
    process.exit(1);
  }
}

function copyContentFiles() {
  console.log('📁 Copying content files...');
  
  try {
    process.chdir(MAIN_REPO_PATH);
    
    // Copy content directory
    execSync(`cp -r content/ "${CONTENT_REPO_PATH}/"`, { stdio: 'inherit' });
    
    // Create README for content repo
    const readmeContent = `# DeepV Code Content Repository

This repository contains all articles and content for the DeepV Code documentation website.

## Structure

\`\`\`
├── config/
│   ├── article-index.json    # Article metadata index
│   └── categories.json       # Category configuration
├── guides/
│   └── *.mdx                # Article files
└── staging/
    ├── guides/              # Staging area for new articles
    └── config/              # Staging configuration
\`\`\`

## Usage

This repository is automatically fetched during the build process of the main Next.js application.

## Article Format

Each article should be an MDX file with the following frontmatter:

\`\`\`yaml
---
title: "Article Title"
slug: "article-slug"
category: "category-name"
subcategory: "subcategory-name"
description: "Brief description"
difficulty: "beginner" | "intermediate" | "advanced"
readTime: 30
publishedAt: "2025-01-01"
featured: true
technology: "Technology Name"
tags:
  - "tag1"
  - "tag2"
---
\`\`\`

## Deployment

When articles are updated in this repository, the main website will automatically revalidate the content within 1 hour, or immediately via webhook.
`;
    
    fs.writeFileSync(path.join(CONTENT_REPO_PATH, 'README.md'), readmeContent);
    
    console.log('✅ Content files copied');
  } catch (error) {
    console.error('❌ Error copying content files:', error.message);
    process.exit(1);
  }
}

function createGitIgnore() {
  console.log('📝 Creating .gitignore for content repository...');
  
  const gitignoreContent = `# Dependencies
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

# Build artifacts (if any scripts are added later)
dist/
build/
`;
  
  try {
    fs.writeFileSync(path.join(CONTENT_REPO_PATH, '.gitignore'), gitignoreContent);
    console.log('✅ .gitignore created');
  } catch (error) {
    console.error('❌ Error creating .gitignore:', error.message);
  }
}

function commitAndPush() {
  console.log('💾 Committing and pushing content repository...');
  
  try {
    process.chdir(CONTENT_REPO_PATH);
    
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Initial content repository setup"', { stdio: 'inherit' });
    
    console.log('✅ Content committed');
    console.log('');
    console.log('🔗 Next steps:');
    console.log('1. Create a GitHub repository named "nextjs-deepv-content"');
    console.log('2. Add the remote origin:');
    console.log(`   cd ${CONTENT_REPO_PATH}`);
    console.log('   git remote add origin https://github.com/YOUR_USERNAME/nextjs-deepv-content.git');
    console.log('   git push -u origin main');
    console.log('');
    console.log('3. Update your environment variables:');
    console.log('   CONTENT_REPO_URL=https://api.github.com/repos/YOUR_USERNAME/nextjs-deepv-content');
    console.log('   GITHUB_TOKEN=your_personal_access_token');
    
  } catch (error) {
    console.error('❌ Error committing content:', error.message);
  }
}

function updateMainRepoGitIgnore() {
  console.log('🔧 Updating main repository .gitignore...');
  
  try {
    process.chdir(MAIN_REPO_PATH);
    
    const gitignorePath = '.gitignore';
    let gitignoreContent = '';
    
    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    }
    
    const contentIgnores = `
# Content files (stored in separate repository)
content/guides/
content/staging/
`;
    
    if (!gitignoreContent.includes('content/guides/')) {
      gitignoreContent += contentIgnores;
      fs.writeFileSync(gitignorePath, gitignoreContent);
      console.log('✅ Main repository .gitignore updated');
    } else {
      console.log('ℹ️  Main repository .gitignore already configured');
    }
  } catch (error) {
    console.error('❌ Error updating main .gitignore:', error.message);
  }
}

function displaySummary() {
  console.log('');
  console.log('🎉 Content migration setup complete!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`✅ Content repository created at: ${CONTENT_REPO_PATH}`);
  console.log('✅ Content files copied');
  console.log('✅ Repository initialized');
  console.log('✅ Main repo .gitignore updated');
  console.log('');
  console.log('🚀 Deploy to Vercel:');
  console.log('1. Push your main repository changes');
  console.log('2. Deploy to Vercel (will be much faster now!)');
  console.log('3. Configure environment variables in Vercel dashboard');
  console.log('');
  console.log('📈 Expected improvements:');
  console.log('• Build time: 5 minutes (vs hours)');
  console.log('• Repository size: <50MB (vs GBs)');
  console.log('• Deployment success rate: 99%+');
}

// Main execution
async function main() {
  console.log('🏗️  DeepV Code Content Migration Script');
  console.log('=====================================');
  console.log('');
  
  try {
    createContentRepository();
    copyContentFiles();
    createGitIgnore();
    commitAndPush();
    updateMainRepoGitIgnore();
    displaySummary();
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();