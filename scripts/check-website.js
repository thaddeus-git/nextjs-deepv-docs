#!/usr/bin/env node

const { chromium } = require('playwright');

async function checkWebsite() {
  console.log('🚀 Starting DeepV Code website analysis...\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Test the article page mentioned by user
    const articleUrl = 'https://deepvcode.com/guides/how-to-do-word-counts-for-a-mixture-of-english-and-chinese';
    console.log(`📄 Testing article: ${articleUrl}`);
    
    await page.goto(articleUrl, { waitUntil: 'networkidle' });
    
    // Check if page loaded successfully
    const title = await page.title();
    console.log(`✅ Page title: "${title}"`);
    
    // Check for basic structure
    const h1 = await page.locator('h1').first().textContent();
    console.log(`📖 Main heading: "${h1}"`);
    
    // Check for Tailwind CSS classes
    const hasTailwind = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="text-"], [class*="bg-"], [class*="p-"], [class*="m-"]');
      return elements.length > 0;
    });
    console.log(`🎨 Tailwind CSS detected: ${hasTailwind ? '✅ Yes' : '❌ No'}`);
    
    // Check article content styling
    const contentStyles = await page.evaluate(() => {
      const article = document.querySelector('article');
      if (!article) return null;
      
      const computedStyle = window.getComputedStyle(article);
      return {
        hasProseClass: article.classList.contains('prose'),
        fontFamily: computedStyle.fontFamily,
        fontSize: computedStyle.fontSize,
        lineHeight: computedStyle.lineHeight,
        maxWidth: computedStyle.maxWidth,
        color: computedStyle.color
      };
    });
    
    console.log('\n📝 Article Content Styling:');
    if (contentStyles) {
      console.log(`   Prose class: ${contentStyles.hasProseClass ? '✅ Yes' : '❌ No'}`);
      console.log(`   Font family: ${contentStyles.fontFamily}`);
      console.log(`   Font size: ${contentStyles.fontSize}`);
      console.log(`   Line height: ${contentStyles.lineHeight}`);
      console.log(`   Max width: ${contentStyles.maxWidth}`);
      console.log(`   Text color: ${contentStyles.color}`);
    } else {
      console.log('   ❌ No article element found');
    }
    
    // Check for code blocks
    const codeBlocks = await page.locator('pre code').count();
    console.log(`\n💻 Code blocks found: ${codeBlocks}`);
    
    // Check heading hierarchy
    const headings = await page.evaluate(() => {
      const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
      const headings = {};
      headingTags.forEach(tag => {
        headings[tag] = document.querySelectorAll(tag).length;
      });
      return headings;
    });
    
    console.log('\n📚 Heading structure:');
    Object.entries(headings).forEach(([tag, count]) => {
      if (count > 0) console.log(`   ${tag.toUpperCase()}: ${count}`);
    });
    
    // Take a screenshot for visual review
    await page.screenshot({ 
      path: '/Users/thaddeus/Documents/on-going projects/nextjs-deepv-docs/temp-files/website-screenshot.png',
      fullPage: true 
    });
    console.log('\n📸 Screenshot saved to temp-files/website-screenshot.png');
    
    // Check responsive design
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await page.screenshot({ 
      path: '/Users/thaddeus/Documents/on-going projects/nextjs-deepv-docs/temp-files/mobile-screenshot.png',
      fullPage: true 
    });
    console.log('📱 Mobile screenshot saved to temp-files/mobile-screenshot.png');
    
    // Test homepage
    console.log('\n🏠 Testing homepage...');
    await page.goto('https://deepvcode.com', { waitUntil: 'networkidle' });
    const homeTitle = await page.title();
    console.log(`✅ Homepage title: "${homeTitle}"`);
    
    // Check for articles list
    const articleLinks = await page.locator('a[href*="/guides/"]').count();
    console.log(`📄 Article links found: ${articleLinks}`);
    
    // Test /guides page
    console.log('\n📚 Testing /guides page...');
    try {
      await page.goto('https://deepvcode.com/guides', { waitUntil: 'networkidle' });
      const guidesTitle = await page.title();
      console.log(`✅ Guides page title: "${guidesTitle}"`);
    } catch (error) {
      console.log(`❌ Guides page error: ${error.message}`);
    }
    
  } catch (error) {
    console.error(`❌ Error during website check: ${error.message}`);
  } finally {
    await browser.close();
  }
}

checkWebsite().catch(console.error);