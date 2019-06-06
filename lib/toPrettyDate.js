const { DateTime } = require('luxon');

module.exports = function toPrettyDate(date) {
  const dt = DateTime.fromJSDate(date);
  const prettyDate = dt.toLocaleString(DateTime.DATE_MED);
  return `${dt.weekdayShort}, ${prettyDate}`;
};
