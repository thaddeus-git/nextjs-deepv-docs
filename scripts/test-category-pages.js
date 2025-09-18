const { chromium } = require('playwright');

async function testCategoryPages() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Testing category pages...\n');
    
    // Test /databases page
    console.log('📊 Testing /databases page...');
    try {
      await page.goto('http://localhost:3000/databases', { waitUntil: 'networkidle' });
      const dbTitle = await page.title();
      console.log(`✅ Databases page title: "${dbTitle}"`);
      
      const dbArticles = await page.locator('a[href*="/guides/"]').count();
      console.log(`📄 Database articles found: ${dbArticles}`);
    } catch (error) {
      console.log(`❌ Databases page error: ${error.message}`);
    }
    
    // Test /web-frontend page  
    console.log('\n🌐 Testing /web-frontend page...');
    try {
      await page.goto('http://localhost:3000/web-frontend', { waitUntil: 'networkidle' });
      const webTitle = await page.title();
      console.log(`✅ Web Frontend page title: "${webTitle}"`);
      
      const webArticles = await page.locator('a[href*="/guides/"]').count();
      console.log(`📄 Web Frontend articles found: ${webArticles}`);
    } catch (error) {
      console.log(`❌ Web Frontend page error: ${error.message}`);
    }
    
    // Test /programming-languages page
    console.log('\n💻 Testing /programming-languages page...');
    try {
      await page.goto('http://localhost:3000/programming-languages', { waitUntil: 'networkidle' });
      const progTitle = await page.title();
      console.log(`✅ Programming Languages page title: "${progTitle}"`);
      
      const progArticles = await page.locator('a[href*="/guides/"]').count();
      console.log(`📄 Programming Languages articles found: ${progArticles}`);
    } catch (error) {
      console.log(`❌ Programming Languages page error: ${error.message}`);
    }
    
    // Check what's being generated
    console.log('\n📋 Checking /guides page for comparison...');
    await page.goto('http://localhost:3000/guides', { waitUntil: 'networkidle' });
    const guidesArticles = await page.locator('a[href*="/guides/"]').count();
    console.log(`📄 Total articles on guides page: ${guidesArticles}`);
    
  } catch (error) {
    console.error('❌ Error during category page testing:', error);
  } finally {
    await browser.close();
  }
}

testCategoryPages().catch(console.error);