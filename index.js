const path = require('path');
const Email = require('email-templates');
const previewEmail = require('preview-email');
const { DateTime } = require('luxon');
const getCanvasStudentsStartingSoonFromJex = require('./lib/getCanvasStudentsFromJex');

// function sendEmail(messageObj) {
//   console.log(messageObj);
// }

/**
 * last two digits of a given year
 * @param {Int|String} year
 */
function toShortYear(year) {
  return year.toString().slice(-2);
}

function toHyphenatedCourseCode(courseCode) {
  return courseCode.replace(/\s+/g, '-');
}

function getSundayBefore(date) {
  const dt = DateTime.fromJSDate(date);
  // jex dates aren't really UTC
  // so adjust by offset
  const correctedDate = dt.plus({ minutes: -1 * dt.offset });

  // d.weekday is the number of days after Sunday
  // so we subtract d.weekday to get back to Sunday
  return correctedDate.minus({ days: correctedDate.weekday }).toJSDate();
}

function toPrettyDate(date) {
  const dt = DateTime.fromJSDate(date);
  // jex dates aren't really UTC
  // so adjust by offset
  const correctedDate = dt.plus({ minutes: -1 * dt.offset });
  const prettyDate = correctedDate.toLocaleString(DateTime.DATE_MED);
  return `${correctedDate.weekdayShort}, ${prettyDate}`;
}

const getCourseId = ({ courseCode, term, year }) => `${toHyphenatedCourseCode(courseCode)}-${term}${toShortYear(year)}`;

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
        courseCode,
        term,
        year,
      } = messageData;

      const courseId = getCourseId({ courseCode, term, year });

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

const cleanData = ({
  firstName, preferredName, startDate, endDate, credits, ...rest
}) => ({
  ...rest,
  credits: credits === 0 ? 'non-credit' : `${credits} cr.`,
  firstName: preferredName || firstName,
  startDate: toPrettyDate(startDate),
  endDate: toPrettyDate(endDate),
  openDate: toPrettyDate(getSundayBefore(startDate)),
});

async function main({ mockTodaysDate = null }) {
  const canvasStudentsStartingSoon = await getCanvasStudentsStartingSoonFromJex(mockTodaysDate);

  const data = canvasStudentsStartingSoon.map(cleanData);

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
