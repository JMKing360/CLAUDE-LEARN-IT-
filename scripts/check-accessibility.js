import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173';
const paths = ['/', '/first-hour/', '/privacy.html'];
const navigationTimeoutMs = 15000;

const browser = await chromium.launch();
const context = await browser.newContext();
const failures = [];

try {
  for (const path of paths) {
    const page = await context.newPage();
    const url = new URL(path, baseUrl).toString();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: navigationTimeoutMs });
    const results = await new AxeBuilder({ page }).analyze();
    if (results.violations.length > 0) {
      failures.push({ url, violations: results.violations });
    }
    await page.close();
  }
} finally {
  await context.close();
  await browser.close();
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`Accessibility violations for ${failure.url}:`);
    for (const violation of failure.violations) {
      console.error(`- ${violation.id}: ${violation.help} (${violation.impact})`);
      for (const node of violation.nodes) {
        console.error(`  target: ${node.target.join(', ')}`);
      }
    }
  }
  process.exit(1);
}

console.log(`Accessibility verification passed for ${paths.length} pages`);
