const postmark = require('postmark');
const settings = require('../settings');

const mailClient = new postmark.ServerClient(settings.postmark.apiKey);

module.exports = function sendMail({
  to, from, subject, body,
}) {
  mailClient.sendEmail({
    To: to,
    From: from,
    Subject: subject,
    HtmlBody: body,
  });
};
