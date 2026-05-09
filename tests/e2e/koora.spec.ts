import { test, expect } from '@playwright/test';

test.describe('KOORA UNFINISHED — instrument flow', () => {
  test('welcome screen renders with hero copy + brand block', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /What is running you/ })).toBeVisible();
    await expect(page.getByText("You do not have a productivity problem", { exact: false })).toBeVisible();
    // Brand block: KOORA wordmark + trademark line both render
    await expect(page.getByAltText('KOORA').first()).toBeVisible();
    await expect(page.getByText('©House of Mastery with Dr Job Mogire', { exact: false })).toBeVisible();
  });

  test('cover-letter signature reads only "Rooting for you. Job"', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/Rooting for you/)).toBeVisible();
    // The full-name signature should not appear in the cover letter
    const sig = page.locator('.cover-letter__sig');
    await expect(sig).not.toContainText(/Mogire/);
    await expect(sig).not.toContainText('2026');
    await expect(sig).not.toContainText(/KOORA/);
  });

  test('section eyebrows use the new question-form prompts', async ({ page }) => {
    await page.goto('/');
    // Drive welcome form
    await page.fill('#participantName', 'Tester');
    await page.locator('button[data-enroll="1"]').click();
    await page.getByRole('button', { name: /^Begin$/ }).click();

    // Section 1 eyebrow
    await expect(page.locator('#qPrompt')).toContainText(/Sneaky reflexes/i);
  });

  test('full assessment completes and reaches the seal section via I MUST FINISH', async ({ page }) => {
    await page.goto('/');
    await page.fill('#participantName', 'Goldenpath');
    await page.locator('button[data-enroll="1"]').click();
    await page.getByRole('button', { name: /^Begin$/ }).click();

    // 60 questions, transitions at q:16, q:23, q:31, q:35, q:39, q:49
    const transitionQs = new Set([16, 23, 31, 35, 39, 49]);
    for (let i = 1; i <= 60; i++) {
      await expect(page.locator('#qSection')).toContainText('Section');
      await page.locator('.opt').nth(1).click();
      // Auto-advance kicks in; if a transition fires, click Continue
      if (transitionQs.has(i)) {
        await page.getByRole('button', { name: /continue/i }).click();
      }
    }

    // Ack screen
    await expect(page.locator('#ackH1')).toContainText(/you finished/i, { timeout: 6000 });
    await expect(page.locator('#ackText')).toContainText(/Sixty items/);
    await expect(page.getByRole('button', { name: /SHOW ME/ })).toBeVisible();

    await page.getByRole('button', { name: /SHOW ME/ }).click();

    // Result page
    await expect(page.locator('#rHeadline')).toContainText(/running you/);

    // Seal section is hidden; transition appears
    await expect(page.locator('#sealSection')).toBeHidden();
    await expect(page.getByRole('button', { name: /I MUST FINISH/ })).toBeVisible();

    await page.getByRole('button', { name: /I MUST FINISH/ }).click();
    await expect(page.locator('#sealSection')).toBeVisible();
    await expect(page.locator('#sealIntroH')).toContainText(/Goldenpath/);
  });

  test('GET MY REPORT button is gated by all three fields', async ({ page }) => {
    await page.goto('/');
    // Take the assessment quickly via test hook (sets state and reveals seal)
    await page.evaluate(() => {
      const W = window as unknown as { setEnroll?: (v: boolean) => void };
      W.setEnroll?.(true);
    });
    await page.fill('#participantName', 'Gatetest');
    await page.locator('button[data-enroll="1"]').click();
    await page.getByRole('button', { name: /^Begin$/ }).click();
    const transitionQs = new Set([16, 23, 31, 35, 39, 49]);
    for (let i = 1; i <= 60; i++) {
      await page.locator('.opt').nth(1).click();
      if (transitionQs.has(i)) {
        await page.getByRole('button', { name: /continue/i }).click();
      }
    }
    await page.getByRole('button', { name: /SHOW ME/ }).click();
    await page.getByRole('button', { name: /I MUST FINISH/ }).click();

    // Click GET MY REPORT with empty fields → status error
    await page.getByRole('button', { name: /GET MY REPORT/ }).click();
    await expect(page.locator('#emailStatus')).toBeVisible();
    await expect(page.locator('#emailStatus')).toContainText(/first name/i);

    await page.fill('#firstNameInput', 'Gate');
    await page.getByRole('button', { name: /GET MY REPORT/ }).click();
    await expect(page.locator('#emailStatus')).toContainText(/last name/i);

    await page.fill('#lastNameInput', 'Test');
    await page.getByRole('button', { name: /GET MY REPORT/ }).click();
    await expect(page.locator('#emailStatus')).toContainText(/valid email/i);
  });

  test('threshold options render with title + sub', async ({ page }) => {
    await page.goto('/');
    await page.fill('#participantName', 'Thresh');
    await page.locator('button[data-enroll="1"]').click();
    await page.getByRole('button', { name: /^Begin$/ }).click();
    const transitionQs = new Set([16, 23, 31, 35, 39, 49]);
    for (let i = 1; i <= 60; i++) {
      await page.locator('.opt').nth(1).click();
      if (transitionQs.has(i)) {
        await page.getByRole('button', { name: /continue/i }).click();
      }
    }
    await page.getByRole('button', { name: /SHOW ME/ }).click();
    await page.getByRole('button', { name: /I MUST FINISH/ }).click();

    const thresholdRow = page.locator('#thresholdRow');
    await expect(thresholdRow).toContainText(/THE CHAMPION/);
    await expect(thresholdRow).toContainText(/THE BALLOONIST/);
    await expect(thresholdRow).toContainText(/THE REORGANISER/);
    await expect(thresholdRow).toContainText(/THE RESTARTER/);
    await expect(thresholdRow).toContainText(/THE GHOSTER/);
    await expect(thresholdRow).toContainText(/procrastinate like a champion/);
    await expect(thresholdRow).toContainText(/ex who owes me money/);
  });

  test('UNFINISHED checklist renders all 10 actions with fidelity tags', async ({ page }) => {
    await page.goto('/');
    await page.fill('#participantName', 'Checklister');
    await page.locator('button[data-enroll="1"]').click();
    await page.getByRole('button', { name: /^Begin$/ }).click();
    const transitionQs = new Set([16, 23, 31, 35, 39, 49]);
    for (let i = 1; i <= 60; i++) {
      await page.locator('.opt').nth(1).click();
      if (transitionQs.has(i)) {
        await page.getByRole('button', { name: /continue/i }).click();
      }
    }
    await page.getByRole('button', { name: /SHOW ME/ }).click();
    await page.getByRole('button', { name: /I MUST FINISH/ }).click();

    const checklist = page.locator('#intentChecklist');
    await expect(checklist.locator('label')).toHaveCount(10);
    await expect(checklist).toContainText(/Unkept Promises/);
    await expect(checklist).toContainText(/Negotiating Constantly/);
    await expect(checklist).toContainText(/Fragmented Identity/);
    await expect(checklist).toContainText(/Inherited Patterns/);
    await expect(checklist).toContainText(/Neglected Completion/);
    await expect(checklist).toContainText(/Intelligence Weaponized/);
    await expect(checklist).toContainText(/Self-Trust Bankrupt/);
    await expect(checklist).toContainText(/Hidden Shame/);
    await expect(checklist).toContainText(/Exhausted From Carrying/);
    await expect(checklist).toContainText(/Deferred Action As Lifestyle/);
    // Fidelity tags
    await expect(checklist).toContainText(/THINK/);
    await expect(checklist).toContainText(/FEEL/);
    await expect(checklist).toContainText(/CHOOSE/);
    await expect(checklist).toContainText(/DO/);
  });

  test('skip-to-content link is the first focusable element', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.textContent || '');
    expect(focused.toLowerCase()).toContain('skip');
  });

  test('footer hides on question and transition screens', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toBeVisible();
    await page.fill('#participantName', 'FooterTest');
    await page.locator('button[data-enroll="1"]').click();
    await page.getByRole('button', { name: /^Begin$/ }).click();

    // On a question screen, body has class footer-hidden, footer is not visible
    await expect(page.locator('body')).toHaveClass(/footer-hidden/);
    await expect(page.locator('footer')).toBeHidden();
  });
});

