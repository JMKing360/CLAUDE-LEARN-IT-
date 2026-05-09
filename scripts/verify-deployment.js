import fs from 'node:fs';

const htmlFiles = ['index.html', 'first-hour.html'];

for (const file of htmlFiles) {
  if (!fs.existsSync(file)) throw new Error(`${file} is missing`);
  const html = fs.readFileSync(file, 'utf8');
  if (/emailjs/i.test(html)) throw new Error(`${file} still contains EmailJS`);
}

const firstHour = fs.readFileSync('first-hour.html', 'utf8');
if (!firstHour.includes('window.HOM_CONFIG.ghlWebhookUrl')) {
  throw new Error('GHL environment configuration hook is missing');
}
if (!firstHour.includes('services\\.leadconnectorhq\\.com\\/hooks\\/')) {
  throw new Error('GHL webhook allow-list guard is missing');
}
if (!firstHour.includes('GHL webhook not configured')) {
  throw new Error('GHL webhook disabled-state guard is missing');
}

const redirects = fs.readFileSync('_redirects', 'utf8');
for (const route of ['/first-hour', '/privacy']) {
  if (!redirects.includes(route)) throw new Error(`missing redirect route ${route}`);
}

console.log('Deployment verification passed');
