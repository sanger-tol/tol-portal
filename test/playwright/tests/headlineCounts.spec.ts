// SPDX-FileCopyrightText: 2025 Genome Research Ltd.
//
// SPDX-License-Identifier: MIT

import { expect, test } from '@playwright/test';

const headless = !!(process.env.CI || process.env.HEADLESS);

test.use({headless: headless});

test('headline counts', async ({ page }) => {
  await page.goto('/headlineCounts.html');
  await page.waitForFunction(() => {
    const el = document.getElementById('speciesSubmittedTotal');
    return el && Number.isInteger(Number(el.textContent));
  }, { timeout: 15000 });
  const submitted = await page.locator('#speciesSubmittedTotal').textContent();
  expect(Number(submitted)).not.toBeNaN();
  expect(Number.isInteger(Number(submitted))).toBe(true);
  expect(Number(submitted)).toBeGreaterThan(3000);

  const collected = await page.locator('#speciesCollectedTotal').textContent();
  expect(Number(collected)).not.toBeNaN();
  expect(Number.isInteger(Number(collected))).toBe(true);
  expect(Number(collected)).toBeGreaterThan(11000);

  const sequencing = await page.locator('#sequencingTotal').textContent();
  expect(Number(sequencing)).not.toBeNaN();
  expect(Number.isInteger(Number(sequencing))).toBe(true);
  expect(Number(sequencing)).toBeGreaterThan(200000000000000);
});
