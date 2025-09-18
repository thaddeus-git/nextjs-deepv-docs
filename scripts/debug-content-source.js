const { chromium } = require('playwright');

async function debugContentSource() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🔍 Debugging content source for working vs non-working articles...\n');

  // Enable console logging to see what's happening
  page.on('console', msg => {
    if (msg.type() === 'log' || msg.type() === 'error') {
      console.log(`[Browser ${msg.type()}]: ${msg.text()}`);
    }
  });

  // Test working article
  console.log('Testing WORKING article: parse-query-string-in-javascript-3749489f');
  try {
    await page.goto('https://deepvcode.com/guides/parse-query-string-in-javascript-3749489f', { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    const hasContent = await page.locator('article').count() > 0;
    const title = await page.locator('h1').textContent();
    console.log(`✅ Working article loaded: "${title}"`);
    console.log(`Has article content: ${hasContent}`);
    
  } catch (error) {
    console.log('❌ Error with working article:', error.message);
  }

  console.log('\n---\n');

  // Test non-working article
  console.log('Testing NON-WORKING article: logit-regression-and-singular-matrix-error-in-python-bbd1fbd5');
  try {
    await page.goto('https://deepvcode.com/guides/logit-regression-and-singular-matrix-error-in-python-bbd1fbd5', { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    const is404 = await page.locator('text=404').count() > 0;
    const title = await page.title();
    console.log(`❌ Non-working article: "${title}"`);
    console.log(`Is 404 page: ${is404}`);
    
  } catch (error) {
    console.log('❌ Error with non-working article:', error.message);
  }

  console.log('\n---\n');

  // Check the /guides page to see what articles are actually listed
  console.log('Checking /guides page for actual article availability...');
  try {
    await page.goto('https://deepvcode.com/guides', { waitUntil: 'networkidle' });
    
    const articleLinks = await page.locator('a[href*="/guides/"]').all();
    console.log(`\nFound ${articleLinks.length} article links on /guides page:`);
    
    for (let i = 0; i < articleLinks.length; i++) {
      const href = await articleLinks[i].getAttribute('href');
      const text = await articleLinks[i].textContent();
      console.log(`${i + 1}. ${href} - "${text?.substring(0, 50)}..."`);
    }
    
    // Check if the problematic articles are listed
    const problemArticle = 'logit-regression-and-singular-matrix-error-in-python-bbd1fbd5';
    const isListed = await page.locator(`a[href*="${problemArticle}"]`).count() > 0;
    console.log(`\n❓ Is problematic article listed on /guides page? ${isListed}`);
    
  } catch (error) {
    console.log('❌ Error checking guides page:', error.message);
  }

  await browser.close();
}

debugContentSource().catch(console.error);