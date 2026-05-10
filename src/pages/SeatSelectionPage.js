// pages/SeatSelectionPage.js

const { expect } = require('@playwright/test');

class SeatSelectionPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Screen indicator
    this.screenLabel = page.locator('p', { hasText: "SCREEN THIS WAY" });
    this.seatsCanvas = page.locator('[class="first-table zoom-seatlayout"]');

    // Seat categories (e.g. Normal, Premium, Executive)
    this.seatCategories = page.locator('.category-title');
    this.categoryLabels = page.locator('.category-title');

    this.allSeats = page.locator('div.seat');

    // Available seats
    this.availableSeats = page.locator('.cursor-pointer:not(.active):visible');
    this.availableSeats2 = page.locator('[class*="Shape.svg"]');

    this.selectedSeats = page.locator('.cursor-pointer.active:visible')

    this.unavailableSeats = page.locator('div.cursor-not-allowed')

    this.seatLegend = page.locator('[class*="legend"], .seat-legend').first();

    this.bookingSummaryBar = page.locator('[class*="booking-summary"], [class*="bottom-bar"], .ticket-summary').first();
    this.bookingDetails = page.getByText('BOOKING DETAILS')
    this.selectedSeatCount = page.locator('[class*="seat-count"], [class*="selected-count"]').first();
    this.totalAmount = page.locator('[class*="total-amount"], [class*="total-price"], .amount-total').first();
    this.totalAmount2 = page.locator('span[class="font-bold px-5"]');

    this.proceedButton = page.getByRole('button', { name: "PROCEED", exact: true });

    this.termsAndConditions = page.locator('h2', { hasText: "Terms & Conditions" });
    this.acceptAndProceed = page.getByRole('button', { name: "Accept & Proceed", exact: true });
  }


  async waitForSeatMap() {
      await this.seatsCanvas.waitFor({state: "visible"});
      this.screenLabel.waitFor({ state: 'visible', timeout: 20000 });
      this.seatCategories.first().waitFor({ state: 'visible', timeout: 20000 });

      await this.page.waitForLoadState('networkidle');
  }



  /**
   * Select N available seats (picks the first N it finds)
   * @param {number} count - number of seats to select
   * @returns {Promise<string[]>} - array of seat labels/texts selected
   */
  async selectSeats(count = 1) {
    const count1 = await this.availableSeats2.count();
    console.log("count is: ", count1)
    const selectedLabels = [];

    for (let i = 0; i < count; i++) {
      const seat = this.availableSeats2.nth(0);
      const isAvailable = await seat.isVisible().catch(() => false);
      if (!isAvailable) {
        throw new Error(`Could not find ${count} available seats. Only ${i} found.`);
      }
      const label = (await seat.getAttribute('data-seat') ||
        await seat.getAttribute('title') ||
        await seat.textContent())?.trim() ?? `Seat-${i}`;

      // console.log("seat locator 1: ", seat)
      await seat.click();
      // console.log("seat locator after: ", seat)
      selectedLabels.push(label);
      await this.page.waitForTimeout(300);
    }

    return selectedLabels;
  }


  /**
   * @param {number} index - index of the selected seat to deselect
   */
  async deselectSeat(index = 0) {
    await this.selectedSeats.nth(index).click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Get count of currently selected seats
   * @returns {Promise<number>}
   */
  async getSelectedSeatCount() {
    // await this.selectedSeats.waitFor({state: "visible"})
    console.log("selected seats: ", await this.selectedSeats.count())
    return this.selectedSeats.count();
  }

  /**
   * Get available seat count
   * @returns {Promise<number>}
   */
  async getAvailableSeatCount() {
    // await this.availableSeats2.waitFor({state: "visible"})
    const seatsCount = await this.availableSeats2.count();
    // console.log("count is: ", seatsCount)
    return seatsCount;
  }


  /**
   * @returns {Promise<string[]>}
   */
  async getSeatCategories() {
    await this.waitForSeatMap();
    return this.categoryLabels.allTextContents();
  }


  /**
   * @returns {Promise<string>}
   */
  async getTotalAmount() {
    await this.bookingDetails.waitFor({ state: 'visible', timeout: 10000 });
    const total = (await this.totalAmount2.textContent())?.trim() ?? '';
    return total;
  }


  async proceedToBooking() {
    await this.proceedButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * @param {number} seatCount
   * @returns {Promise<string[]>} seat labels selected
   */
  async selectSeatsAndProceed(seatCount = 2) {
    const labels = await this.selectSeats(seatCount);
    await this.proceedToBooking();
    return labels;
  }


  async assertPageRedirection() {
    await expect(this.screenLabel).toBeVisible();
    await expect(this.page).toHaveURL(/seats/);
  }

  async clickAcceptAndProceed() {
    await expect(this.termsAndConditions).toBeVisible();
    await this.acceptAndProceed.click();
  }
}

module.exports = { SeatSelectionPage };
