#!/usr/bin/env node

/**
 * Content Validation Script for DeepV Code
 * Validates MDX files and frontmatter against schema before production deployment
 * 
 * Usage: node validate-content.js [staging-directory] [schema-file]
 * Example: node validate-content.js staging/guides content-schema.json
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

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

class ContentValidator {
  constructor(schemaPath) {
    this.schema = this.loadSchema(schemaPath);
    this.errors = [];
    this.warnings = [];
  }

  loadSchema(schemaPath) {
    try {
      const schemaContent = fs.readFileSync(schemaPath, 'utf8');
      return JSON.parse(schemaContent);
    } catch (error) {
      log('red', `❌ Failed to load schema from ${schemaPath}: ${error.message}`);
      process.exit(1);
    }
  }

  validateFilename(filename) {
    const filenamePattern = /^[a-z0-9-]+-[a-f0-9]{8}\.mdx$/;
    if (!filenamePattern.test(filename)) {
      return {
        valid: false,
        error: `Filename must match pattern: {descriptive-title}-{uniqueId}.mdx (kebab-case with 8-char hex ID)`
      };
    }
    return { valid: true };
  }

  validateFrontmatter(frontmatter, filename) {
    const required = this.schema.article_schema.frontmatter_required;
    const types = this.schema.article_schema.frontmatter_types;
    const errors = [];

    // Check required fields
    for (const field of required) {
      if (!(field in frontmatter)) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Type and format validation
    if (frontmatter.title && typeof frontmatter.title !== 'string') {
      errors.push('title must be a string');
    }
    if (frontmatter.title && frontmatter.title.length < 5) {
      errors.push('title must be at least 5 characters (too short for SEO)');
    }

    // Informational note for display optimization (not an error)
    if (frontmatter.title && frontmatter.title.length > 60) {
      warnings.push(`Title is ${frontmatter.title.length} characters - may be truncated in SERP display (~60 char limit), but full title still provides SEO value`);
    }

    if (frontmatter.slug && !/^[a-z0-9-]+$/.test(frontmatter.slug)) {
      errors.push('slug must be kebab-case (lowercase letters, numbers, hyphens only)');
    }

    if (frontmatter.description && (frontmatter.description.length < 20 || frontmatter.description.length > 200)) {
      errors.push('description must be 20-200 characters (essential for SEO)');
    }

    if (frontmatter.category) {
      const validCategories = ['databases', 'mobile', 'programming-languages', 'system-devops', 'web-frontend'];
      if (!validCategories.includes(frontmatter.category)) {
        errors.push(`category must be one of: ${validCategories.join(', ')}`);
      }
    }

    if (frontmatter.difficulty) {
      const validDifficulties = ['beginner', 'intermediate', 'advanced'];
      if (!validDifficulties.includes(frontmatter.difficulty)) {
        errors.push(`difficulty must be one of: ${validDifficulties.join(', ')}`);
      }
    }

    if (frontmatter.readTime && (typeof frontmatter.readTime !== 'number' || frontmatter.readTime < 1 || frontmatter.readTime > 60)) {
      errors.push('readTime must be a number between 1-60 minutes');
    }

    if (frontmatter.lastUpdated && !this.isValidISODate(frontmatter.lastUpdated)) {
      errors.push('lastUpdated must be a valid ISO date string');
    }

    // Tags validation (can be string or array)
    if (frontmatter.tags) {
      if (typeof frontmatter.tags === 'string') {
        // Convert comma-separated string to array for validation
        const tagsArray = frontmatter.tags.split(',').map(t => t.trim()).filter(t => t);
        if (tagsArray.length === 0) {
          errors.push('tags cannot be empty');
        }
      } else if (Array.isArray(frontmatter.tags)) {
        if (frontmatter.tags.length === 0) {
          errors.push('tags array cannot be empty');
        }
      } else {
        errors.push('tags must be a string or array');
      }
    }

    return errors;
  }

  validateContent(content, filename) {
    const warnings = [];

    // Check for minimum content length
    if (content.length < 100) {
      warnings.push('Content is very short (< 100 characters)');
    }

    // Check for proper heading structure
    if (!content.match(/^#[^#]/m)) {
      warnings.push('Missing main heading (# Title)');
    }

    // Check for code blocks without language specification
    const codeBlocksWithoutLang = content.match(/```\s*\n/g);
    if (codeBlocksWithoutLang && codeBlocksWithoutLang.length > 0) {
      warnings.push(`Found ${codeBlocksWithoutLang.length} code block(s) without language specification - use \`\`\`javascript, \`\`\`sql, \`\`\`mermaid, or \`\`\`text for generic content`);
    }

    // Check for Mermaid diagrams that might be missing proper language tag
    const potentialMermaidBlocks = content.match(/```\s*\n\s*(flowchart|graph|sequenceDiagram)/gm);
    if (potentialMermaidBlocks && potentialMermaidBlocks.length > 0) {
      warnings.push(`Found ${potentialMermaidBlocks.length} potential Mermaid diagram(s) without 'mermaid' language tag - use \`\`\`mermaid`);
    }

    // Check for common language specification mistakes
    const commonMistakes = [
      { pattern: /```js\n/g, correct: 'javascript', wrong: 'js' },
      { pattern: /```py\n/g, correct: 'python', wrong: 'py' },
      { pattern: /```shell\n/g, correct: 'bash', wrong: 'shell' },
      { pattern: /```yml\n/g, correct: 'yaml', wrong: 'yml' },
      { pattern: /```md\n/g, correct: 'markdown', wrong: 'md' },
      { pattern: /```node\n/g, correct: 'javascript', wrong: 'node' }
    ];

    commonMistakes.forEach(mistake => {
      const matches = content.match(mistake.pattern);
      if (matches && matches.length > 0) {
        warnings.push(`Found ${matches.length} code block(s) using '${mistake.wrong}' - use '${mistake.correct}' instead for better syntax highlighting`);
      }
    });

    // Check for good practices
    const allCodeBlocks = content.match(/```(\w+)/g);
    if (allCodeBlocks && allCodeBlocks.length > 0) {
      const langCount = allCodeBlocks.length;
      const uniqueLangs = [...new Set(allCodeBlocks.map(block => block.replace('```', '')))];
      // This is actually good - just for info
      if (langCount >= 3) {
        warnings.push(`✅ Good: Found ${langCount} properly tagged code blocks with ${uniqueLangs.length} different languages`);
      }
    }

    // Check for image placeholders and validate format
    const imagePlaceholders = content.match(/!\[([^\]]+)\]\(PLACEHOLDER:\s*([^)]+)\)/g);
    if (imagePlaceholders && imagePlaceholders.length > 0) {
      imagePlaceholders.forEach(placeholder => {
        const match = placeholder.match(/!\[([^\]]+)\]\(PLACEHOLDER:\s*([^)]+)\)/);
        if (match) {
          const title = match[1];
          const description = match[2];
          
          // Check if title is descriptive enough
          if (title.length < 5) {
            warnings.push(`Image placeholder title too short: "${title}" - should be more descriptive`);
          }
          
          // Check if description is detailed enough
          if (description.length < 20) {
            warnings.push(`Image placeholder description too short: "${description}" - should explain what the image shows`);
          }
        }
      });
      
      warnings.push(`✅ Found ${imagePlaceholders.length} properly formatted image placeholder(s)`);
    }

    // Check for standard markdown images (should use placeholders instead)
    const standardImages = content.match(/!\[([^\]]*)\]\((?!PLACEHOLDER:)([^)]+)\)/g);
    if (standardImages && standardImages.length > 0) {
      warnings.push(`Found ${standardImages.length} standard markdown image(s) - consider using PLACEHOLDER format for upstream generation`);
    }

    return warnings;
  }

  isValidISODate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) && date.toISOString() === dateString;
  }

  validateFile(filePath) {
    const filename = path.basename(filePath);
    log('blue', `\n📄 Validating: ${filename}`);

    try {
      // Validate filename
      const filenameValidation = this.validateFilename(filename);
      if (!filenameValidation.valid) {
        this.errors.push(`${filename}: ${filenameValidation.error}`);
        log('red', `  ❌ ${filenameValidation.error}`);
        return;
      }

      // Parse file
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter, content } = matter(fileContent);

      // Validate frontmatter
      const frontmatterErrors = this.validateFrontmatter(frontmatter, filename);
      if (frontmatterErrors.length > 0) {
        frontmatterErrors.forEach(error => {
          this.errors.push(`${filename}: ${error}`);
          log('red', `  ❌ ${error}`);
        });
      }

      // Validate content (warnings only)
      const contentWarnings = this.validateContent(content, filename);
      if (contentWarnings.length > 0) {
        contentWarnings.forEach(warning => {
          this.warnings.push(`${filename}: ${warning}`);
          log('yellow', `  ⚠️  ${warning}`);
        });
      }

      if (frontmatterErrors.length === 0) {
        log('green', `  ✅ Valid`);
      }

    } catch (error) {
      this.errors.push(`${filename}: Failed to parse file - ${error.message}`);
      log('red', `  ❌ Failed to parse: ${error.message}`);
    }
  }

  validateDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      log('red', `❌ Directory not found: ${dirPath}`);
      return false;
    }

    const files = fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.mdx'))
      .map(file => path.join(dirPath, file));

    if (files.length === 0) {
      log('yellow', `⚠️  No MDX files found in ${dirPath}`);
      return true;
    }

    log('cyan', `🔍 Validating ${files.length} MDX files in ${dirPath}`);

    files.forEach(file => this.validateFile(file));

    return this.errors.length === 0;
  }

  printSummary() {
    log('cyan', '\n📊 Validation Summary:');
    
    if (this.errors.length === 0) {
      log('green', `✅ All files are valid!`);
    } else {
      log('red', `❌ Found ${this.errors.length} error(s):`);
      this.errors.forEach(error => log('red', `   • ${error}`));
    }

    if (this.warnings.length > 0) {
      log('yellow', `⚠️  Found ${this.warnings.length} warning(s):`);
      this.warnings.forEach(warning => log('yellow', `   • ${warning}`));
    }

    return this.errors.length === 0;
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    log('red', 'Usage: node validate-content.js <staging-directory> <schema-file>');
    log('yellow', 'Example: node validate-content.js staging/guides content-schema.json');
    process.exit(1);
  }

  const [stagingDir, schemaFile] = args;

  log('cyan', '🚀 DeepV Code Content Validator');
  log('cyan', '================================');

  const validator = new ContentValidator(schemaFile);
  const isValid = validator.validateDirectory(stagingDir);
  const summary = validator.printSummary();

  if (!summary) {
    log('red', '\n❌ Validation failed! Content cannot be promoted to production.');
    process.exit(1);
  } else {
    log('green', '\n✅ Validation successful! Content is ready for production.');
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

module.exports = { ContentValidator };