const { expect } = require('@playwright/test');

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} label - filename-friendly label, e.g. "seat-map-loaded"
 */
async function takeScreenshot(page, label) {
  const sanitised = label.replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
  await page.screenshot({
    path: `reports/screenshots/${sanitised}-${Date.now()}.png`,
    fullPage: true,
  });
}


/**
 * Parse a rupee amount string into a number.
 * e.g. "₹ 1,540.00" → 1540
 * @param {string} text
 * @returns {number}
 */
function parseRupeeAmount(text) {
  return parseFloat(text.replace(/[^\d.]/g, '')) || 0;
}


/**
 * @param {import('@playwright/test').Locator} locator
 */
async function scrollAndClick(locator) {
  await locator.scrollIntoViewIfNeeded();
  await locator.click();
}


module.exports = {
  takeScreenshot,
  parseRupeeAmount,
  scrollAndClick,
};
