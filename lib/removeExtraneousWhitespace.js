export default function removeExtraneousWhitespace(str) {
  return str.trim().replace(/\s+/g, ' ');
}
