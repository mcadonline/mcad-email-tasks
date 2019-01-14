let logContents = [];
module.exports = function log(msg) {
  console.log(msg);
  logContents = [...logContents, msg];
  return logContents;
};
