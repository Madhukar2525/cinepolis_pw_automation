const { test, expect } = require('../src/fixtures/pageFixtures');
const { CITIES, SHOWS } = require('../test-data/testData');
const { takeScreenshot, parseRupeeAmount } = require('../src/utils/helpers');
const users = require('../test-data/users.json')

test.describe('Booking Flow (E2E)', () => {

  test('TC-BF-01 | Full booking flow: Home → City → Movie → Show → Seats → Summary', { tag: ['@bf01'] }, async ({
    homePage,
    movieDetailPage,
    seatSelectionPage,
    bookingSummaryPage,
    page,
  }) => {

    // Step 1: Open home page
    await homePage.goto();
    await takeScreenshot(page, 'bf-01-home');

    // Step 2: Select city
    await homePage.selectCity(CITIES.DELHI);
    await homePage.waitForMovies();
    await takeScreenshot(page, 'bf-01-city-selected');

    // Step 3: Pick first movie
    const movieName = "EK DIN"
    await homePage.bookMovieByTitle(movieName);
    await movieDetailPage.assertMovieDetailsPageRedirection();

    const movieTitle = await movieDetailPage.getMovieTitle();
    expect(movieTitle.length).toBeGreaterThan(0);
    expect(movieTitle.toLowerCase()).toContain(movieName.toLowerCase())
    await takeScreenshot(page, 'bf-01-movie-detail');

    // Step 4: Select today's date
    await movieDetailPage.selectDateByIndex(1);
    const noShows = await movieDetailPage.hasNoShows();
    if (noShows) {
      console.warn('No shows today — test skipped');
      test.skip();
      return;
    }

    // Step 5: Pick first available show
    const chosenTime = await movieDetailPage.selectFirstAvailableShow();
    console.log(`Chose show time: ${chosenTime}`);
    await takeScreenshot(page, 'bf-01-show-selected');

    // Step 6: Select seats
    await seatSelectionPage.assertPageRedirection();
    await seatSelectionPage.selectSeats(2);
    const total = await seatSelectionPage.getTotalAmount();
    // console.log(">>>:", total)
    await takeScreenshot(page, 'bf-01-seats-selected');
    expect(parseRupeeAmount(total)).toBeGreaterThan(0);

    // Step 7: Proceed to summary
    await seatSelectionPage.proceedToBooking();
    await seatSelectionPage.clickAcceptAndProceed();

    await bookingSummaryPage.performGuestLogin(users.shawn);
    await takeScreenshot(page, 'bf-01-summary');
    console.log("Step 7 done...")

    // Assertion: summary or payment page reached — NOT clicking Pay
    await expect(page.locator('text=YOUR DETAILS')).toBeVisible();
    await expect(page.locator('text=BOOKING DETAILS')).toBeVisible();
    await expect(page.getByRole('cell', { name: `${users.shawn.firstName}`, exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: `${users.shawn.lastName}`, exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: `${users.shawn.email}`, exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: `+91${users.shawn.mobile}`, exact: true })).toBeVisible();

    const priceDetails = await bookingSummaryPage.getBookingPriceDetails()
    // console.log(">>>", priceDetails)
    const ticketTotal = priceDetails.ticketTotal;
    const convenienceFee = priceDetails.convenienceFee;
    const grandTotal = priceDetails.grandTotal;
    // console.log(`${grandTotal} = ${ticketTotal} + ${convenienceFee}`)
    expect(Number(grandTotal.replace(/[^\d.]/g, ''))).toBe(Number(convenienceFee.replace(/[^\d.]/g, ''))+Number(ticketTotal.replace(/[^\d.]/g, '')));
    console.log(`Booking flow reached summary for: ${movieTitle}`);
  });


  // test('TC-BF-02 | Back navigation from movie page returns to show listing', { tag: ['@bf02'] }, async ({
  //   homePage,
  //   movieDetailPage,
  //   seatSelectionPage,
  //   page,
  // }) => {
  //   await homePage.goto();
  //   // await homePage.selectCity(CITIES.DEFAULT);
  //   await homePage.waitForMovies();
  //   await homePage.bookFirstMovie();

  //   // Go back
  //   await page.goBack();
  //   await page.waitForLoadState('domcontentloaded');
  //   await takeScreenshot(page, 'bf-04-back-navigation');

  //   // Should be back on the show listing / movie detail page
  //   const urlAfterBack = page.url();
  //   expect(urlAfterBack).toContain('cinepolisindia.com');
  // });
});
