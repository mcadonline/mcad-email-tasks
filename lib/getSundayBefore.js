import { DateTime } from 'luxon';

export default function getSundayBefore(date) {
  const dt = DateTime.fromJSDate(date);
  // d.weekday is the number of days after Sunday
  // so we subtract d.weekday to get back to Sunday
  return dt.minus({ days: dt.weekday }).toJSDate();
}