test.describe('KOORA — pure-function smoke (page.evaluate)', () => {
  test('personalize() handles all three placeholder positions', async ({ page }) => {
    await page.goto('/');
    const out = await page.evaluate(() => {
      const W = window as unknown as { participantName: string; personalize: (s: string) => string };
      W.participantName = 'Tina';
      const a = W.personalize('{name,}you have just explored the four forces.');
      const b = W.personalize('Are you ready{,name}?');
      const c = W.personalize('Welcome, {name}.');
      W.participantName = '';
      const d = W.personalize('{name,}you have just explored the four forces.');
      const e = W.personalize('Are you ready{,name}?');
      return { a, b, c, d, e };
    });
    expect(out.a).toBe('Tina, you have just explored the four forces.');
    expect(out.b).toBe('Are you ready, Tina?');
    expect(out.c).toBe('Welcome, Tina.');
    expect(out.d).toBe('You have just explored the four forces.');
    expect(out.e).toBe('Are you ready?');
  });

  test('subLabel() maps 1..4 to four substitution levels', async ({ page }) => {
    await page.goto('/');
    const out = await page.evaluate(() => {
      const W = window as unknown as { subLabel: (n: number) => string };
      return [1, 2, 3, 4].map((n) => W.subLabel(n));
    });
    expect(out).toEqual(['low sub', 'minimal sub', 'some sub', 'lots of sub']);
  });

  test('levelNeg / levelPos thresholds', async ({ page }) => {
    await page.goto('/');
    const out = await page.evaluate(() => {
      const W = window as unknown as {
        levelNeg: (p: number) => string;
        levelPos: (p: number) => string;
      };
      return {
        neg25: W.levelNeg(0.25),
        neg50: W.levelNeg(0.5),
        neg80: W.levelNeg(0.8),
        pos25: W.levelPos(0.25),
        pos50: W.levelPos(0.5),
        pos80: W.levelPos(0.8),
      };
    });
    expect(out.neg25).toBe('quiet');
    expect(out.neg50).toBe('active');
    expect(out.neg80).toBe('loud');
    expect(out.pos25).toBe('beg');
    expect(out.pos50).toBe('prac');
    expect(out.pos80).toBe('emb');
  });
});
