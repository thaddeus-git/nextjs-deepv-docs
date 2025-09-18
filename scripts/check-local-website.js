#!/usr/bin/env node

const { chromium } = require('playwright');

async function checkLocalWebsite() {
  console.log('🚀 Checking local DeepV Code website...\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Test the homepage
    console.log('🏠 Testing homepage: http://localhost:3002');
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    
    const title = await page.title();
    console.log(`✅ Page title: "${title}"`);
    
    // Check for articles on homepage
    const articleLinks = await page.locator('a[href*="/guides/"]').count();
    console.log(`📄 Article links found on homepage: ${articleLinks}`);
    
    if (articleLinks > 0) {
      const firstArticleHref = await page.locator('a[href*="/guides/"]').first().getAttribute('href');
      console.log(`🔗 First article link: ${firstArticleHref}`);
    }
    
    // Test /guides page
    console.log('\n📚 Testing /guides page...');
    try {
      await page.goto('http://localhost:3002/guides', { waitUntil: 'networkidle' });
      const guidesTitle = await page.title();
      console.log(`✅ Guides page title: "${guidesTitle}"`);
      
      // Check for articles on guides page
      const guidesArticleLinks = await page.locator('a[href*="/guides/"]').count();
      console.log(`📄 Article links found on guides page: ${guidesArticleLinks}`);
      
      // Check for "no guides available" message
      const noGuidesMessage = await page.locator('text=No guides available').count();
      if (noGuidesMessage > 0) {
        console.log('⚠️  "No guides available" message found - articles may not be loading from ISR');
      }
      
      // Check for category sections
      const categoryHeaders = await page.locator('h2').count();
      console.log(`📂 Category headers found: ${categoryHeaders}`);
      
    } catch (error) {
      console.log(`❌ Guides page error: ${error.message}`);
    }
    
    // Test a specific article if we can find one
    console.log('\n📖 Testing specific article...');
    try {
      await page.goto('http://localhost:3002/guides/how-to-do-word-counts-for-a-mixture-of-english-and-chinese', { waitUntil: 'networkidle' });
      const articleTitle = await page.title();
      console.log(`✅ Article page title: "${articleTitle}"`);
      
      // Check if article content is loaded
      const articleContent = await page.locator('article').count();
      console.log(`📝 Article content sections found: ${articleContent}`);
      
      if (articleContent === 0) {
        console.log('⚠️  No article content found - ISR may not be loading external content in dev mode');
      }
      
    } catch (error) {
      console.log(`❌ Article page error: ${error.message}`);
    }
    
    // Check for error messages in console
    console.log('\n🔍 Checking for JavaScript console errors...');
    const logs = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(msg.text());
      }
    });
    
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Wait for any async operations
    
    if (logs.length > 0) {
      console.log('❌ JavaScript errors found:');
      logs.forEach(log => console.log(`   ${log}`));
    } else {
      console.log('✅ No JavaScript console errors found');
    }
    
    // Take a screenshot
    await page.screenshot({ 
      path: '/Users/thaddeus/Documents/on-going projects/nextjs-deepv-docs/temp-files/local-website-screenshot.png',
      fullPage: true 
    });
    console.log('\n📸 Screenshot saved to temp-files/local-website-screenshot.png');
    
  } catch (error) {
    console.error(`❌ Error during local website check: ${error.message}`);
  } finally {
    await browser.close();
  }
}

checkLocalWebsite().catch(console.error);