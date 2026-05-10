const { expect } = require('@playwright/test');

class BookingSummaryPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    this.ticketPrice = page.locator('[class*="ticket-price"], [class*="base-price"]').first();
    this.convenienceFee = page.locator('[class*="convenience"], [class*="booking-fee"]').first();
    this.taxAmount = page.locator('[class*="tax"], [class*="gst"]').first();
    this.grandTotal = page.locator(
      '[class*="grand-total"], [class*="total-amount"], [class*="total-price"], .final-amount'
    ).first();


    this.loginSection = page.locator('[class*="login-section"]').first();
    this.loginEmailInput = page.locator('input[name="email"]').first();
    this.loginPasswordInput = page.locator('input[name="password"]').first();
    this.continueAsGuestButton = page.getByRole('button', { name: "continue as Guest", exact: true }).nth(1);
    this.firstNameTextbox = page.getByPlaceholder('First Name');
    this.lastNameTextbox = page.getByPlaceholder('Last Name');
    this.emailTextbox = page.getByRole('textbox', { name: 'Email', exact: true });
    this.mobileNumberTextbox = page.getByRole('textbox', { name: 'Mobile number', exact: true });

    this.ticketTotalAmount = page.locator('span[class="px-3"]')
    this.convenienceFeeAmount = page.locator('span[class="p-3 font-semibold"]')
    this.grandTotalAmount = page.locator('span[class="font-bold px-5"]')


    this.confirmButton = page.locator(
      'button:has-text("Confirm"), button:has-text("Book"), a:has-text("Confirm Booking")'
    ).first();
  }


  /**
   * Get the grand total amount string (e.g. "₹ 540.00")
   * @returns {Promise<string>}
   */
  async getGrandTotal() {
    await this.grandTotal.waitFor({ state: 'visible', timeout: 10000 });
    return (await this.grandTotal.textContent())?.trim() ?? '';
  }


  async proceedAsGuest() {
    await this.proceedAsGuestButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }


  async assertPaymentPageReached() {
    const payVisible = await this.payNowButton.isVisible({ timeout: 5000 }).catch(() => false);
    const confirmVisible = await this.confirmButton.isVisible({ timeout: 2000 }).catch(() => false);
    return payVisible || confirmVisible;
  }

  /**
   * @returns {Promise<boolean>}
   */
  async assertTotalIsPositive() {
    const total = await this.getGrandTotal();
    const numericValue = parseFloat(total.replace(/[^\d.]/g, ''));
    return !isNaN(numericValue) && numericValue > 0;
  }

  async assertPageRedirection() {
    const title = await this.page.title();
    await expect(title).toContain("Payment Confirmation")
    await expect(this.page).toHaveURL(/payment/);
  }

  async performGuestLogin(user) {
    await this.firstNameTextbox.fill(user.firstName);
    await this.lastNameTextbox.fill(user.lastName);
    await this.emailTextbox.fill(user.email);
    await this.mobileNumberTextbox.fill(user.mobile);
    await this.continueAsGuestButton.click()
  }

  async getBookingPriceDetails() {
    const ticketTotal =
      (await this.ticketTotalAmount.textContent())?.trim() ?? '';

    const convenienceFee =
      (await this.convenienceFeeAmount.textContent())?.trim() ?? '';

    const grandTotal =
      (await this.grandTotalAmount.textContent())?.trim() ?? '';

    return {
      ticketTotal,
      convenienceFee,
      grandTotal
    };
  }
}

module.exports = { BookingSummaryPage };
