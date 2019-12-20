const path = require('path');
const generateEmails = require('../../lib/generateEmails');
const getBbOrientationRecords = require('./getBbOrientationRecords');

async function task({ today }) {
  const records = await getBbOrientationRecords({ today });

  return generateEmails({
    template: path.basename(__dirname),
    records,
    to: ({ firstName, lastName, personalEmail, mcadEmail }) =>
      [
        `${firstName} ${lastName} <${personalEmail}>`,
        `${firstName} ${lastName} <${mcadEmail}>`,
      ].join(', '),
    from: () => 'MCAD Online Learning <online@mcad.edu>',
    bcc: () =>
      'MCAD Online Learning <online@mcad.edu>, ***REMOVED***',
    requiredFields: ['username', 'personalEmail'],
  });
}

module.exports = task;
