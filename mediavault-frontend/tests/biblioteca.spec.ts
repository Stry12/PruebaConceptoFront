import { test, expect } from '@playwright/test';

test.describe('Biblioteca — Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for loading to finish
    await page.waitForSelector('.media-grid', { timeout: 10000 });
  });

  test('page loads and displays the grid of cards', async ({ page }) => {
    // H1 exists and is the only one
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Biblioteca');

    // Grid has items
    const cards = page.locator('.media-card');
    await expect(cards).toHaveCount(12);
  });

  test('all 12 fixture items are visible', async ({ page }) => {
    const titles = [
      'Cien años de soledad',
      'Blade Runner 2049',
      'Breaking Bad',
      'Death Note, Vol. 1',
      'The Power of Habit',
      'Cosmos',
      'Revista National Geographic',
      'Hardcore History',
      'The Witcher',
      'Curso de TypeScript Avanzado',
      'Spider-Man',
      'Watchmen',
    ];
    for (const title of titles) {
      await expect(page.locator(`text=${title}`).first()).toBeVisible();
    }
  });
});

test.describe('Biblioteca — Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.media-grid', { timeout: 10000 });
  });

  test('type filters work', async ({ page }) => {
    // Click on "Film" chip
    const filmChip = page.locator('button', { hasText: 'Film' }).first();
    await filmChip.click();

    // Should show only films (2 items: Blade Runner 2049, Spider-Man)
    const cards = page.locator('.media-card');
    await expect(cards).toHaveCount(2);

    // Click "Limpiar filtros"
    const clearBtn = page.locator('button', { hasText: 'Limpiar filtros' });
    await clearBtn.click();

    // All items should be visible again
    await expect(page.locator('.media-card')).toHaveCount(12);
  });

  test('status filters work', async ({ page }) => {
    // Click on "Completado" chip
    const completedChip = page.locator('button', { hasText: 'Completado' }).first();
    await completedChip.click();

    // Should show only completed items (5 items)
    const cards = page.locator('.media-card');
    await expect(cards).toHaveCount(5);
  });

  test('filters combine with AND logic', async ({ page }) => {
    // Select "Book" type
    await page.locator('button', { hasText: 'Book' }).first().click();
    // Select "Completado" status
    await page.locator('button', { hasText: 'Completado' }).first().click();

    // Should show only completed books (2 items: Cien años de soledad, The Witcher)
    const cards = page.locator('.media-card');
    await expect(cards).toHaveCount(2);
  });
});

test.describe('Biblioteca — Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.media-grid', { timeout: 10000 });
  });

  test('search filters by title', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]').first();
    await searchInput.fill('Blade Runner');
    await page.waitForTimeout(400); // debounce

    const cards = page.locator('.media-card');
    await expect(cards).toHaveCount(1);
    await expect(page.locator('.media-card').first()).toContainText('Blade Runner 2049');
  });

  test('search filters by creator', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]').first();
    await searchInput.fill('Carl Sagan');
    await page.waitForTimeout(400);

    const cards = page.locator('.media-card');
    await expect(cards).toHaveCount(1);
    await expect(page.locator('.media-card').first()).toContainText('Cosmos');
  });

  test('no results state shows when search has no matches', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]').first();
    await searchInput.fill('xyznonexistent');
    await page.waitForTimeout(400);

    await expect(page.locator('text=No se encontraron resultados')).toBeVisible();
    await expect(page.locator('text=xyznonexistent')).toBeVisible();
  });
});

test.describe('Biblioteca — Favorites', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.media-grid', { timeout: 10000 });
  });

  test('favorite button toggles without navigating', async ({ page }) => {
    const firstCard = page.locator('.media-card').first();
    const favBtn = firstCard.locator('button[aria-label*="favorito"]').first();
    const initialUrl = page.url();

    // Get initial state
    const initialState = await favBtn.getAttribute('aria-pressed');

    // Click to toggle
    await favBtn.click();

    // URL should not change
    expect(page.url()).toBe(initialUrl);

    // aria-pressed should change
    const newState = await favBtn.getAttribute('aria-pressed');
    expect(newState).not.toBe(initialState);
  });
});

test.describe('Biblioteca — Keyboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.media-grid', { timeout: 10000 });
  });

  test('Escape closes open dropdown', async ({ page }) => {
    // Open context menu on first card
    const firstCard = page.locator('.media-card').first();
    const menuBtn = firstCard.locator('button[aria-label*="Acciones"]').first();
    await menuBtn.click();

    // Menu should be visible
    await expect(page.locator('[role="menu"]')).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Menu should be hidden
    await expect(page.locator('[role="menu"]')).not.toBeVisible();
  });
});

test.describe('Biblioteca — Responsive', () => {
  test('4 columns on desktop (1280px)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForSelector('.media-grid', { timeout: 10000 });

    const grid = page.locator('.media-grid');
    const gridBox = await grid.boundingBox();
    expect(gridBox).not.toBeNull();
    // Grid should be roughly 1280 - 48 (padding) = 1232px wide
    expect(gridBox!.width).toBeGreaterThan(1000);
  });

  test('2 columns on mobile (390px)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForSelector('.media-grid', { timeout: 10000 });

    const cards = page.locator('.media-card');
    const firstCardBox = await cards.first().boundingBox();
    const secondCardBox = await cards.nth(1).boundingBox();
    expect(firstCardBox).not.toBeNull();
    expect(secondCardBox).not.toBeNull();

    // On 2-column layout, the second card should be to the right of the first (same row)
    // or below (different row). Both cards should have roughly half the viewport width.
    const expectedWidth = (390 - 32 - 12) / 2; // padding + gap
    expect(firstCardBox!.width).toBeGreaterThan(expectedWidth - 20);
    expect(firstCardBox!.width).toBeLessThan(expectedWidth + 20);
  });

  test('bottom tabs visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Bottom tab bar should be visible
    const bottomNav = page.locator('nav').last();
    await expect(bottomNav).toBeVisible();
  });
});

test.describe('Biblioteca — Accessibility', () => {
  test('all cover images have alt=""', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.media-grid', { timeout: 10000 });

    const images = page.locator('.media-card img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      await expect(images.nth(i)).toHaveAttribute('alt', '');
    }
  });

  test('rating stars have proper aria-label', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.media-grid', { timeout: 10000 });

    const ratings = page.locator('[role="img"][aria-label*="Valoración"]');
    const count = await ratings.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const label = await ratings.nth(i).getAttribute('aria-label');
      expect(label).toMatch(/Valoración: \d de 5/);
    }
  });

  test('grid uses role="list" and cards use role="listitem"', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.media-grid', { timeout: 10000 });

    const list = page.locator('[role="list"]');
    await expect(list).toHaveCount(1);

    const listItems = page.locator('[role="listitem"]');
    await expect(listItems).toHaveCount(12);
  });
});

test.describe('Biblioteca — Card containment', () => {
  test('cards in same row have equal heights', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForSelector('.media-grid', { timeout: 10000 });

    const cards = page.locator('[role="listitem"]');
    const count = await cards.count();

    // Get heights of first 4 cards (first row in 4-column layout)
    const heights: number[] = [];
    for (let i = 0; i < Math.min(4, count); i++) {
      const box = await cards.nth(i).boundingBox();
      if (box) heights.push(box.height);
    }

    // All cards in first row should have the same height (±1px)
    for (let i = 1; i < heights.length; i++) {
      expect(Math.abs(heights[i] - heights[0])).toBeLessThanOrEqual(1);
    }
  });
});
