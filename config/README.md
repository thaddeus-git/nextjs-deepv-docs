# DeepV Code Configuration

This directory contains all project configuration files and schemas for the DeepV Code platform.

## Core Schemas

### Required for Content Generation
- `content-schema.json` - Complete content requirements, code language specifications, Mermaid support
- `article-index-schema.json` - Article index structure, URL patterns, consistency requirements
- `categories.json` - Valid category/subcategory combinations (in `/content/config/`)

### Project Information  
- `project.json` - Core project metadata, architecture, environment variables
- `tech-stack.json` - Technology stack, dependencies, deployment configuration

## Comprehensive Guides

### Integration & Templates
- `upstream-integration-guide.json` - Complete upstream integration workflow with all schema URLs
- `content-templates.json` - Ready-to-use MDX templates, code examples, frontmatter examples
- `seo-metadata-schema.json` - SEO optimization requirements, title/description guidelines
- `validation-checklist.json` - Quality assurance checklist, validation workflows

## Usage

These configuration files serve as the single source of truth for:

1. **Content Generation** - Upstream systems fetch schemas to understand all requirements
2. **Validation** - Scripts validate content against these schemas before deployment
3. **SEO Optimization** - Guidelines ensure search engine optimization best practices
4. **Quality Assurance** - Checklists maintain consistent content quality
5. **Development** - Team reference for project specifications

## Upstream Integration URLs

All schemas are available via GitHub raw URLs:

```bash
# Core Requirements
curl -s https://raw.githubusercontent.com/thaddeus-git/nextjs-deepv-docs/main/config/content-schema.json
curl -s https://raw.githubusercontent.com/thaddeus-git/nextjs-deepv-docs/main/config/article-index-schema.json  
curl -s https://raw.githubusercontent.com/thaddeus-git/nextjs-deepv-docs/main/content/config/categories.json

# Integration Guide
curl -s https://raw.githubusercontent.com/thaddeus-git/nextjs-deepv-docs/main/config/upstream-integration-guide.json

# Templates & SEO
curl -s https://raw.githubusercontent.com/thaddeus-git/nextjs-deepv-docs/main/config/content-templates.json
curl -s https://raw.githubusercontent.com/thaddeus-git/nextjs-deepv-docs/main/config/seo-metadata-schema.json

# Quality Assurance
curl -s https://raw.githubusercontent.com/thaddeus-git/nextjs-deepv-docs/main/config/validation-checklist.json
```

## Schema Features

### Content Schema v2.2.0
- ✅ 100+ supported programming languages with examples
- ✅ Mermaid diagram specifications (flowchart, sequence, class)
- ✅ Zero-tolerance code block language requirements
- ✅ Comprehensive validation rules

### SEO Schema
- ✅ Title optimization (5-70 chars, keyword placement)
- ✅ Description optimization (20-200 chars, user intent)
- ✅ Tag strategies (3-8 tags, technology + content type)
- ✅ URL structure requirements

### Templates
- ✅ Complete MDX article templates
- ✅ Code examples for major languages
- ✅ Frontmatter examples by category
- ✅ Quality checklist templates

## Version Control

Each schema includes:
- Version numbers for compatibility tracking
- Last updated timestamps
- Change descriptions
- Backward compatibility notes

This ensures upstream systems can safely consume schema updates without breaking existing workflows.