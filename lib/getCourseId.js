const toShortYear = require('./toShortYear');
const toHyphenatedCourseCode = require('./toHyphenatedCourseCode');

const getCourseId = ({ courseCode, term, year }) => `${toHyphenatedCourseCode(courseCode)}-${term}${toShortYear(year)}`;

module.exports = getCourseId;
