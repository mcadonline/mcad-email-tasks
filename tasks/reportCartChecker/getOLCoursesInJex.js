import jex from '../../services/jex.js';

const createSQL = () => `
    declare @today datetime;
    set @today = getdate();

    select rtrim(sm.trm_cde) as term
    , year =
        CASE sm.trm_cde
          WHEN 'FA' THEN sm.yr_cde
          ELSE sm.yr_cde + 1
        END
    , rtrim(sm.crs_cde) as courseCode
    , rtrim(concat(crs_title, ' ', crs_title_2)) as title
    , crs_enrollment as enrollment
    , crs_capacity as enrollmentCap
    , convert(date, first_begin_dte) as startDate
    , convert(date, last_end_dte) as endDate
    , ss.ROOM_CDE as room
    from section_master sm
    join section_schedules ss
    on sm.trm_cde = ss.trm_cde
      and sm.crs_cde = ss.crs_cde
      and sm.yr_cde = ss.yr_cde
    where 
    (
      room_cde = 'OL'
      or sm.INSTITUT_DIV_CDE = 'CE'
    )
    and x_listed_parnt_crs = sm.crs_cde
    -- CE courses may remain published up to 30 days after official end date
    and dateadd(day,30,sm.LAST_END_DTE) >= @today
    order by
      startDate
      , year
      , term
      , courseCode
    `;

/**
 * last two digits of a given year
 * @param {Int|String} year
 */
function getShortYear(year) {
  return year.toString().slice(-2);
}

/**
 * Make jex course data prettier.
 * @param {Object} course - raw course returned from Jex query
 */
function normalizeJexCourse(course) {
  const { courseCode, term, year, title, enrollment, enrollmentCap, startDate, endDate, room } =
    course;
  const hyphenatedCourseCode = courseCode.split(/\s+/).join('-');
  const courseId = `${hyphenatedCourseCode}-${term}${getShortYear(year)}`;
  return {
    courseId,
    title,
    enrollment,
    enrollmentCap,
    seatsRemaining: Math.max(enrollmentCap - enrollment, 0),
    startDate,
    endDate,
    room,
  };
}

async function getOLCoursesInJex() {
  const sql = createSQL();
  const courses = await jex.query(sql).catch((err) => console.error(err.message));
  return courses.map(normalizeJexCourse);
}

export default getOLCoursesInJex;
