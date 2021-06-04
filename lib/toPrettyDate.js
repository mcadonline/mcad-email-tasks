import { DateTime } from 'luxon';

export default function toPrettyDate(date) {
  const dt = DateTime.fromJSDate(date);
  const prettyDate = dt.toLocaleString(DateTime.DATE_MED);
  return `${dt.weekdayShort}, ${prettyDate}`;
}
