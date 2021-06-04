import { pipe } from 'ramda';
import getSundayBefore from './getSundayBefore.js';
import toPrettyDate from './toPrettyDate.js';
import getCourseId from './getCourseId.js';
import getFullTermName from './getFullTermName.js';

const keyExists = (key, obj) => key in obj;

const toHumanReadableCredits = (obj) => {
  if (!keyExists('credits', obj)) return obj;
  const credits = obj.credits === 0 ? 'non-credit' : `${obj.credits} cr.`;
  return { ...obj, credits };
};

const includeCourseId = (obj) => {
  if (keyExists('courseCode', obj) && keyExists('term', obj) && keyExists('year', obj)) {
    const { courseCode, term, year } = obj;
    return {
      ...obj,
      courseId: getCourseId({ courseCode, term, year }),
    };
  }
  return obj;
};

const includeTermCode = (obj) => (keyExists('term', obj) ? { ...obj, termCode: obj.term } : obj);

const makeHumanReadableTerm = (obj) =>
  keyExists('term', obj) ? { ...obj, term: getFullTermName(obj.term) } : obj;

const preferredNameAsFirstName = (obj) =>
  keyExists('firstName', obj) ? { ...obj, firstName: obj.preferredName || obj.firstName } : obj;

const addOpenDate = (obj) =>
  keyExists('startDate', obj)
    ? {
        ...obj,
        openDate: getSundayBefore(obj.startDate),
      }
    : obj;

const prettifyDateField = (fieldName) => (obj) =>
  keyExists(fieldName, obj)
    ? {
        ...obj,
        [fieldName]: toPrettyDate(obj[fieldName]),
      }
    : obj;

function cleanJexData(data) {
  if (Array.isArray(data)) return data.map(cleanJexData);

  return pipe(
    toHumanReadableCredits,
    includeCourseId,
    includeTermCode,
    makeHumanReadableTerm,
    preferredNameAsFirstName,
    addOpenDate,
    prettifyDateField('startDate'),
    prettifyDateField('endDate'),
    prettifyDateField('openDate'),
  )(data);
}

export default cleanJexData;
