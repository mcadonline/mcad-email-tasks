#!/usr/bin/env node

const path = require('path');
const meow = require('meow');
const { DateTime } = require('luxon');
const log = require('./lib/log');
const writeFile = require('./lib/writeFile');

// Tasks
const canvasOrientation = require('./tasks/canvasOrientation');

const validTasks = {
  'canvas-orientation': canvasOrientation,
};

const isValidTask = t => !!validTasks[t];

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
    --help
        print this usage guide
  
  Examples
    $ mcad-email-tasks canvas-orientation --today 2019-01-15
`,
    {
      flags: {
        today: {
          type: 'string',
          alias: 't',
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
      },
    },
  );

  const taskChoice = cli.input[0];
  if (!isValidTask(taskChoice)) {
    log(`Sorry "${taskChoice}" is not a valid task`);
    return cli.showHelp();
  }

  const taskFn = validTasks[taskChoice];
  log(`Running Task: ${taskChoice}`);
  log(`options: ${JSON.stringify(cli.flags)}`);
  try {
    await taskFn(cli.flags);
  } catch (error) {
    log(error);
  }

  const logContents = log('Task Completed');

  const timestamp = DateTime.local()
    .toISO()
    .replace(/[-:T]/g, '')
    .replace(/\..+$/, '');

  const filename = `${taskChoice}-${timestamp}.log`;
  const fileDest = path.join(__dirname, './tmp', filename);
  await writeFile(fileDest, logContents.join('\n')).catch(console.error);
  console.log(`\n👍  Output: ${fileDest}`);
}

// log unhandled rejections
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

main();
