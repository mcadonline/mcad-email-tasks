const postmark = require('postmark');
const settings = require('../settings');
const log = require('../lib/log');
const { splitEvery } = require('ramda');

const mailClient = new postmark.ServerClient(settings.postmark.apiKey);

const makeMessagePostmarkFriendly = ({ to, from, subject, html, text, bcc }) => ({
  To: to,
  From: from,
  Bcc: bcc,
  Subject: subject,
  HtmlBody: html,
  TextBody: text,
});

module.exports = async listOfMessages => {
  const postmarkFriendlyList = listOfMessages.map(makeMessagePostmarkFriendly);
  const batchSize = 300;
  const batches = splitEvery(batchSize, postmarkFriendlyList);
  let total = 0;
  for (const batch of batches) {
    log(`...sending ${batch.length} in this batch`);
    const response = await mailClient.sendEmailBatch(batch);
    const successfullySent = response.filter(x => x.ErrorCode === 0).length;
    total += successfullySent;
    log(`done! ${successfullySent} sent from this batch. ${total} total.`);
  }
};
