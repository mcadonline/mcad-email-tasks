/**
 * last two digits of a given year
 * @param {Int|String} year
 */
export default function toShortYear(year) {
  return year.toString().slice(-2);
}
