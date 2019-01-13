const { DateTime } = require('luxon');
const toShortYear = require('./toShortYear');
const toHyphenatedCourseCode = require('./toHyphenatedCourseCode');

// jex dates aren't really UTC
// so adjust by offset
function correctForJexDateOffset(jsDate) {
  const dt = DateTime.fromJSDate(jsDate, { zone: 'America/Chicago' });
  const correctedDate = dt.plus({ minutes: -1 * dt.offset });
  return correctedDate.toJSDate();
}

function getSundayBefore(date) {
  const dt = DateTime.fromJSDate(date);

  // d.weekday is the number of days after Sunday
  // so we subtract d.weekday to get back to Sunday
  return dt.minus({ days: dt.weekday }).toJSDate();
}

function toPrettyDate(date) {
  const dt = DateTime.fromJSDate(date);
  const prettyDate = dt.toLocaleString(DateTime.DATE_MED);
  return `${dt.weekdayShort}, ${prettyDate}`;
}

const getCourseId = ({ courseCode, term, year }) => `${toHyphenatedCourseCode(courseCode)}-${term}${toShortYear(year)}`;

function cleanJexData(data) {
  if (Array.isArray(data)) return data.map(cleanJexData);

  const {
    firstName,
    preferredName,
    startDate,
    endDate,
    courseCode,
    term,
    year,
    credits,
    ...rest
  } = data;

  // correct dates from Jenzabar, since they're not
  // really in utc;
  const [correctedStartDate, correctedEndDate] = [startDate, endDate].map(correctForJexDateOffset);

  return {
    ...rest,
    credits: credits === 0 ? 'non-credit' : `${credits} cr.`,
    courseId: getCourseId({ courseCode, term, year }),
    courseCode,
    term,
    year,
    firstName: preferredName || firstName,
    startDate: toPrettyDate(correctedStartDate),
    endDate: toPrettyDate(correctedEndDate),
    openDate: toPrettyDate(getSundayBefore(correctedStartDate)),
  };
}

module.exports = cleanJexData;
