const path = require('path');
const jex = require('../../services/jex');
const cleanJexData = require('../../lib/cleanJexData');
const generateEmails = require('../../lib/generateEmails');
const withOnlyCanvasCoursesSql = require('../../lib/withOnlyCanvasCoursesSql');

const createSQL = ({ today }) => {
  // use cast(getdate() as date) to get only the date
  // otherwise getdate() will include time and the query
  // won't work as expected
  const quotedDateOrGetDate = today ? `'${today}'` : 'CAST(getdate() AS date)';
  const baseQuery = `
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
where 
  -- dont include waitlisted
  sch.waitlist_flag is null
  -- only include students with username
  and am_meml.addr_line_2 is not null
  -- only students which begin within a week
  -- or if it's less than one week, they've
  -- been added in the last 24 hours
  and ( ss.begin_dte = @weekfromnow
    or (
      ss.begin_dte < @weekfromnow
        and sch.add_dte > @today
        and sch.add_dte < @tomorrow
    )
  )`;

  return withOnlyCanvasCoursesSql(baseQuery, { sectionTable: 'sch' });
};

async function task({ today }) {
  const sql = createSQL({ today });
  const records = await jex.query(sql).map(cleanJexData);

  if (!records.length) return [];

  return generateEmails({
    template: path.basename(__dirname),
    data: records,
    to: ({
      firstName, lastName, personalEmail, mcadEmail,
    }) => [
      `${firstName} ${lastName} <${personalEmail}>`,
      `${firstName} ${lastName} <${mcadEmail}>`,
    ].join(', '),
    from: () => 'MCAD Online Learning <online@mcad.edu>',
    bcc: () => 'MCAD Online Learning <online@mcad.edu>, emailtosalesforce@x-4drjafbeyv5ocogfxbtq319tk.in.salesforce.com',
    requiredFields: ['username', 'personalEmail'],
  });
}

module.exports = task;
