const path = require('path');
const Email = require('email-templates');
const R = require('ramda');

/**
 * generates messages given a collection of data
 * and a template
 * @param template - name of template in emails dir
 * @param data - collection of email source data (e.g. students)
 * @param to - function which generating the to address(es). Uses email source data.
 * @param from - function generating the from address. Uses email source data.
 * @returns {emails[], errors[]} - an object containing the list of generated
 *  emails, and a list of errors which occurred while generating.
 */
async function generateEmails({ template, records, to, from, bcc, requiredFields = [] }) {
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

  // no data? We're done!
  if (!records.length) return { emails: [], errors: [] };

  // partition data records into two sets: complete records and incomplete
  // records. Incomplete records are those which may have a "null" or
  // "undefined" someplace within one of the required fields.
  const hasRequiredFields = (record) => requiredFields.every((key) => !!record[key]);
  const [completeRecords, incompleteRecords] = R.partition(hasRequiredFields, records);

  // add any incomplete records to our list of errors
  const errors = incompleteRecords.map((record) =>
    [
      'Error: Record does not have values in all required fields. Not generating email.',
      `Required Fields: [${requiredFields.join(', ')}]`,
      `Record: ${JSON.stringify(record, ' ', 2)}`,
    ].join('\n'),
  );

  // with the complete records, generate the emails using the template
  const emails = await Promise.all(
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
  ).catch((err) => {
    console.error(`Error when attempting to generate email: ${err.message}`);
    errors.push(`Error when attempting to generate email: ${err.message}`);
  });
  return { emails, errors };
}

module.exports = generateEmails;
