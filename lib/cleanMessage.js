module.exports = function cleanMessage(message) {
  return Object.keys(message).reduce(
    (acc, key) => ({
      ...acc,
      // get rid of extraneous whitespace
      [key]: message[key].trim().replace(/\s+/, ' '),
    }),
    {},
  );
};
