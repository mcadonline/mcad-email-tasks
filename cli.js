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
const olCourseRegConfirm = require('./tasks/olCourseRegConfirm');

// Tasks
const validTasks = {
  'canvas-orientation': canvasOrientation,
  'ol-course-reg-confirm': olCourseRegConfirm,
};

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

  Emails
    ${Object.keys(validTasks).join('\n')}
  
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

    if (send) {
      log('✉️  Sending Emails\n');
      await Promise.all(emails.map(sendEmail));
    }

    if (preview && emails[0]) {
      log(`👁  previewing email 1 of ${emails.length}. Opening browser...\n`);
      previewEmail(emails[0])
        .then(log)
        .catch(log);
    }

    emails.map(x => log(`${emailToString(x)}\n`));
    log('✅  Done!');
    if (emailLog) {
      // email send log
      sendEmail({
        to: emailLog,
        from: settings.log.from,
        subject: `[${taskChoice}] ${emails.length} sent`,
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
