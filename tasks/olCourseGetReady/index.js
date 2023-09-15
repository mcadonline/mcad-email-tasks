import { basename } from 'path';
import getCanvasOrientationRecords from './getCanvasOrientationRecords.js';
import generateEmails from '../../lib/generateEmails.js';
import settings from '../../settings.js';
import getDirnameFromImportMeta from '../../lib/getDirnameFromImportMeta.js';
import parseBccEmail from '../../lib/bccEmailParser.js';

// eslint-disable-next-line no-underscore-dangle
const __dirname = getDirnameFromImportMeta(import.meta);

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
    bcc: () => parseBccEmail(),
    requiredFields: ['username', 'personalEmail'],
  });
}

export default task;
