import { basename } from 'path';
import getCanvasOrientationRecords from './getCanvasOrientationRecords.js';
import generateEmails from '../../lib/generateEmails.js';
import settings from '../../settings.js';

async function task({ today }) {
  const records = await getCanvasOrientationRecords({ today });

  return generateEmails({
    template: basename(__dirname),
    records,
    to: ({ firstName, lastName, personalEmail, mcadEmail }) =>
      [
        `${firstName} ${lastName} <${personalEmail}>`,
        `${firstName} ${lastName} <${mcadEmail}>`,
      ].join(', '),
    from: () => 'MCAD Online Learning <online@mcad.edu>',
    bcc: () => [settings.salesforce.email, 'MCAD Online Learning <online@mcad.edu>'].join(','),
    requiredFields: ['username', 'personalEmail'],
  });
}

export default task;
