const { test, expect } = require('../src/fixtures/pageFixtures');
const { CITIES, SHOWS } = require('../test-data/testData');
const { takeScreenshot, parseRupeeAmount } = require('../src/utils/helpers');

test.describe('Seat Selection', {tag: ['@seat_selection']}, () => {
  
  test.beforeEach(async ({ homePage, movieDetailPage, page }) => {
    await homePage.goto();
    // await homePage.selectCity(CITIES.MUMBAI);
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
  });


  test('TC-SL-01 | Seat map renders with available seats', {tag: ['@seat01']}, async ({ seatSelectionPage, page }) => {
    await seatSelectionPage.assertPageRedirection();
    await seatSelectionPage.waitForSeatMap();
    const availableCount = await seatSelectionPage.getAvailableSeatCount();
    console.log("Available seats: ", availableCount)
    await takeScreenshot(page, 'seat-map-loaded');
    expect(availableCount).toBeGreaterThan(0);
  });


  // test('TC-SL-02 | Seat categories are displayed in the legend', {tag: ['@seat02']}, async ({ seatSelectionPage, page }) => {
  //   await seatSelectionPage.assertPageRedirection();
  //   await seatSelectionPage.waitForSeatMap();
  //   const categories = await seatSelectionPage.getSeatCategories();
  //   console.log("Categories: ", categories)
  //   await takeScreenshot(page, 'seat-categories');

  //   expect(categories.length).toBeGreaterThan(0);
  //   for (const i of categories) {
  //     expect(i.trim()).not.toBe('');
  //   }
  // });


  // test('TC-SL-03 | Selecting one seat reflects in the summary bar', {tag: ['@seat03']}, async ({ seatSelectionPage, page}) => {
  //   await seatSelectionPage.assertPageRedirection();
  //   await seatSelectionPage.waitForSeatMap();
  //   const seats = 1
  //   await seatSelectionPage.selectSeats(seats);

  //   const selectedCount = await seatSelectionPage.getSelectedSeatCount();
  //   await takeScreenshot(page, 'single-seat-selected');
  //   expect(selectedCount).toBe(1);

  //   await expect(page.getByText(`${seats} Seats`)).toBeVisible();
  // });


  // test('TC-SL-04 | Selecting two seats updates total amount', {tag: ['@seat04']}, async ({ seatSelectionPage, page }) => {
  //   await seatSelectionPage.assertPageRedirection();
  //   await seatSelectionPage.waitForSeatMap();
  //   await seatSelectionPage.selectSeats(2);

  //   const total = await seatSelectionPage.getTotalAmount();
  //   console.log("Total: ", total);
  //   const amount = parseRupeeAmount(total);
  //   console.log("Amount: ", amount);

  //   await takeScreenshot(page, 'two-seats-selected');
  //   expect(amount).toBeGreaterThan(0);
  // });


  // test('TC-SL-05 | Deselecting a seat reduces selected count', {tag: ['@seat05']}, async ({
  //   seatSelectionPage,
  //   page,
  // }) => {
  //   await seatSelectionPage.assertPageRedirection();
  //   await seatSelectionPage.waitForSeatMap();
  //   await seatSelectionPage.selectSeats(2);

  //   const beforeDeselect = await seatSelectionPage.getSelectedSeatCount();
  //   await seatSelectionPage.deselectSeat(0);
  //   const afterDeselect = await seatSelectionPage.getSelectedSeatCount();

  //   await takeScreenshot(page, 'seat-deselected');
  //   expect(afterDeselect).toBe(beforeDeselect - 1);
  // });


  // test('TC-SL-06 | Proceed button is enabled when seats are selected', {tag: ['@seat06']}, async ({ seatSelectionPage, page, bookingSummaryPage }) => {
  //   await seatSelectionPage.assertPageRedirection();
  //   await seatSelectionPage.selectSeats(1);

  //   const proceedBtn = seatSelectionPage.proceedButton;
  //   await proceedBtn.waitFor({ state: 'visible', timeout: 10_000 });
  //   await takeScreenshot(page, 'proceed-button-enabled');

  //   const isDisabled = await proceedBtn.isDisabled();
  //   expect(isDisabled).toBeFalsy();
  // });


  // test('TC-SL-07 | Selecting seats and clicking Proceed moves to booking summary', {tag: ['@seat07']}, async ({
  //   seatSelectionPage,
  //   bookingSummaryPage,
  //   page,
  // }) => {
  //   await seatSelectionPage.assertPageRedirection();
  //   await seatSelectionPage.selectSeats(2);

  //   const proceedBtn = seatSelectionPage.proceedButton;
  //   await proceedBtn.waitFor({ state: 'visible', timeout: 10_000 });
  //   await takeScreenshot(page, 'proceed-button-enabled');

  //   const isDisabled = await proceedBtn.isDisabled();
  //   expect(isDisabled).toBeFalsy();

  //   await seatSelectionPage.proceedToBooking();
  //   await seatSelectionPage.clickAcceptAndProceed();
  //   await bookingSummaryPage.assertPageRedirection();
  // });


});
