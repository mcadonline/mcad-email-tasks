const postmark = require('postmark');
const settings = require('../settings');

const mailClient = new postmark.ServerClient(settings.postmark.apiKey);

module.exports = function sendMail({
  to, from, subject, html, text, bcc,
}) {
  mailClient.sendEmail({
    To: 'james_johnson@mcad.edu',
    From: from,
    Bcc: bcc,
    Subject: subject,
    HtmlBody: html,
    TextBody: text,
  });
};
