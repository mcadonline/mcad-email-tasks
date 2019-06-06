const { DateTime } = require('luxon');
const toShortYear = require('./toShortYear');
const toHyphenatedCourseCode = require('./toHyphenatedCourseCode');
const correctForJexDateOffset = require('./correctSQLDateTimeOffset');

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

const getTerm = (term) => {
  if (term === 'FA') return 'Fall';
  if (term === 'SP') return 'Spring';
  if (term === 'SU') return 'Summer';
};

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
    termCode: term,
    term: getTerm(term),
    year,
    firstName: preferredName || firstName,
    startDate: toPrettyDate(correctedStartDate),
    endDate: toPrettyDate(correctedEndDate),
    openDate: toPrettyDate(getSundayBefore(correctedStartDate)),
  };
}

module.exports = cleanJexData;
