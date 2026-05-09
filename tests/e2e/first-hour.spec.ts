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

    const transitionQuestions = new Set([7, 14, 21, 28, 35]);

    for (let i = 1; i <= 42; i++) {
      await expect(page.locator('#qCount')).toContainText(`Question ${i} of 42`);
      await page.locator('.opt').nth(1).click();
      await page.keyboard.press('Enter');

      if (transitionQuestions.has(i)) {
        await page.getByRole('button', { name: /continue/i }).click();
      }
    }

    await expect(page.getByRole('heading', { name: /one breath/i })).toBeVisible({ timeout: 5000 });
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
