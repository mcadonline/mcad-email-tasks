import toShortYear from './toShortYear.js';
import toHyphenatedCourseCode from './toHyphenatedCourseCode.js';

const getCourseId = ({ courseCode, term, year }) =>
  `${toHyphenatedCourseCode(courseCode)}-${term}${toShortYear(year)}`;

export default getCourseId;
