import { basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import generateEmails from '../../lib/generateEmails.js';
import getCanvasCourseOpenRecords from './getCanvasCourseOpenRecords.js';
import settings from '../../settings.js';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

async function task({ today }) {
  const records = await getCanvasCourseOpenRecords({ today });

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
