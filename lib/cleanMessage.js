import removeExtraneousWhitespace from './removeExtraneousWhitespace';

export default function cleanMessage(message) {
  return Object.keys(message).reduce(
    (acc, key) => ({
      ...acc,
      // get rid of extraneous whitespace
      [key]: removeExtraneousWhitespace(message[key]),
    }),
    {},
  );
}
