const path = require('path');
const Email = require('email-templates');

/**
 * generates messages given a collection of data
 * and a template
 * @param template - name of template in emails dir
 * @param data - collection of email source data (e.g. students)
 * @param to - function which generating the to address(es). Uses email source data.
 * @param from - function generating the from address. Uses email source data.
 */
function generateEmails({
  template, data, to, from, bcc,
}) {
  const relativeTo = path.join(__dirname, `../tasks/${template}`);
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
        relativeTo,
      },
    },
  });

  // default path is './emails'
  const templatePath = `../tasks/${template}`;
  return Promise.all(
    data.map(async (messageData) => {
      const renderAllResults = await email.renderAll(templatePath, messageData);

      const message = {
        ...renderAllResults,
        to: to(messageData),
        from: from(messageData),
        bcc: bcc(messageData),
      };

      return message;
    }),
  );
}

module.exports = generateEmails;
