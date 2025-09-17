# DeepV Code Configuration

This directory contains all essential project configuration files.

## Configuration Files

### `project.json`
Core project information including:
- Project identity and deployment details
- Repository URLs and purposes
- Architecture strategy (ISR)
- Required environment variables

### `content-schema.json` 
Complete content schema definition:
- MDX article frontmatter requirements
- Workflow directory paths
- Validation rules for content
- Data types and formats

### `tech-stack.json`
Complete technology stack:
- Frontend framework details
- Content processing pipeline
- Deployment configuration  
- Development tools and dependencies

## Usage

These config files serve as the single source of truth for:
- Upstream workflow integration
- Content validation schemas
- Deployment requirements
- Development environment setup

## Important Paths

- **Content Schema**: `./config/content-schema.json`
- **Project Config**: `./config/project.json` 
- **Tech Stack**: `./config/tech-stack.json`
- **Categories**: `./content/config/categories.json`

Instead of remembering specific field requirements, always refer to these configuration files for the current, authoritative specifications.