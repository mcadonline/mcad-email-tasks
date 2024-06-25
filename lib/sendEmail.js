import postmark from 'postmark';
import settings from '../settings.js';

import * as mandril from '@mailchimp/mailchimp_transactional';

let mailClient;
if (settings.mailClient === 'postmark') {
  mailClient = new ServerClient(settings.postmark.apiKey);
} else {
  mailClient = mandril.default(settings.mandril.apiKey);
}

// Remove when removing postmark
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

export default ({ to, from, subject, html, text, bcc }) => {
  if (settings.mailClient === 'postmark') {
    mailClient.sendEmail({
      To: to,
      From: from,
      Bcc: bcc,
      Subject: subject,
      HtmlBody: html,
      TextBody: text,
    });
  } else {
    fromEmail = splitAndParse(from);

    mailClient.messages.send({ message: {
      to: toEmails,
      from_email: fromEmail.email,
      from_name: fromEmail.name,
      html,
      text,
      subject
    } })
  }
}  
 
