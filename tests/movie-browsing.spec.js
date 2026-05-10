const { test, expect } = require('../src/fixtures/pageFixtures');
const { CITIES, MOVIES } = require('../test-data/testData');
const { takeScreenshot } = require('../src/utils/helpers');

test.describe('Movie Browsing', {tag: ['@movie_booking', '@regression']}, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('TC-MB-01 | Home page loads and title contains Cinepolis', {tag: ['@mb01']}, async ({ homePage, page }) => {
    await homePage.assertPageTitle();
    await takeScreenshot(page, 'home-page-loaded');

    const title = await page.title();
    expect(title.toLowerCase()).toContain('cinépolis india - home');
  });


  // test('TC-MB-02 | Now Showing section is visible after city selection', {tag: ['@mb02']}, async ({ homePage, page }) => {
  //   // await homePage.selectCity(CITIES.CHENNAI);
  //   await homePage.assertNowShowingSectionVisible();
  //   await takeScreenshot(page, 'now-showing-section');
  // });


  // test('TC-MB-03 | Movie listing shows at least one movie card', {tag: ['@mb03']}, async ({ homePage, page }) => {
  //   // await homePage.selectCity(CITIES.DEFAULT);
  //   const count = await homePage.getMovieCount();
  //   console.log("Movie count: ", count)
  //   await takeScreenshot(page, 'movie-listing');
  //   expect(count).toBeGreaterThan(0);
  // });


  // test('TC-MB-04 | All movie cards have a non-empty title', {tag: ['@mb04']}, async ({ homePage }) => {
  //   // await homePage.selectCity(CITIES.DEFAULT);
  //   const titles = await homePage.getAllMovieTitles();
  //   console.log("titles: ", titles)

  //   expect(titles.length).toBeGreaterThan(0);
  //   for (const title of titles) {
  //     expect(title.trim()).not.toBe('');
  //   }
  // });


  // test('TC-MB-05 | Switching city updates movie listing', {tag: ['@mb05']}, async ({ homePage, page }) => {
  //   await homePage.selectCity(CITIES.DEFAULT);
  //   const titlesInCity1 = await homePage.getAllMovieTitles();
  //   console.log("city1>>", titlesInCity1)

  //   await homePage.selectCity(CITIES.DELHI);
  //   const titlesInCity2 = await homePage.getAllMovieTitles();
  //   console.log("city2>>", titlesInCity2)

  //   await takeScreenshot(page, 'city-switched');

  //   // Both cities should have movies
  //   expect(titlesInCity1.length).toBeGreaterThan(0);
  //   expect(titlesInCity2.length).toBeGreaterThan(0);
  // });


  // test('TC-MB-06 | Book Now button is present on movie cards', {tag: ['@mb06']}, async ({ homePage, page }) => {
  //   // await homePage.selectCity(CITIES.BANGALORE);

  //   const bookNowCount = await homePage.bookNowButtons.count();
  //   await takeScreenshot(page, 'book-now-buttons');
  //   expect(bookNowCount).toBeGreaterThan(0);
  // });


  // test('TC-MB-07 | Clicking a movie card navigates to movie detail page', {tag: ['@mb07']}, async ({
  //   homePage,
  //   movieDetailPage,
  //   page,
  // }) => {
  //   await homePage.clickMovieCard(1);

  //   await movieDetailPage.assertMovieDetailsPageRedirection()
  //   await takeScreenshot(page, 'movie-detail-page');
  // });

  
  // test('TC-MB-08 | Page URL contains cinepolisindia.com domain', {tag: ['@mb08']}, async ({ page }) => {
  //   expect(page.url()).toContain('cinepolisindia.com');
  // });
});
