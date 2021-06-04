import postmark from 'postmark';
import settings from '../settings.js';

const mailClient = new postmark.ServerClient(settings.postmark.apiKey);

export default ({ to, from, subject, html, text, bcc }) =>
  mailClient.sendEmail({
    To: to,
    From: from,
    Bcc: bcc,
    Subject: subject,
    HtmlBody: html,
    TextBody: text,
  });
