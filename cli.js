#!/usr/bin/env node

const path = require('path');
const meow = require('meow');
const { DateTime } = require('luxon');
const previewEmail = require('preview-email');
const settings = require('./settings');
const log = require('./lib/log');
const writeFile = require('./lib/writeFile');
const sendEmail = require('./lib/sendEmail');
const canvasOrientation = require('./tasks/canvasOrientation');
const bbOrientation = require('./tasks/bbOrientation');
const olCourseRegConfirm = require('./tasks/olCourseRegConfirm');
const bbCourseOpen = require('./tasks/bbCourseOpen');
const canvasCourseOpen = require('./tasks/canvasCourseOpen');
const cePapercut = require('./tasks/cePapercut');

// Tasks
const validTasks = {
  'ol-course-reg-confirm': olCourseRegConfirm,
  'bb-orientation': bbOrientation,
  'bb-course-open': bbCourseOpen,
  'canvas-orientation': canvasOrientation,
  'canvas-course-open': canvasCourseOpen,
  'ce-papercut': cePapercut,
};

const stringifyTasks = (tasks = validTasks) => Object.keys(tasks)
  .map(t => `\n\t    ${t}`)
  .join(' ');

// Helper Functions
const isValidTask = t => !!validTasks[t];
const stripNewlines = str => str.replace(/\n/g, '');

const emailToString = ({
  to, from, bcc, subject, html, text,
}) => [
  `${'to:'.padEnd(8)} ${to}`,
  `${'from:'.padEnd(8)} ${from}`,
  `${'bcc:'.padEnd(8)} ${bcc}`,
  `${'subject:'.padEnd(8)} ${subject}`,
  `${'html:'.padEnd(8)} ${html.substring(0, 320)}...`,
  `${'text:'.padEnd(8)} ${text.substring(0, 320)}...`,
]
  .map(stripNewlines)
  .join('\n');

async function main() {
  const cli = meow(
    `
  Usage
    $ mcad-email-tasks <email-name> <options>

  Email Names ${stringifyTasks()}
  
  Options
    --today <ISO Date>     
        generate emails as if today was given date
    --preview
        opens a preview of the email
    --send
        sends the email
    --email-log <email@address.com>
        sends the log to email address
    --help
        print this usage guide
  
  Examples
    $ mcad-email-tasks canvas-orientation --today 2019-01-15
`,
    {
      flags: {
        today: {
          type: 'string',
          default: null,
        },
        preview: {
          type: 'boolean',
          default: false,
        },
        send: {
          type: 'boolean',
          default: false,
        },
        emailLog: {
          type: 'string',
          default: false,
        },
      },
    },
  );

  const taskChoice = cli.input[0];
  const { send, preview, emailLog } = cli.flags;

  // show help if not a valid task name
  if (!isValidTask(taskChoice)) {
    log(`Sorry "${taskChoice}" is not a valid task`);
    return cli.showHelp();
  }

  try {
    // run task if it is a valid task name
    log(`> [${DateTime.local().toString()}]`);
    log(`> Task: ${taskChoice}`);
    log(`> options: ${JSON.stringify(cli.flags)}`);
    log('\n');

    const taskFn = validTasks[taskChoice];
    const emails = await taskFn(cli.flags);

    log(`Generated ${emails.length} emails\n`);

    // console.warn(`Listing Emails: ${JSON.stringify(emails, ' ', 2)}`);

    if (!emails.length) {
      log('0️⃣  No emails to send today.');
    }

    if (emails.length && send) {
      await Promise.all(emails.map(sendEmail));
      log(`📤  Sending ${emails.length} emails.`);
    }

    if (emails.length && !send) {
      log('🤔  Only generating emails, but not sending.');
    }

    if (emails.length && preview) {
      log(`👁  previewing email 1 of ${emails.length}. Opening browser...\n`);
      previewEmail(emails[0])
        .then(log)
        .catch(log);
    }

    emails.forEach(x => log(`${emailToString(x)}\n`));
    log(`Total: ${emails.length} emails\n`);

    log('✅  Done!');
    if (emailLog) {
      // email send log
      sendEmail({
        to: emailLog,
        from: settings.log.from,
        subject: `[${taskChoice}] ${emails.length} emails ${
          send ? 'sent' : 'generated, but not sent'
        }`,
        text: log().join('\n'),
      });
    }
  } catch (error) {
    log('❌  Error');
    log(error);
    if (emailLog) {
      sendEmail({
        to: emailLog,
        from: settings.log.from,
        subject: `[${taskChoice}] ❌ Error`,
        text: log().join('\n'),
      });
    }
  }

  const timestamp = DateTime.local()
    .toISO()
    .replace(/[-:T]/g, '')
    .replace(/\..+$/, '');

  const filename = `${taskChoice}-${timestamp}.log`;
  const fileDest = path.join(__dirname, './tmp', filename);
  log(`\n👍  Output: ${fileDest}`);
  await writeFile(fileDest, log().join('\n')).catch(console.error);

  return true;
}

// log unhandled rejections
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

main();
