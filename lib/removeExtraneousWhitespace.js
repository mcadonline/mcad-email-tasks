module.exports = function removeExtraneousWhitespace(str) {
  return str.trim().replace(/\s+/g, ' ');
};
