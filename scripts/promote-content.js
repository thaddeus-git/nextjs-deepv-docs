#!/usr/bin/env node

/**
 * Content Promotion Script for DeepV Code
 * Validates staging content and promotes to production if valid
 * 
 * Usage: node promote-content.js [content-repo-path]
 * Example: node promote-content.js ../nextjs-deepv-content
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    log('red', 'Usage: node promote-content.js <content-repo-path>');
    log('yellow', 'Example: node promote-content.js ../nextjs-deepv-content');
    process.exit(1);
  }

  const contentRepoPath = args[0];
  const stagingGuides = path.join(contentRepoPath, 'staging', 'guides');
  const stagingImages = path.join(contentRepoPath, 'staging', 'images');
  const stagingConfig = path.join(contentRepoPath, 'staging', 'config', 'article-index-update.json');
  const productionGuides = path.join(contentRepoPath, 'guides');
  const productionImages = path.join(contentRepoPath, 'images');
  const productionConfig = path.join(contentRepoPath, 'config', 'article-index.json');
  const schemaFile = path.join(contentRepoPath, 'content-schema.json');

  log('cyan', '🚀 DeepV Code Content Promotion');
  log('cyan', '===============================');

  // Step 1: Validate staging content
  log('blue', '\n📋 Step 1: Validating staging content...');
  
  try {
    execSync(`node "${path.join(__dirname, 'validate-content.js')}" "${stagingGuides}" "${schemaFile}"`, {
      stdio: 'inherit'
    });
  } catch (error) {
    log('red', '\n❌ Validation failed! Stopping promotion.');
    process.exit(1);
  }

  // Step 2: Check if there's content to promote
  log('blue', '\n📁 Step 2: Checking for content to promote...');
  
  const mdxFiles = fs.existsSync(stagingGuides) 
    ? fs.readdirSync(stagingGuides).filter(f => f.endsWith('.mdx'))
    : [];
  
  const imageFiles = fs.existsSync(stagingImages)
    ? fs.readdirSync(stagingImages).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.webp'))
    : [];
  
  const hasIndexUpdate = fs.existsSync(stagingConfig);

  if (mdxFiles.length === 0 && imageFiles.length === 0 && !hasIndexUpdate) {
    log('yellow', '⚠️  No content found in staging. Nothing to promote.');
    process.exit(0);
  }

  log('green', `📄 Found ${mdxFiles.length} articles, ${imageFiles.length} images, and ${hasIndexUpdate ? '1' : '0'} index update`);

  // Step 3: Promote content
  log('blue', '\n🔄 Step 3: Promoting content to production...');

  try {
    // Ensure production directories exist
    if (!fs.existsSync(productionGuides)) {
      fs.mkdirSync(productionGuides, { recursive: true });
    }
    if (!fs.existsSync(productionImages)) {
      fs.mkdirSync(productionImages, { recursive: true });
    }

    // Move articles
    if (mdxFiles.length > 0) {
      mdxFiles.forEach(file => {
        const source = path.join(stagingGuides, file);
        const dest = path.join(productionGuides, file);
        fs.copyFileSync(source, dest);
        log('green', `  ✅ Promoted article: ${file}`);
      });

      // Clean staging articles
      mdxFiles.forEach(file => {
        fs.unlinkSync(path.join(stagingGuides, file));
      });
    }

    // Move images
    if (imageFiles.length > 0) {
      imageFiles.forEach(file => {
        const source = path.join(stagingImages, file);
        const dest = path.join(productionImages, file);
        fs.copyFileSync(source, dest);
        log('green', `  ✅ Promoted image: ${file}`);
      });

      // Clean staging images
      imageFiles.forEach(file => {
        fs.unlinkSync(path.join(stagingImages, file));
      });
    }

    // Move index update
    if (hasIndexUpdate) {
      fs.copyFileSync(stagingConfig, productionConfig);
      fs.unlinkSync(stagingConfig);
      log('green', '  ✅ Updated article index');
    }

  } catch (error) {
    log('red', `❌ Error promoting content: ${error.message}`);
    process.exit(1);
  }

  // Step 4: Git commit and push
  log('blue', '\n📤 Step 4: Committing and pushing to GitHub...');

  try {
    process.chdir(contentRepoPath);
    
    execSync('git add .', { stdio: 'inherit' });
    
    const commitMessage = `Add ${mdxFiles.length} articles and ${imageFiles.length} images - ${new Date().toISOString().split('T')[0]}`;
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    
    execSync('git push', { stdio: 'inherit' });
    
    log('green', '✅ Content pushed to GitHub');

  } catch (error) {
    log('red', `❌ Error with Git operations: ${error.message}`);
    process.exit(1);
  }

  // Step 5: Success message
  log('green', '\n🎉 Content promotion successful!');
  log('cyan', 'Next steps:');
  log('cyan', '  • Content will appear on the website within 5 minutes (ISR auto-revalidation)');
  log('cyan', '  • Check https://deepvcode.com/ to verify new content');
  log('yellow', '  • For immediate updates, trigger manual revalidation if needed');

  process.exit(0);
}

if (require.main === module) {
  main();
}