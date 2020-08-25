const path = require('path');
const getCanvasOrientationRecords = require('./getCanvasOrientationRecords');
const generateEmails = require('../../lib/generateEmails');

async function task({ today }) {
  const records = await getCanvasOrientationRecords({ today });

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
