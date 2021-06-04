/* eslint-disable no-restricted-syntax */
import { splitEvery } from 'ramda';
import { ServerClient } from 'postmark';
import settings from '../settings.js';
import log from './log.js';

const mailClient = new ServerClient(settings.postmark.apiKey);

const makeMessagePostmarkFriendly = ({ to, from, subject, html, text, bcc }) => ({
  To: to,
  From: from,
  Bcc: bcc,
  Subject: subject,
  HtmlBody: html,
  TextBody: text,
});

export default async (listOfMessages) => {
  const postmarkFriendlyList = listOfMessages.map(makeMessagePostmarkFriendly);
  const batchSize = 300;
  const batches = splitEvery(batchSize, postmarkFriendlyList);
  let total = 0;
  for (const batch of batches) {
    log(`...sending ${batch.length} in this batch`);
    // eslint-disable-next-line no-await-in-loop
    const response = await mailClient.sendEmailBatch(batch);
    const successfullySent = response.filter((x) => x.ErrorCode === 0).length;
    total += successfullySent;
    log(`done! ${successfullySent} sent from this batch. ${total} total.`);
  }
};
