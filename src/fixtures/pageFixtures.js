// fixtures/pageFixtures.js

const { test: base, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { MovieDetailPage } = require('../pages/MovieDetailPage');
const { SeatSelectionPage } = require('../pages/SeatSelectionPage');
const { BookingSummaryPage } = require('../pages/BookingSummaryPage');

/**
 * Extended Playwright test with POM pages injected as fixtures.
 *
 * Usage in tests:
 *   const { test, expect } = require('../src/fixtures/pageFixtures');
 *
 *   test('my test', async ({ homePage, movieDetailPage, seatSelectionPage, bookingSummaryPage }) => {
 *     await homePage.goto();
 *     // ...
 *   });
 */
const test = base.extend({
  // ── Individual page fixtures ───────────────────────────────────────────────

  /** Home / Landing page */
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  /** Movie detail & show listing page */
  movieDetailPage: async ({ page }, use) => {
    const movieDetailPage = new MovieDetailPage(page);
    await use(movieDetailPage);
  },

  /** Seat map / selection page */
  seatSelectionPage: async ({ page }, use) => {
    const seatSelectionPage = new SeatSelectionPage(page);
    await use(seatSelectionPage);
  },

  /** Booking summary page (pre-payment) */
  bookingSummaryPage: async ({ page }, use) => {
    const bookingSummaryPage = new BookingSummaryPage(page);
    await use(bookingSummaryPage);
  },

  // ── Composite fixture: full booking flow state ────────────────────────────

  /**
   * "bookedState" fixture — navigates from home → city selection → first movie
   * so tests that need to start from a movie page don't repeat setup.
   */
  bookedState: async ({ page }, use) => {
    const homePage = new HomePage(page);
    const movieDetailPage = new MovieDetailPage(page);

    await homePage.goto();
    await homePage.selectCity('Hyderabad');
    await homePage.waitForMovies();
    await homePage.bookFirstMovie();

    await use({ page, homePage, movieDetailPage });
  },
});

module.exports = { test, expect };
