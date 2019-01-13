const path = require('path');
const Email = require('email-templates');
const previewEmail = require('preview-email');
const getCanvasStudentsStartingSoonFromJex = require('./lib/getCanvasStudentsFromJex');
const cleanJexData = require('./lib/cleanJexData');

// data is for multiple messages

function generateEmails({ template, data }) {
  const relativeTo = path.join(__dirname, `./emails/${template}`);
  console.log(relativeTo);
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

  return Promise.all(
    data.map(async (messageData) => {
      const {
        firstName,
        lastName,
        preferredName,
        mcadEmail,
        personalEmail,
        courseId,
      } = messageData;

      const [html, text] = await Promise.all([
        email.render(`${template}/html`, messageData),
        email.render(`${template}/text`, messageData),
      ]);

      const message = {
        to: [
          `${preferredName || firstName} ${lastName} <${personalEmail}>`,
          `${preferredName || firstName} ${lastName} <${mcadEmail}>`,
        ].join(', '),
        from: 'MCAD Online Learning <online@mcad.edu>',
        subject: `❗[${courseId}] Canvas LMS Orientation`,
        text,
        html,
      };

      return message;
    }),
  );
}

async function main({ mockTodaysDate = null }) {
  const canvasStudentsStartingSoon = await getCanvasStudentsStartingSoonFromJex(mockTodaysDate);

  const data = canvasStudentsStartingSoon.map(cleanJexData);

  const emails = await generateEmails({
    template: 'canvasOrientation',
    data,
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
