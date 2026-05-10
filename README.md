# 🎬 Cinepolis India — Playwright Automation Framework

A Web test automation framework for "https://www.cinepolisindia.com" built with **Playwright + JavaScript**, following the **Page Object Model (POM)** pattern with **fixtures** for clean dependency injection.

---

## 📁 Project Structure

```
cinepoils-automation/
├── src/
│   ├── pages/                      # Page Object Models
│   │     ├── HomePage.js             # Landing page, city picker, movie cards
│   │     ├── MovieDetailPage.js      # Movie info, date tabs, show timings
│   │     ├── SeatSelectionPage.js    # Seat map, seat picking, booking bar
│   │     └── BookingSummaryPage.js   # Order summary, F&B, pre-payment
│   │
│   ├── fixtures/
│   │     └── pageFixtures.js         # Playwright fixture extensions (POM injection)
│   └── utils/
│         └── helpers.js              # Reusable utility functions
│
├── tests/
│   ├── movie-browsing.spec.js  # Home page & movie listing tests
│   ├── show-selection.spec.js  # Date & show timing tests
│   ├── seat-selection.spec.js  # Seat map interaction tests
│   ├── booking-flow.spec.js    # End-to-end happy path tests
│   └── negative-cases.spec.js  # Error, boundary & negative tests
│
├── test-data/
│   ├── testData.js             # Centralised test data (cities, counts, etc.)
│   └── users.json              # Centralised file to store different user details
│
│
├── reports/                    # screenshots, HTML report, JSON
├── playwright.config.js        # Playwright configuration
└── package.json
```

---

## ⚙️ Setup

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Madhukar2525/pw_automation.git
cd cinepoils-automation

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install
```

---

## 🚀 Running Tests

### Run all tests (headless, all browsers)
```bash
npm test
```

### Run all tests in headed mode (see the browser)
```bash
npm run test:headed
```

### Run a specific test suite
```bash
npm run test:movie-browsing
npm run test:show-selection
npm run test:seat-selection
npm run test:booking-flow
npm run test:negative
```

### Run with Playwright UI (interactive test explorer)
```bash
npm run test:ui
```

### Run in debug mode
```bash
npm run test:debug
```

### Run on a specific browser only
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project=mobile-chrome
```

### Run a single test file
```bash
npx playwright test tests/booking-flow.spec.js
```

### Run a single test by title
```bash
npx playwright test -g "TC-BF-01"
```

---

## 📊 Viewing Reports

```bash
# Open the HTML report after a test run
npm run report
# or
npx playwright show-report reports/html-report
```

---

## 🧪 Test Scenarios

### Movie Browsing (8 tests)
- Home page loads with Cinepolis in title
- Now Showing section visible after city selection
- Movie listing shows at least one movie card
- All movie cards have a non-empty title
- Switching city updates movie listing
- Book Now button is present on movie cards
- Clicking a movie card navigates to movie detail page
- Page URL contains cinepolisindia.com domain

### Show Selection (3 tests)
- Movie title displayed on detail page
- Date tabs present for upcoming days
- Clicking a show navigates forward

### Seat Selection (7 tests)
- Seat map renders with available seats
- Seat categories shown in legend
- Selecting one seat updates summary bar
- Selecting two seats updates total amount
- Deselecting reduces count
- Proceed button enabled when seats are selected
- Proceed navigates to booking summary

### Booking Flow — E2E (2 tests)
- Full happy path: Home → City → Movie → Show → Seats → Summary
- Back navigation returns to show listing

### Negative Cases (4 tests)
- Proceed disabled when no seats selected
- Sold-out shows are not clickable
- Non-existent movie URL shows 404 or redirects
- Booked seats cannot be selected

---