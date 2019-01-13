/**
 * last two digits of a given year
 * @param {Int|String} year
 */
module.exports = function toShortYear(year) {
  return year.toString().slice(-2);
};
