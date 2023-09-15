import { basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import jex from '../../services/jex.js';
import cleanJexData from '../../lib/cleanJexData.js';
import generateEmails from '../../lib/generateEmails.js';
import settings from '../../settings.js';
import parseBccEmail from '../../lib/bccEmailParser.js';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

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
 , rtrim(nmu.mcad_username) as username
 , rtrim(am_meml.AlternateContact) as mcadEmail
 , rtrim(am_peml.AlternateContact) as personalEmail
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
 inner join nameMaster nm
     on sch.id_num = nm.id_num
 inner join section_master sm
    on sm.crs_cde = sch.crs_cde
        and sm.trm_cde = sch.trm_cde
        and sm.yr_cde = sch.yr_cde
 inner join section_schedules ss
    on ss.crs_cde = sch.crs_cde
        and ss.trm_cde = sch.trm_cde
        and ss.yr_cde = sch.yr_cde
 left join AlternateContactMethod am_meml
     on sch.id_num = am_meml.id_num
       and am_meml.addr_cde = 'MEML'
 left join AlternateContactMethod am_peml
     on sch.id_num = am_peml.id_num
       and am_peml.addr_cde = 'PEML'
  left join name_master_udf nmu
      on nm.id_num = nmu.id_num
 where
     sm.institut_div_cde in (
         'CS', -- include all CS courses in Jenzabar
         'CE', -- include all CE courses
         'PB' -- include all GDC courses
     ) 
     and sch.stud_div = 'CE' -- only send to CE students (not postbacc students)
     and sm.crs_cde not like 'SE   100%' --ignore PCSS courses
     and sm.crs_cde not like 'MCAD %' -- ignore MCADemy-like courses
     and sch.crs_cde not like 'OL   0% %' -- ignore online workshops
     and ss.room_cde not in ('OL', 'OLS', 'OLA') -- ignore Online Learning courses
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

async function task({ today }) {
  const sql = createSQL({ today });
  const records = await jex.query(sql).then(cleanJexData);

  const { emails, errors } = await generateEmails({
    template: basename(__dirname),
    records,
    to: ({ firstName, lastName, personalEmail, mcadEmail }) =>
      [
        `${firstName} ${lastName} <${personalEmail}>`,
        `${firstName} ${lastName} <${mcadEmail}>`,
      ].join(', '),
    from: () => 'MCAD Continuing Education <continuing_education@mcad.edu>',
    bcc: () => parseBccEmail(),
    requiredFields: ['username', 'personalEmail'],
  });
  return { emails, errors };
}

export default task;
