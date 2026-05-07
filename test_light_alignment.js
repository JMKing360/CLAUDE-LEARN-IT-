const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const fileUrl = 'file://' + path.resolve(__dirname, 'index.html');
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });

  const visibleText = await page.locator('body').innerText();
  if (!visibleText.includes('KOORA')) throw new Error('KOORA brand marker missing');

  const progressHeight = await page.locator('#progress').evaluate(el => getComputedStyle(el).height);
  if (progressHeight !== '4px') throw new Error(`Expected 4px progress bar; got ${progressHeight}`);

  await page.fill('#participantName', 'Review');
  await page.getByRole('button', { name: /begin the protocol/i }).click();
  await page.waitForSelector('#screen-question.active');

  let qCount = await page.locator('#qCount').innerText();
  if (!/Question 1 of/.test(qCount)) throw new Error(`Unexpected first question count: ${qCount}`);

  const nextDisplayBefore = await page.locator('#qNext').evaluate(el => getComputedStyle(el).display);
  if (nextDisplayBefore !== 'none') throw new Error(`Next should be hidden before selection; display=${nextDisplayBefore}`);

  await page.locator('.opt').first().click();
  const nextDisplayAfter = await page.locator('#qNext').evaluate(el => getComputedStyle(el).display);
  const nextDisabledAfter = await page.locator('#qNext').evaluate(el => el.disabled);
  if (nextDisplayAfter === 'none' || nextDisabledAfter) throw new Error('Next should appear and be enabled after selection');

  await page.waitForFunction(() => document.querySelector('#qCount')?.textContent.includes('Question 2 of'), null, { timeout: 3200 });

  const total = await page.evaluate(() => window.TOTAL || (typeof TOTAL !== 'undefined' ? TOTAL : null));
  if (!total || total < 10) throw new Error(`Unexpected TOTAL value: ${total}`);

  for (let i = 2; i <= total; i++) {
    await page.waitForSelector('#screen-question.active');
    await page.locator('.opt').first().click();
    await page.waitForSelector('#qNext', { state: 'visible', timeout: 1000 });
    await page.click('#qNext');
  }

  await page.waitForSelector('#screen-results.active', { timeout: 5000 });
  const resultText = await page.locator('#screen-results').innerText();
  if (!/Result|score|reflex|KOORA|protocol/i.test(resultText)) throw new Error('Results screen did not render expected text');

  await browser.close();
  console.log(JSON.stringify({ ok: true, progressHeight, total, checks: ['brand markers', 'hidden next before selection', 'visible next after selection', '2s auto-advance', 'full completion'] }, null, 2));
})().catch(async err => {
  console.error(err);
  process.exit(1);
});
