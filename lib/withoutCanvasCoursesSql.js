const toJexYear = require('./toJexYear');
const settings = require('../settings');

module.exports = function withoutCanvasCoursesSql(baseQuery, { sectionTable = 'sch' }) {
  // restrict to Canvas Courses
  const { canvasCourses } = settings;
  const restrictionsSQL = canvasCourses
    .map(({ year, term, sections }) => {
      const jexYear = toJexYear({ term, realYear: year });
      return `(
      ${sectionTable}.crs_cde in ('${sections.join("', '")}')
      and ${sectionTable}.trm_cde = '${term}'
      and ${sectionTable}.yr_cde = '${jexYear}'
    )`;
    })
    .join('\n or ');

  return baseQuery.concat(`and not (${restrictionsSQL})`);
};
