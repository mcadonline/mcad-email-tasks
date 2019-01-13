const previewEmail = require('preview-email');
const generateEmails = require('./lib/generateEmails');
const cleanJexData = require('./lib/cleanJexData');
const getCanvasStudentsStartingSoonFromJex = require('./lib/getCanvasStudentsFromJex');

async function main({ mockTodaysDate = null }) {
  const canvasStudentsStartingSoon = await getCanvasStudentsStartingSoonFromJex(mockTodaysDate);

  const data = canvasStudentsStartingSoon.map(cleanJexData);

  const to = ({
    firstName, lastName, personalEmail, mcadEmail,
  }) => [`${firstName} ${lastName} <${personalEmail}>`, `${firstName} ${lastName} <${mcadEmail}>`].join(
    ', ',
  );

  const from = () => 'MCAD Online Learning <online@mcad.edu>';

  const emails = await generateEmails({
    template: 'canvasOrientation',
    data,
    to,
    from,
  });

  // emails.map(sendEmail);
  previewEmail(emails[0])
    .then(console.log)
    .catch(console.error);

  console.log(emails[0].text);
}

main({
  mockTodaysDate: '2019-01-15',
});
