import { values, pick, groupBy } from 'ramda';
import { basename } from 'path';
import generateEmails from '../../lib/generateEmails.js';
import jex from '../../services/jex.js';
import cleanJexData from '../../lib/cleanJexData.js';

const createSQL = ({ today }) => {
  // use cast(getdate() as date) to get only the date
  // otherwise getdate() will include time and the query
  // won't work as expected
  const quotedDateOrGetDate = today ? `'${today}'` : 'CAST(getdate() AS date)';
  return `
  declare @today datetime;
  declare @tomorrow datetime;
  declare @weekfromnow  datetime;
  set @today = ${quotedDateOrGetDate}
  set @tomorrow = dateadd(day,1,@today);
  set @weekfromnow = dateadd(day, cast(7 as int), @today);
  
  select distinct nm.id_num as id
  , rtrim(am_meml.addr_line_2) as username
  , rtrim(am_meml.addr_line_1) as mcadEmail
  , rtrim(am_peml.addr_line_1) as personalEmail
  , COALESCE(NULLIF(nm.preferred_name,''), nm.first_name) as firstName
  , rtrim(nm.last_name) as lastName
  , rtrim(sch.crs_cde) as courseCode
  , rtrim(sch.trm_cde) as term
  , year =
    CASE sch.trm_cde
      WHEN 'FA' THEN sch.yr_cde
      ELSE sch.yr_cde + 1
    END
  , rtrim(concat(sch.crs_title, ' ', sch.crs_title_2)) as courseName
  , sch.credit_hrs as credits
  , ss.begin_dte as startDate
  , ss.end_dte as endDate
  , COALESCE(NULLIF(nm_faculty.preferred_name,''), nm_faculty.first_name) as facultyFirstName
  , nm_faculty.LAST_NAME as facultyLastName
  from student_crs_hist sch
    inner join name_master nm
    on sch.id_num = nm.id_num
    left join address_master am_meml
    on sch.id_num = am_meml.id_num
      and am_meml.addr_cde = 'MEML'
    left join address_master am_peml
    on sch.id_num = am_peml.id_num
      and am_peml.addr_cde = 'PEML'
    inner join section_schedules ss
    on ss.crs_cde = sch.crs_cde
      and ss.trm_cde = sch.trm_cde
      and ss.yr_cde = sch.yr_cde
    left join SECTION_MASTER sm
      on sch.CRS_CDE = sm.CRS_CDE
      and sch.TRM_CDE = sm.TRM_CDE
      and sch.YR_CDE = sm.YR_CDE
    left join NAME_MASTER nm_faculty
      on sm.LEAD_INSTRUCTR_ID = nm_faculty.ID_NUM
  where 
    -- both remote and online courses
    ss.room_cde in ('REM','OL')
    -- ignore list
    and sch.crs_div not in ('CE') -- No CE courses
    -- and sch.crs_cde not like '% IN99 %' -- Internships
    and sch.crs_cde not like '% EX99 %' -- Externships
    and sch.crs_cde not like '% IS99 %' -- Independent Studies
    and sch.crs_cde not like 'OC %' -- off campus
    and sch.crs_cde not like '% GM99 %' -- Graduate Mentored Credits
    and sch.crs_cde not like 'DT %' -- Preregistration courses
    and sch.crs_cde not like 'MCAD %' -- MCADemy
    and sch.crs_cde not like 'OL   0% %' -- Online Learning Workshops
    -- NOTE: Don't check sch.waitlist_flag
    -- if a student is added after being waitlisted, 
    -- the waitlist_flag will still be set. Records recommends checking
    -- transaction_sts = 'W' instead.
    and sch.TRANSACTION_STS not in ('W') -- dont include waitlisted students
  
    -- only students which begin within a week
    and ss.begin_dte = @weekfromnow
  `;
};

async function getListOfRecords({ today }) {
  const sql = createSQL({ today });
  const records = await jex.query(sql).then(cleanJexData);

  const getStudentInfoFromRecord = pick([
    'id',
    'username',
    'firstName',
    'lastName',
    'mcadEmail',
    'personalEmail',
  ]);

  const getCourseInfoFromRecord = pick([
    'courseCode',
    'term',
    'year',
    'courseName',
    'credits',
    'startDate',
    'endDate',
    'openDate',
    'facultyFirstName',
    'facultyLastName',
  ]);

  const createStudentWithCourseList = (studentRecords) => {
    if (!studentRecords.length) throw Error('student must have at least one record');

    const student = getStudentInfoFromRecord(studentRecords[0]);
    const courses = studentRecords.map(getCourseInfoFromRecord);
    return {
      ...student,
      hasMultipleCourses: courses.length > 1,
      openDate: courses[0].openDate,
      courses,
    };
  };

  // group records by student, so that each student has a list
  // of courses. We should only send one email per student
  const coursesGroupedByStudentId = groupBy((x) => x.id, records);
  const studentsWithCourses = values(coursesGroupedByStudentId).map(createStudentWithCourseList);
  return studentsWithCourses;
}

async function task({ today }) {
  const records = await getListOfRecords({ today });

  return generateEmails({
    template: basename(__dirname),
    records,
    to: ({ firstName, lastName, personalEmail, mcadEmail }) =>
      [
        `${firstName} ${lastName} <${personalEmail}>`,
        `${firstName} ${lastName} <${mcadEmail}>`,
      ].join(', '),
    from: () => 'MCAD Online Learning <online@mcad.edu>',
    bcc: () => 'James Johnson <james_johnson@mcad.edu>',
    requiredFields: ['username', 'personalEmail'],
  });
}

export default task;
