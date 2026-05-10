const { expect } = require('@playwright/test');

class HomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    this.logo = page.locator('.cinepolis-logo, .logo, [href="/"]').first();
    this.navBar = page.locator('nav, .navbar, .header-nav').first();

    this.cityModal = page.locator('div').filter({ hasText: 'CHOOSE A' }).nth(5);
    this.contentWarningModal = page.locator('h2', { hasText: "Content Warning" });
    this.citySearchInput = page.getByRole('searchbox', { name: 'Search a City' });
    this.cityList = page.locator('.city-list, .cities-list, [class*="city-list"]');
    this.cityOption = (cityName) => page.getByRole('button', { name: `${cityName}`, exact: true })
    this.selectedCity = page.locator('.selected-city, [class*="selected-city"], .city-name').first();

    this.nowShowingSection = page.getByText("NOW SHOWING - BOOK TODAY")
    this.comingSoonSection = page.locator('[class*="coming-soon"], [id*="coming-soon"]').first();
    this.movieCards = page.locator('li.bg-transparent.items-center.relative.cursor-pointer');
    this.movieTitles = this.movieCards.locator('h3');
    this.bookNowButtons = this.movieCards.getByRole('button', { name: "Book Tickets" });

  }



  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }



  /**
   * @param {string} cityName - e.g. "Delhi", "Mumbai", "Hyderabad"
   */
  async selectCity(cityName) {
    const cityModalVisible = await this.cityModal.isVisible({ timeout: 4000 }).catch(() => false);

    if (!cityModalVisible) {
      // await this.page.getByRole('button', { name: 'Mumbai' }).click();
      await this.page.locator('button[id="headlessui-menu-button-:Rjqm:"]').click();
      await this.cityModal.waitFor({ state: 'visible', timeout: 10000 });
    }

    // Search for the city if search input is available
    const searchVisible = await this.citySearchInput.isVisible({ timeout: 2000 }).catch(() => false);
    if (searchVisible) {
      await this.citySearchInput.fill(cityName);
      await this.page.waitForTimeout(500); // debounce
    }

    await this.cityOption(cityName).first().click();
    await this.page.waitForLoadState('networkidle');
  }


  /**
   * @returns {Promise<string>}
   */
  async getSelectedCity() {
    return (await this.selectedCity.textContent())?.trim() ?? '';
  }

  async waitForNthMovies(index) {
    await this.movieCards.nth(index).waitFor({ state: 'visible', timeout: 20000 });
  }

  async waitForMovies() {
    for (let i = 0; i <= this.movieCards.count(); i++) {
      await this.movieCards.nth(i).waitFor({ state: 'visible', timeout: 20000 });
    }
  }

  /**
   * @returns {Promise<number>}
   */
  async getMovieCount() {
    return this.movieCards.count();
  }

  /**
   * @returns {Promise<string[]>}
   */
  async getAllMovieTitles() {
    return this.movieTitles.allInnerTexts();
  }

  /**
   * @param {string} movieTitle
   */
  async bookMovieByTitle(movieTitle) {
    const movieCard = this.movieCards.filter({ hasText: movieTitle }).first();

    await movieCard.waitFor({ state: 'visible', timeout: 10000 });
    const bookBtn = movieCard.locator('button:has-text("Book Tickets")');
    await bookBtn.click();

    const warningModalVisible = await this.contentWarningModal.isVisible({ timeout: 4000 }).catch(() => false);
    if (warningModalVisible) {
      await this.page.getByRole('button', { name: "Continue", exact: true }).click();
    }
    await this.page.waitForLoadState('domcontentloaded');
  }


  async bookFirstMovie() {
    await this.waitForMovies();
    await this.bookNowButtons.first().click();

    const warningModalVisible = await this.contentWarningModal.isVisible({ timeout: 4000 }).catch(() => false);
    if (warningModalVisible) {
      await this.page.getByRole('button', { name: "Continue", exact: true }).click();
    }
    
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * @param {number} index - zero-based index
   */
  async clickMovieCard(index = 0) {
    await this.waitForNthMovies(index);
    await this.bookNowButtons.nth(index).click();

    const warningModalVisible = await this.contentWarningModal.isVisible({ timeout: 4000 }).catch(() => false);
    if (warningModalVisible) {
      await this.page.getByRole('button', { name: "Continue", exact: true }).click();
    }
    await this.page.waitForLoadState('domcontentloaded');
  }


  async assertNowShowingSectionVisible() {
    await this.nowShowingSection.waitFor({ state: 'visible', timeout: 15000 });
  }

  async assertPageTitle() {
    await expect(this.page).toHaveTitle("Cinépolis India - Home")
  }
}

module.exports = { HomePage };
