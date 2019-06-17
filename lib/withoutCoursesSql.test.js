const withoutCoursesSql = require('./withoutCoursesSql');
const removeExtraneousWhitespace = require('./removeExtraneousWhitespace');

const baseQuery = `
  select id, crs_cde, term, year, firstName, lastName
  from student_crs_hist sch
  where term >= 2001
`;

describe.only('withoutCoursesSql', () => {
  it('adds course exclusions to a baseQuery', () => {
    const courses = [{ term: 'FA', year: 2019, sections: ['IDM  6610 20'] }];
    const expected = `
    select id, crs_cde, term, year, firstName, lastName 
    from student_crs_hist sch 
    where term >= 2001 
    and not
    (( 
      sch.crs_cde in ('IDM 6610 20')
      and sch.trm_cde = 'FA' 
      and sch.yr_cde = '2019'
    ))`;

    const sql = withoutCoursesSql({ baseQuery, courses });

    expect(removeExtraneousWhitespace(sql)).toBe(removeExtraneousWhitespace(expected));
  });
  it('excludes courses from multiple sections within a given term', () => {
    const courses = [{ term: 'FA', year: 2019, sections: ['IDM  6610 20', 'IDM  6611 20'] }];
    const expected = `
    select id, crs_cde, term, year, firstName, lastName 
    from student_crs_hist sch 
    where term >= 2001 
    and not
    (( 
      sch.crs_cde in ('IDM  6610 20', 'IDM  6611 20')
      and sch.trm_cde = 'FA' 
      and sch.yr_cde = '2019'
    ))`;

    const sql = withoutCoursesSql({ baseQuery, courses });

    expect(removeExtraneousWhitespace(sql)).toBe(removeExtraneousWhitespace(expected));
  });
  it('excludes courses form multiple terms', () => {
    const courses = [
      { term: 'FA', year: 2019, sections: ['IDM  6610 20', 'IDM  6611 20'] },
      // note that Spring 2020 should convert to yr_cde `2019`
      { term: 'SP', year: 2020, sections: ['AH   1234 20', 'HS   5678 20'] },
    ];
    const expected = `
    select id, crs_cde, term, year, firstName, lastName 
    from student_crs_hist sch 
    where term >= 2001 
    and not
    (( 
      sch.crs_cde in ('IDM  6610 20', 'IDM  6611 20')
      and sch.trm_cde = 'FA' 
      and sch.yr_cde = '2019'
    ) or ( 
      sch.crs_cde in ('AH   1234 20', 'HS   5678 20')
      and sch.trm_cde = 'SP' 
      and sch.yr_cde = '2019'
    ))`;

    const sql = withoutCoursesSql({ baseQuery, courses });

    expect(removeExtraneousWhitespace(sql)).toBe(removeExtraneousWhitespace(expected));
  });

  it('returns the baseQuery if there are no course exclusions', () => {
    expect(withoutCoursesSql({ baseQuery, courses: [] })).toBe(baseQuery);
    expect(withoutCoursesSql({ baseQuery })).toBe(baseQuery);
  });
  // it('adds exclusions based on the given baseTable')
});
