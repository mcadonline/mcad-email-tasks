const sql = require('mssql');
const settings = require('../settings');

// get students participating in canvas pilot
// where the course opens in 1 week
// or the course opens in less than 1 week and
// the student has just added
// these are students which need to receive the Canvas orientation
// page
const createSqlQuery = (mockDateAsToday) => {
  const today = mockDateAsToday ? `'${mockDateAsToday}'` : 'getdate()';
  return `
declare @today datetime;
declare @tomorrow datetime;
declare @weekfromnow  datetime;
set @today = ${today};
set @tomorrow = dateadd(day,1,@today);
set @weekfromnow = dateadd(day, cast(7 as int), @today);

select distinct nm.id_num as id
, rtrim(am_meml.addr_line_2) as username
, rtrim(am_meml.addr_line_1) as mcadEmail
, rtrim(am_peml.addr_line_1) as personalEmail
, rtrim(nm.first_name) as firstName
, rtrim(nm.preferred_name) as preferredName
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
, sch.add_dte as createdAt
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
-- only canvas pilot courses
where sch.crs_cde in (
  'SD   6750 20', -- Creative Leadership, Anita Nowak (and Denise DeLuca)
  'GWD  7460 20', -- UX Design, Matthew Luken
  'HS   5010 20', -- LA Adv Seminar, Dawn Pankonien
  '2D   3206 20', -- Illustrating Ideas, Alex Mitchell
  'ILL  2000 01', -- Intro to Illustration, Jaime Anderson
  'GRD  5100 01', -- Senior Project: Graphic Design, Jancourt
  'AH   2103 01' -- Applied Arts and Designed Objects, GGG
)
  and sch.trm_cde = 'SP'
  and sch.yr_cde = '2018'
  and sch.waitlist_flag is null
  -- only include students with username
  and am_meml.addr_line_2 is not null
  and ( ss.begin_dte = @weekfromnow
    or (
      ss.begin_dte < @weekfromnow
        and sch.add_dte > @today
        and sch.add_dte < @tomorrow
    )
  )
`;
};

function cleanData(entry) {
  return entry;
}

async function getCanvasStudentsFromJex(mockDateToday) {
  const {
    username, password, server, database,
  } = settings.jex;
  const uri = `mssql://${username}:${password}@${server}/${database}`;
  try {
    const query = createSqlQuery(mockDateToday);
    const pool = await sql.connect(uri);
    const result = await pool.request().query(query);
    pool.close();
    return result.recordset.map(cleanData);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = getCanvasStudentsFromJex;
