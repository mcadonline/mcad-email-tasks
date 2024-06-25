/* eslint-disable no-restricted-syntax */
import { splitEvery } from 'ramda';
import { ServerClient } from 'postmark';
import settings from '../settings.js';
import log from './log.js';
import * as mandril from '@mailchimp/mailchimp_transactional';

let mailClient;
if (settings.mailClient === 'postmark') {
  mailClient = new ServerClient(settings.postmark.apiKey);
} else {
  mailClient = mandril.default(settings.mandril.apiKey);
}

const makeMessagePostmarkFriendly = ({ to, from, subject, html, text, bcc }) => ({
  To: to,
  From: from,
  Bcc: bcc,
  Subject: subject,
  HtmlBody: html,
  TextBody: text,
});

// Remove when we remove postmark
const splitAndParse = (mail, type = 'to') => {
  if (mail !== '') {
    let values = mail.split('<');
    let email;

    if (values[1]) {
      let emailTexts = values[1].split('>');
      email = emailTexts[0];
    }

    return {
      email,
      name: values[0].trim(),
      type
    }
  }

  return {
    email: '',
  }
}

const makeMessageMandrilFriendly = ({ to, from, subject, html, text, bcc }) => {
  let toEmails = to.split(',').map((email) => splitAndParse(email))
  
  if (bcc) {
    let bccEmails = bcc.split(',');
    bccEmails = bccEmails.map((bccEmail) => splitAndParse(bccEmail, 'bcc'));
    toEmails = toEmails.concat(bccEmails)
  }

  let fromEmail = splitAndParse(from);
  
  return {
    to: toEmails,
    from_email: fromEmail.email,
    from_name: fromEmail.name,
    html,
    text,
    subject
  }
}

export default async (listOfMessages) => {
  let total = 0;
  let successfullySent = 0;

  if (settings.mailClient === 'postmark') {
    const postmarkFriendlyList = listOfMessages.map(makeMessagePostmarkFriendly);
    const batchSize = 300;
    const batches = splitEvery(batchSize, postmarkFriendlyList);
    for (const batch of batches) {
      log(`...sending ${batch.length} in this batch`);
      // eslint-disable-next-line no-await-in-loop
      const response = await mailClient.sendEmailBatch(batch);
      successfullySent = response.filter((x) => x.ErrorCode === 0).length;
      total += successfullySent;
      log(`done! ${successfullySent} sent from this batch. ${total} total.`);
    }
  } else {
    const mandrilFriendlyList = listOfMessages.map(makeMessageMandrilFriendly);
    for (const message of mandrilFriendlyList) {
      const response = await mailClient.messages.send({ message: message })
      successfullySent = response.filter((x) => x.status === 'send').length
      total += successfullySent;
    }

    log(`done! ${successfullySent} sent from this batch. ${total} total.`);
  }
};
