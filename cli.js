#!/usr/bin/env node

const meow = require('meow');
const canvasOrientation = require('./tasks/canvasOrientation');

const { log, error } = console;

async function main() {
  const validTasks = {
    'canvas-orientation': canvasOrientation,
  };

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
  const isValidTask = t => !!validTasks[t];
  if (!isValidTask(taskChoice)) {
    error(`Sorry "${taskChoice}" is not a valid task`);
    return cli.showHelp();
  }
  const taskFn = validTasks[taskChoice];
  log(`Running Task: ${taskChoice}`);
  log(`options: ${JSON.stringify(cli.flags)}`);
  await taskFn(cli.flags);
}

// log unhandled rejections
process.on('unhandledRejection', (reason, p) => {
  log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

main();
