const { chromium } = require('playwright');

async function checkProductionUrls() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🔍 Testing DeepV Code Production URLs...\n');

  const urlsToTest = [
    'https://deepvcode.com',
    'https://deepvcode.com/guides',
    'https://deepvcode.com/guides/logit-regression-and-singular-matrix-error-in-python-bbd1fbd5',
    'https://deepvcode.com/guides/how-to-do-word-counts-for-a-mixture-of-english-and-chinese-171c50c3',
    'https://deepvcode.com/guides/parse-query-string-in-javascript-3749489f',
    'https://deepvcode.com/databases'
  ];

  for (const url of urlsToTest) {
    try {
      console.log(`Testing: ${url}`);
      
      const response = await page.goto(url, { 
        waitUntil: 'networkidle', 
        timeout: 10000 
      });
      
      const status = response.status();
      console.log(`Status: ${status}`);
      
      if (status === 404) {
        console.log('❌ 404 ERROR - Page not found');
        // Check if it's Next.js 404 page or server 404
        const title = await page.title();
        const bodyText = await page.textContent('body');
        console.log(`Title: ${title}`);
        console.log(`Body contains "404": ${bodyText.includes('404')}`);
        console.log(`Body contains "not found": ${bodyText.toLowerCase().includes('not found')}`);
      } else if (status === 200) {
        console.log('✅ SUCCESS - Page loaded');
        const title = await page.title();
        console.log(`Title: ${title}`);
        
        // Check for specific content indicators
        const hasContent = await page.locator('main').count() > 0;
        console.log(`Has main content: ${hasContent}`);
        
        if (url.includes('/guides/')) {
          // Check if it's an article page
          const hasArticleLayout = await page.locator('article').count() > 0;
          const hasH1 = await page.locator('h1').count() > 0;
          console.log(`Has article layout: ${hasArticleLayout}`);
          console.log(`Has H1 title: ${hasH1}`);
        }
      } else {
        console.log(`⚠️ Unexpected status: ${status}`);
      }
      
      console.log('---\n');
      
    } catch (error) {
      console.log(`❌ Error accessing ${url}:`);
      console.log(error.message);
      console.log('---\n');
    }
  }

  // Test the routing structure by checking what URLs are actually being generated
  console.log('🔍 Checking actual routing structure...\n');
  
  try {
    await page.goto('https://deepvcode.com/guides', { waitUntil: 'networkidle' });
    
    // Look for article links to see what URL pattern is actually being used
    const articleLinks = await page.locator('a[href*="/guides/"]').all();
    console.log(`Found ${articleLinks.length} article links`);
    
    for (let i = 0; i < Math.min(5, articleLinks.length); i++) {
      const href = await articleLinks[i].getAttribute('href');
      console.log(`Article link ${i + 1}: ${href}`);
    }
    
  } catch (error) {
    console.log('Error checking guides page:', error.message);
  }

  await browser.close();
}

checkProductionUrls().catch(console.error);