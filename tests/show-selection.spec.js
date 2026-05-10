const { test, expect } = require('../src/fixtures/pageFixtures');
const { CITIES } = require('../test-data/testData');
const { takeScreenshot } = require('../src/utils/helpers');

test.describe('Show Selection', {tag: ['@show_selection', '@regression']}, () => {

  test.beforeEach(async ({ homePage, movieDetailPage, page }) => {
    await homePage.goto();
    // await homePage.selectCity(CITIES.DEFAULT);
    await homePage.waitForMovies();
    await homePage.bookFirstMovie();
    await movieDetailPage.assertMovieDetailsPageRedirection();
  });


  test('TC-SS-01 | Movie detail page displays the movie title', {tag: ['@show01']}, async ({ movieDetailPage, page}) => {
    const title = await movieDetailPage.getMovieTitle();
    console.log("Title: ", title);
    await takeScreenshot(page, 'show-selection-title');
    expect(title.length).toBeGreaterThan(0);
  });


  test('TC-SS-02 | Date tabs are present for upcoming days', {tag: ['@show02']}, async ({ movieDetailPage, page}) => {
    const dates = await movieDetailPage.getAvailableDates();
    console.log("Date: ", dates);
    await takeScreenshot(page, 'date-tabs');
    expect(dates.length).toBeGreaterThanOrEqual(1);
  });


  test('TC-SS-03 | Clicking an available show time navigates seat selection page', {tag: ['@show03']}, async ({ movieDetailPage, seatSelectionPage, page}) => {
    await movieDetailPage.selectDateByIndex(1);
    const noShows = await movieDetailPage.hasNoShows();

    if (noShows) {
      test.skip();
      return;
    }

    const chosenTime = await movieDetailPage.selectFirstAvailableShow();
    console.log(`Chose show time: ${chosenTime}`);
    await takeScreenshot(page, 'show-time-selected');

    await seatSelectionPage.assertPageRedirection();
  });
});
