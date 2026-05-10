// Centralised test data for Cinepolis India automation.

const CITIES = {
  DEFAULT: 'Mumbai',
  DELHI: 'Delhi',
  MUMBAI: 'Mumbai',
  BANGALORE: 'Bengaluru',
  CHENNAI: 'Chennai',
  HYDERABAD: 'Hyderabad'
};


const MOVIES = {
  SEARCH_QUERIES: ['Avengers', 'Spider', 'Mission'],
  KNOWN_TITLES: [],
};

const SHOWS = {
  SEAT_COUNT_MAX: 10, // max per booking
  SEAT_COUNT_OVER_MAX: 11, // To trigger the "max seats" warning
};


module.exports = {
  CITIES,
  MOVIES,
  SHOWS
};
