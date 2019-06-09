const path = require('path');
const jex = require('../../services/jex');
const generateEmails = require('../../lib/generateEmails');

const createSQL = ({ today }) => {
  // use cast(getdate() as date) to get only the date
  // otherwise getdate() will include time and the query
  // won't work as expected
  const quotedDateOrGetDate = today ? `'${today}'` : 'CAST(getdate() AS date)';
  return `
  declare @today datetime;
  declare @tomorrow datetime;
  declare @xdaysfromnow datetime;
  set @today = ${quotedDateOrGetDate};
  set @tomorrow = dateadd(day,1,@today);
  set @xdaysfromnow = dateadd(day, cast(4 as int), @today);

select distinct nm.id_num as id
 , rtrim(nm.first_name) as firstName
 , rtrim(nm.preferred_name) as preferredName
 , rtrim(nm.last_name) as lastName
 , rtrim(am_meml.addr_line_2) as username
 , rtrim(am_meml.addr_line_1) as mcadEmail
 , rtrim(am_peml.addr_line_1) as personalEmail
 , rtrim(sch.trm_cde) as term
 , rtrim(sch.crs_cde) as courseCode
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
 inner join section_master sm
    on sm.crs_cde = sch.crs_cde
        and sm.trm_cde = sch.trm_cde
        and sm.yr_cde = sch.yr_cde
 inner join section_schedules ss
    on ss.crs_cde = sch.crs_cde
        and ss.trm_cde = sch.trm_cde
        and ss.yr_cde = sch.yr_cde
 left join address_master am_meml
     on sch.id_num = am_meml.id_num
       and am_meml.addr_cde = 'MEML'
 left join address_master am_peml
     on sch.id_num = am_peml.id_num
       and am_peml.addr_cde = 'PEML'
 where
     sm.institut_div_cde in (
         'CS', -- include all CS courses in Jenzabar
         'CE', -- include all CE courses
         'PB' -- include all GDC courses
     ) 
     and sch.stud_div = 'CE' -- only send to CE students (not postbacc students)
     and sm.crs_cde not like 'SE %' --ignore PCSS courses
     and sm.crs_cde not like 'MCAD 0101 %' -- ignore MCADemy
     and ss.room_cde <> 'OL' -- ignore Online Learning courses
     and transaction_sts in ('C','P','H') -- ignore waitlisted, dropped, or historical students (withdrawn, grade submitted)
     and (
         -- course begins in X days
         ss.begin_dte = @xdaysfromnow
         or (
             -- handle late adds
             -- course begins in less than X days
             -- student was added exactly today
             ss.begin_dte < @xdaysfromnow
             and sch.add_dte > @today
             and sch.add_dte < @tomorrow
         )
     )

  `;
};

async function sendEmails({ today }) {
  const sql = createSQL({ today });
  const data = await jex.query(sql);

  if (!data.length) return [];

  const emails = await generateEmails({
    template: path.basename(__dirname),
    data,
    to: ({
      firstName, lastName, personalEmail, mcadEmail,
    }) => [
      `${firstName} ${lastName} <${personalEmail}>`,
      `${firstName} ${lastName} <${mcadEmail}>`,
    ].join(', '),
    from: () => 'MCAD Continuing Education <continuing_education@mcad.edu>',
    bcc: () => 'MCAD Online Learning <online@mcad.edu>, emailtosalesforce@x-4drjafbeyv5ocogfxbtq319tk.in.salesforce.com',
    requiredFields: ['username', 'personalEmail'],
  });

  return emails;
}

module.exports = sendEmails;
