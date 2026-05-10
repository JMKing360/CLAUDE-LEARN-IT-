import { test, expect } from '@playwright/test';

test.describe('The First Hour — completion flow', () => {
  test('welcome screen renders with hero copy', async ({ page }) => {
    await page.goto('/first-hour.html');
    await expect(page.getByText('without quite meaning to', { exact: false })).toBeVisible();
    await expect(page.getByText('You are not lazy')).toBeVisible();
  });

  test('begin button requires name and email', async ({ page }) => {
    await page.goto('/first-hour.html');
    const begin = page.getByRole('button', { name: /begin your first hour/i });
    await begin.click();
    // Focus should fall to the empty required field
    await expect(page.locator('#participantName')).toBeFocused();
  });

  test('full assessment completes when answered', async ({ page }) => {
    await page.goto('/first-hour.html');
    await page.fill('#participantName', 'Test');
    await page.fill('#participantEmail', 'test@example.com');
    await page.getByRole('button', { name: /begin your first hour/i }).click();

    const transitionQuestions = new Set([18, 30, 48]);

    for (let i = 1; i <= 54; i++) {
      await expect(page.locator('#qCount')).toContainText(`Question ${i} of 54`);
      await page.locator('.opt').nth(1).click();
      await page.keyboard.press('Enter');

      if (transitionQuestions.has(i)) {
        await page.getByRole('button', { name: /continue/i }).click();
      }
    }

    // Agency Matrix screen: 6 binary YES/NO questions, gated SEE MY DIAGNOSTIC
    await expect(page.getByRole('heading', { name: /six questions to map where you stand/i })).toBeVisible({ timeout: 5000 });
    const seeBtn = page.getByRole('button', { name: /see my diagnostic/i });
    await expect(seeBtn).toBeDisabled();
    for (let q = 1; q <= 6; q++) {
      await page.locator(`.agency-radio[data-q="${q}"][data-val="yes"]`).click();
    }
    await expect(seeBtn).toBeEnabled();
    await seeBtn.click();

    await expect(page.getByRole('heading', { name: /you finished/i })).toBeVisible({ timeout: 5000 });
  });

  test('matrixResolve follows the binary spec (red/green only)', async ({ page }) => {
    await page.goto('/first-hour.html');
    const out = await page.evaluate(() => {
      const W = window as unknown as {
        matrixResolve: (a: Record<number, string>) => Record<string, string>;
        matrixHasAllRed: (a: Record<number, string>) => boolean;
      };
      const allYes = W.matrixResolve({1:'yes',2:'yes',3:'yes',4:'yes',5:'yes',6:'yes'});
      const oneNoOnThink = W.matrixResolve({1:'no',2:'yes',3:'yes',4:'yes',5:'yes',6:'yes'});
      // Per spec, broad NO (Q5 or Q6) floods all four axes RED.
      const broadDownAxisYes = W.matrixResolve({1:'yes',2:'yes',3:'yes',4:'yes',5:'no',6:'yes'});
      const broadDownQ6 = W.matrixResolve({1:'yes',2:'yes',3:'yes',4:'yes',5:'yes',6:'no'});
      const allRedFlag = W.matrixHasAllRed({1:'yes',2:'yes',3:'yes',4:'yes',5:'no',6:'yes'});
      return { allYes, oneNoOnThink, broadDownAxisYes, broadDownQ6, allRedFlag };
    });
    expect(out.allYes).toEqual({think:'green',feel:'green',choose:'green',do:'green'});
    expect(out.oneNoOnThink).toEqual({think:'red',feel:'green',choose:'green',do:'green'});
    expect(out.broadDownAxisYes).toEqual({think:'red',feel:'red',choose:'red',do:'red'});
    expect(out.broadDownQ6).toEqual({think:'red',feel:'red',choose:'red',do:'red'});
    expect(out.allRedFlag).toBe(true);
  });

  test('skip-to-content link is the first focusable element', async ({ page }) => {
    await page.goto('/first-hour.html');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.textContent || '');
    expect(focused.toLowerCase()).toContain('skip');
  });

  test('autosave persists across reload', async ({ page }) => {
    await page.goto('/first-hour.html');
    await page.fill('#participantName', 'Persisted');
    await page.fill('#participantEmail', 'persist@example.com');
    await page.getByRole('button', { name: /begin/i }).click();
    await page.locator('.opt').first().click();
    await page.waitForTimeout(1700);
    await page.reload();
    // The instrument should detect the in-progress state in localStorage
    const inProgress = await page.evaluate(() =>
      localStorage.getItem('hom_firsthour_inprogress')
    );
    expect(inProgress).toBeTruthy();
  });
});

test.describe('The First Hour — pure-function smoke (page.evaluate)', () => {
  test('personalize() handles all three placeholder positions', async ({ page }) => {
    await page.goto('/first-hour.html');
    const out = await page.evaluate(() => {
      const W = window as unknown as { participantName: string; personalize: (s: string) => string };
      W.participantName = 'Tina';
      const a = W.personalize('{name,}you finished.');
      const b = W.personalize('Are you ready{,name}?');
      const c = W.personalize('Welcome, {name}.');
      W.participantName = '';
      const d = W.personalize('{name,}you finished.');
      const e = W.personalize('Are you ready{,name}?');
      return { a, b, c, d, e };
    });
    expect(out.a).toBe('Tina, you finished.');
    expect(out.b).toBe('Are you ready, Tina?');
    expect(out.c).toBe('Welcome, Tina.');
    expect(out.d).toBe('You finished.');
    expect(out.e).toBe('Are you ready?');
  });

  test('safe() escapes HTML in user-supplied strings', async ({ page }) => {
    await page.goto('/first-hour.html');
    const out = await page.evaluate(() => {
      const W = window as unknown as { safe: (s: string) => string };
      return {
        plain: W.safe('Tina'),
        amp: W.safe('Tina & Job'),
        script: W.safe('<script>alert(1)</script>'),
        empty: W.safe(''),
        falsy: W.safe(null as unknown as string),
      };
    });
    expect(out.plain).toBe('Tina');
    expect(out.amp).toBe('Tina &amp; Job');
    expect(out.script).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(out.empty).toBe('');
    expect(out.falsy).toBe('');
  });

  test('formatDate() returns en-GB long form', async ({ page }) => {
    await page.goto('/first-hour.html');
    const out = await page.evaluate(() => {
      const W = window as unknown as { formatDate: (iso: string) => string };
      return W.formatDate('2026-05-10T12:00:00.000Z');
    });
    expect(out).toMatch(/10 May 2026/);
  });
});
