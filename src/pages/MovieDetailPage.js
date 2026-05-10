const { expect } = require('@playwright/test');

/**
 * Page Object Model for Cinepolis India - Movie Detail / Show Selection Page
 * Handles: movie info display, date selection, cinema/show selection
 */
class MovieDetailPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    this.movieTitle = page.locator('[class="text-white text-[44px] italic leading-[54px] font-black"]');
    this.movieGenre = page.locator('[class*="genre"], .genre-tag').first();
    this.movieRating = page.locator('[class*="rating"], .certificate').first();
    this.movieDuration = page.locator('[class*="duration"], [class*="runtime"]').first();
    this.movieLanguage = page.locator('[class*="language"]').first();

    this.languageAndFormat = page.locator('div[class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-xl opacity-100 translate-y-0 sm:scale-100"]')

    // Dates
    this.dateTabs = page.locator('div.flex.gap-3 div.cursor-pointer');
    this.activeDateTab = page.locator('.date-tabs li.active, [class*="date-tab"].active, .date-tab--active').first();


    // Cinemas & Shows
    this.cinemaList = page.locator('[class*="cinema-list"], .theatre-list, .cinemas-container');
    this.cinemaItems = page.locator('[class*="cinema-item"], .theatre-item, .cinema-row');
    this.cinemaName = (index) =>
      page.locator('[class*="cinema-name"], .theatre-name').nth(index);
    this.showTimings = page.locator('[class*="show-time"], .show-timing, .time-slot');
    this.availableShowTimings = page.locator('[class="flex gap-3 items-center"]');
    this.bookedShowTimings = page.locator('.flex.gap-3.items-center button:disabled');

    this.disabledShows = page.locator('.flex.gap-3.items-center button:disabled');

    // // No Shows State
    this.noShowsMessage = page.locator('[class*="no-shows"]').first();
  }

  

  /**
   * Select a date tab by index (0 = today, 1 = tomorrow, etc.)
   * @param {number} index
   */
  async selectDateByIndex(index = 0) {
    await this.dateTabs.nth(index).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * @param {string} dateText
   */
  async selectDateByText(dateText) {
    const dateTab = this.dateTabs.filter({ hasText: dateText }).first();
    await dateTab.waitFor({ state: 'visible' });
    await dateTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * @returns {Promise<string[]>}
   */
  async getAvailableDates() {
    await this.dateTabs.first().waitFor({ state: 'visible', timeout: 10000 });
    return this.dateTabs.allTextContents();
  }

  async getSoldShowCount(){
    const disabledCount = await this.disabledShows.count();
    return disabledCount;
  }


  /**
   * @returns {Promise<string>}
   */
  async selectFirstAvailableShow() {
    const firstShow = this.availableShowTimings.first();
    await firstShow.waitFor({ state: 'visible', timeout: 10000 });
    const timingText = (await firstShow.textContent())?.trim() ?? '';
    await firstShow.click();
    await this.page.waitForLoadState('domcontentloaded');
    return timingText;
  }

  /**
   * @param {string} time
   */
  async selectShowByTime(time) {
    const timeSlot = this.showTimings.filter({ hasText: time }).first();
    await timeSlot.waitFor({ state: 'visible', timeout: 10000 });
    await timeSlot.click();
    await this.page.waitForLoadState('domcontentloaded');
  }


  /**
   * @returns {Promise<string>}
   */
  async getMovieTitle() {
    await this.movieTitle.waitFor({ state: 'visible', timeout: 10000 });
    return (await this.movieTitle.textContent())?.trim() ?? '';
  }

  /**
   * @returns {Promise<boolean>}
   */
  async hasNoShows() {
    return this.noShowsMessage.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async assertMovieDetailsPageRedirection() {
    const languageAndFormatVisible = await this.languageAndFormat.isVisible({ timeout: 4000 }).catch(() => false);
    // console.log(">>>", languageAndFormatVisible)
    if (languageAndFormatVisible) {
      await this.languageAndFormat.locator('svg').click();
    }

    await expect(this.page).toHaveURL(/movie-details/);
  }
}

module.exports = { MovieDetailPage };
