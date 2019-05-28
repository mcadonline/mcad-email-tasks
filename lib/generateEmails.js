const path = require('path');
const Email = require('email-templates');
const R = require('ramda');
const log = require('../lib/log');

/**
 * generates messages given a collection of data
 * and a template
 * @param template - name of template in emails dir
 * @param data - collection of email source data (e.g. students)
 * @param to - function which generating the to address(es). Uses email source data.
 * @param from - function generating the from address. Uses email source data.
 */
function generateEmails({
  template, data, to, from, bcc, requiredFields = [],
}) {
  const templatePath = path.join(__dirname, `../tasks/${template}`);
  const email = new Email({
    views: {
      options: {
        extension: 'hbs',
      },
    },
    juice: true,
    juiceResources: {
      preserveImportant: true,
      webResources: {
        relativeTo: templatePath,
      },
    },
  });

  // partition data records into two sets: complete records and incomplete
  // records. Incomplete records are those which may have a "null" or
  // "undefined" someplace within one of the required fields.
  const hasRequiredFields = record => requiredFields.every(key => !!record[key]);
  const [completeRecords, incompleteRecords] = R.partition(hasRequiredFields, data);

  const logIncompleteRecord = record => log(
    '❌  Error: Record does not have values in all required fields. Not generating email.'
        + `\nRequired Fields: [${requiredFields.join(', ')}]`
        + `\nRecord: ${JSON.stringify(record, ' ', 2)}`,
  );
  incompleteRecords.map(logIncompleteRecord);

  return Promise.all(
    completeRecords.map(async (messageData) => {
      const renderAllResults = await email.renderAll(templatePath, messageData);

      const message = {
        ...renderAllResults,
        to: to(messageData),
        from: from(messageData),
        bcc: bcc ? bcc(messageData) : null,
      };

      return message;
    }),
  );
}

module.exports = generateEmails;
