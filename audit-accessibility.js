#!/usr/bin/env node

const axios = require('axios');
const { getAxeResults } = require('axe-core');

const BASE_URL = 'http://localhost:3000';
const PAGES = [
  { url: '/', name: 'Home' },
  { url: '/treks', name: 'Trek List' },
  { url: '/treks/everest-base-camp', name: 'Trek Detail' },
  { url: '/compare', name: 'Compare' },
];

async function scanPage(url) {
  try {
    const response = await axios.get(`${BASE_URL}${url}`);
    console.log(`✓ Fetched ${url} (${response.status})`);
    return response.data;
  } catch (error) {
    console.error(`✗ Failed to fetch ${url}: ${error.message}`);
    return null;
  }
}

async function runAudit() {
  console.log('🔍 TrekMapper Accessibility Audit Starting...\n');
  
  for (const page of PAGES) {
    console.log(`📄 Scanning: ${page.name} (${page.url})`);
    const html = await scanPage(page.url);
    
    if (!html) {
      console.log('  ✗ Could not scan page\n');
      continue;
    }
    
    // Simple HTML checks (since axe-core needs a headless browser)
    const checks = {
      hasTitle: /<title>/i.test(html),
      hasH1: /<h1/i.test(html),
      hasAltText: /alt="/i.test(html),
      hasLabels: /<label/i.test(html),
      hasAriaLabel: /aria-label/i.test(html),
    };
    
    console.log('  Found:');
    console.log(`    - Title: ${checks.hasTitle ? '✓' : '✗'}`);
    console.log(`    - H1 heading: ${checks.hasH1 ? '✓' : '✗'}`);
    console.log(`    - Alt text: ${checks.hasAltText ? '✓' : '✗'}`);
    console.log(`    - Form labels: ${checks.hasLabels ? '✓' : '✗'}`);
    console.log(`    - ARIA labels: ${checks.hasAriaLabel ? '✓' : '✗'}`);
    console.log('');
  }
  
  console.log('✅ Quick scan complete. For full audit, use:');
  console.log('   1. Browser DevTools > Lighthouse (best)\n');
  console.log('   2. axe DevTools extension\n');
  console.log('   3. WAVE extension\n');
}

runAudit().catch(console.error);
