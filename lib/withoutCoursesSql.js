import toJexYear from './toJexYear.js';

export default function withoutCanvasCoursesSql({ baseQuery, sectionTable = 'sch', courses = [] }) {
  if (!courses.length) return baseQuery;

  const restrictionsSQL = courses
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
}
