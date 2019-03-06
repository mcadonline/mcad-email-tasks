const path = require('path');
const jex = require('../../services/jex');
const generateEmails = require('../../lib/generateEmails');
const log = require('../../lib/log');

const createSQL = ({ today }) => {
  // use cast(getdate() as date) to get only the date
  // otherwise getdate() will include time and the query
  // won't work as expected
  const quotedDateOrGetDate = today ? `'${today}'` : 'CAST(getdate() AS date)';
  return `
declare @today datetime;
declare @tomorrow datetime;
set @today = ${quotedDateOrGetDate}
set @tomorrow = dateadd(day,1,@today);

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
  , DATEADD(d, -1 * DATEPART(dw, ss.begin_dte) + 1, ss.begin_dte) as sundayBeforeStart
from student_crs_hist sch
inner join name_master nm
    on sch.id_num = nm.id_num
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
where ss.room_cde = 'OL'
  -- no MCADemy emails
  and sch.crs_cde not like 'MCAD 0101 %'
  -- ignore GDC Adobe Workshops (1-day)
  and sch.crs_cde not like 'GD   6411 %'
  and sch.crs_cde not like 'GD   6413 %'
  and sch.crs_cde not like 'GD   6511 %'
  -- current, preregistered students
  -- this eliminates the case where add_dte
  -- gets updated for drops and withdrawals
  and transaction_sts in ('C','P')
  -- only include canvas courses
  and (
    sch.crs_cde in (
      'SD   6750 20', -- Creative Leadership, A. Nowak
      'GWD  7460 20', -- UX Design, M.Luken
      'HS   5010 20', -- LA Adv Seminar, D. Pankonien
      '2D   3206 20' -- Illustrating Ideas, A. Mitchell
    )
    and sch.trm_cde = 'SP'
    and sch.yr_cde = '2018'
  )
  and ( 
    -- today is the sunday before the start date
    @today = DATEADD(d, -1 * DATEPART(dw, ss.begin_dte) + 1, ss.begin_dte)
    -- handle any late adds
    --   i.e., if today is after the sunday before start
    --   and their add_dte is EXACTLY today
      or (
        @today > DATEADD(d, -1 * DATEPART(dw, ss.begin_dte) + 1, ss.begin_dte)
        and sch.add_dte > @today
        and sch.add_dte < @tomorrow
      )
  )
  `;
};

const to = ({
  firstName, lastName, personalEmail, mcadEmail,
}) => `
  ${firstName} ${lastName} <${personalEmail}>,
  ${firstName} ${lastName} <${mcadEmail}>
`;

const from = () => 'MCAD Online Learning <online@mcad.edu>';

async function sendEmails({ today }) {
  const sql = createSQL({ today });
  const data = await jex.query(sql);

  if (!data.length) {
    log('No Emails to send today. Exiting.');
    return [];
  }

  const emails = await generateEmails({
    template: path.basename(__dirname),
    data,
    to,
    from,
    bcc: from,
  });

  return emails;
}

module.exports = sendEmails;
