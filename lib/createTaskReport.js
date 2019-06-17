const { DateTime } = require('luxon');
const ow = require('ow');

const getTimestamp = () => DateTime.local().toString();
const emailSummary = emails => (emails.length ? `* ✉️  Emails: ${emails.length}` : '* 0️⃣  No Emails to Send.');
const errorSummary = errors => errors.length && `* ❌  Errors: ${errors.length}`;

const optSummary = ({ emails, opts }) => [
  emails.length && opts.send
    ? '* 📤  Sending emails.'
    : '* 🤔  Generating emails, but not sending.',
  opts.emailLog && `* 📔  Log to: ${opts.emailLog}`,
  opts.preview && `* 👁  previewing email 1 of ${emails.length}. Opening browser...`,
]
  .filter(Boolean)
  .join('\n');

const errorsReport = (errors) => {
  if (!errors.length) return '';
  return ['❌ ERRORS', '------', ...errors].join('\n\n');
};

const createSummary = ({ errors, emails, opts }) => ['** SUMMARY', errorSummary(errors), emailSummary(emails), optSummary({ emails, opts }), '**']
  .filter(Boolean)
  .join('\n');

const stripNewlines = str => str.replace(/\n/g, '');
const emailToString = ({
  to, from, bcc, subject, html, text,
}) => [
  `TO: ${to}`,
  `FROM: ${from}`,
  `BCC: ${bcc}`,
  `SUBJECT: ${subject}`,
  `HTML: ${html.substring(0, 320)}...`,
  `TEXT: ${text.substring(0, 320)}...`,
]
  .map(stripNewlines)
  .join('\n');

const emailsReport = (emailMessages) => {
  if (!emailMessages.length) return '';

  return ['✉️  EMAILS', '----------', ...emailMessages.map(emailToString)].join('\n\n');
};

module.exports = function createTaskReport({
  taskName, emails, errors, opts,
}) {
  ow(taskName, ow.string);
  ow(emails, ow.array);
  ow(errors, ow.array);
  ow(opts, ow.object);

  const report = `
    [${getTimestamp()}] ${taskName}
  
    ${createSummary({ emails, errors, opts })}
    ${errorsReport(errors)}
    ${emailsReport(emails)}
  `;

  return report
    .split('\n')
    .map(str => str.trim())
    .join('\n');
};
