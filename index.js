const sendEmail = require('./lib/sendEmail');
const cleanMessage = require('./lib/cleanMessage');

const isFunction = x => typeof x === 'function';
const isString = x => typeof x === 'string';

module.exports = function huginn({
  data, to, from, subject, body, send,
}) {
  if (!Array.isArray(data)) throw new TypeError('data is not an array');
  if (!(isFunction(subject) || isString(subject))) {
    throw new TypeError('subject is not a string or function');
  }
  if (!(isFunction(body) || isString(body))) {
    throw new TypeError('html is not a function or strung');
  }

  const messages = data
    .map(item => ({
      to: to(item),
      from: from(item),
      subject: subject(item),
      body: body(item),
    }))
    .map(cleanMessage);

  if (send) {
    console.log('Sending email');
    messages.forEach(sendMail);
  } else {
    console.log('Not sending email');
  }

  return messages;
};
