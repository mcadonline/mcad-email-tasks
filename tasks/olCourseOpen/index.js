const path = require('path');
const generateEmails = require('../../lib/generateEmails');
const getCanvasCourseOpenRecords = require('./getCanvasCourseOpenRecords');
const { salesforce } = require('../../settings');

async function task({ today }) {
  const records = await getCanvasCourseOpenRecords({ today });

  return generateEmails({
    template: path.basename(__dirname),
    records,
    to: ({ firstName, lastName, personalEmail, mcadEmail }) =>
      [
        `${firstName} ${lastName} <${personalEmail}>`,
        `${firstName} ${lastName} <${mcadEmail}>`,
      ].join(', '),
    from: () => 'MCAD Online Learning <online@mcad.edu>',
    bcc: () => [salesforce.email, 'MCAD Online Learning <online@mcad.edu>'].join(','),
    requiredFields: ['username', 'personalEmail'],
  });
}

module.exports = task;
