const sendCanvasOrientationEmails = require('./emails/canvasOrientation');

async function main(opts) {
  const asyncTasksArray = [sendCanvasOrientationEmails(opts)];

  await Promise.all(asyncTasksArray);
  console.log('Tasks Complete');
}

main({ mockTodayAs: '2019-01-15', preview: true });
