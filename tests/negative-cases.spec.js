const { test, expect } = require('../src/fixtures/pageFixtures');
const { CITIES, SHOWS } = require('../test-data/testData');
const { takeScreenshot, parseRupeeAmount } = require('../src/utils/helpers');
const users = require('../test-data/users.json')

test.describe('Negative Cases', { tag: ['@negatives'] }, () => {

  test('TC-NC-01 | Proceed button is disabled when no seats are selected', { tag: ['@ntc01'] }, async ({ homePage, movieDetailPage, seatSelectionPage, page, bookingSummaryPage }) => {
    await homePage.goto();
    await homePage.waitForMovies();
    await homePage.bookFirstMovie();
    // const movieName = "THE SHEEP DETECTIVES"
    // await homePage.bookMovieByTitle(movieName);

    await movieDetailPage.selectDateByIndex(1);
    const noShows = await movieDetailPage.hasNoShows();
    if (noShows) {
      // Skip all seat tests if no shows available today
      test.skip();
      return;
    }

    await movieDetailPage.selectFirstAvailableShow();
    await seatSelectionPage.assertPageRedirection();
    // await seatSelectionPage.selectSeats(0);

    const proceedBtn = seatSelectionPage.proceedButton;
    await proceedBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await takeScreenshot(page, 'proceed-button-enabled');

    const isDisabled = await proceedBtn.isDisabled();
    expect(isDisabled).toBeTruthy();
  });

  // test('TC-NC-02 | Full booking flow without entering user details ', { tag: ['@ntc02'] }, async ({ homePage, movieDetailPage, seatSelectionPage, bookingSummaryPage, page}) => {

  //   await homePage.goto();
  //   await takeScreenshot(page, 'bf-01-home');

  //   await homePage.waitForMovies();
  //   await takeScreenshot(page, 'bf-01-city-selected');

  //   // Step 3: Pick first movie
  //   await homePage.bookFirstMovie();
  //   await movieDetailPage.assertMovieDetailsPageRedirection();

  //   const movieTitle = await movieDetailPage.getMovieTitle();
  //   expect(movieTitle.length).toBeGreaterThan(0);
  //   await takeScreenshot(page, 'bf-01-movie-detail');

  //   // Step 4: Select date
  //   await movieDetailPage.selectDateByIndex(1);
  //   const noShows = await movieDetailPage.hasNoShows();
  //   if (noShows) {
  //     console.warn('No shows today — test skipped');
  //     test.skip();
  //     return;
  //   }

  //   // Step 5: Pick first available show
  //   const chosenTime = await movieDetailPage.selectFirstAvailableShow();
  //   console.log(`Chose show time: ${chosenTime}`);
  //   await takeScreenshot(page, 'bf-01-show-selected');

  //   // Step 6: Select seats
  //   await seatSelectionPage.assertPageRedirection();
  //   await seatSelectionPage.waitForSeatMap();
  //   await seatSelectionPage.selectSeats(1);
  //   const total = await seatSelectionPage.getTotalAmount();
  //   // console.log(">>>:", total)
  //   await takeScreenshot(page, 'bf-01-seats-selected');
  //   expect(parseRupeeAmount(total)).toBeGreaterThan(0);

  //   // Step 7: Proceed to summary
  //   await seatSelectionPage.proceedToBooking();
  //   await seatSelectionPage.clickAcceptAndProceed();

  //   // Step 8: Entering no user details
  //   await bookingSummaryPage.performGuestLogin(users.empty);
  //   await takeScreenshot(page, 'bf-01-summary');

  //   await expect(page.getByText('First Name is required', { exact: true })).toBeVisible();
  //   await expect(page.getByText('Last Name is required', { exact: true })).toBeVisible();
  //   await expect(page.getByText('Email is required', { exact: true })).toBeVisible();
  //   await expect(page.getByText('required', { exact: true })).toBeVisible();

  // });


  // test('TC-NC-03 | Sold-out shows are visually distinguished / not clickable', { tag: ['@ntc03'] }, async ({
  //   homePage,
  //   movieDetailPage,
  //   page,
  // }) => {
  //   await homePage.goto();
  //   await homePage.waitForMovies();
  //   // await homePage.bookFirstMovie();
  //   await homePage.bookMovieByTitle("KRISHNAVATARAM")
  //   await movieDetailPage.selectDateByIndex(0);
  //   if (await movieDetailPage.hasNoShows()) {
  //     test.skip();
  //     return;
  //   }


  //   const disabledCount = await movieDetailPage.getSoldShowCount();
  //   console.log(">>>", disabledCount)
  //   await takeScreenshot(page, 'nc-02-sold-out-shows');

  //   if (disabledCount > 0) {
  //     // Sold-out shows should not be clickable
  //     const firstSoldOut = movieDetailPage.disabledShows.first();
  //     const cursor = await firstSoldOut.evaluate((el) => window.getComputedStyle(el).cursor);
  //     // Cursor should not be 'pointer' (i.e. not clickable)
  //     expect(cursor).not.toBe('pointer');
  //   }
  //   else {
  //     console.log('No sold-out shows found on current listing.');
  //     expect(true).toBeTruthy();
  //   }
  // });



  // test('TC-NC-04 | Accessing a non-existent movie URL shows error', { tag: ['@ntc04'] }, async ({ page }) => {
  //   await page.goto('/movies/non-existent-movie-xyz-404', { waitUntil: 'domcontentloaded' });
  //   await takeScreenshot(page, 'nc-04-non-existent-url');

  //   const url = page.url();
  //   const status404 = await page.locator('text=/404|not found|page not found/i').isVisible({ timeout: 3_000 }).catch(() => false);
  //   const redirectedToHome = url === 'https://www.cinepolisindia.com/' || url.endsWith('.com/');

  //   expect(status404 || redirectedToHome).toBeTruthy();
  // });

});
