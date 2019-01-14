const write = require('write');
const log = require('./log');

const writeLogFile = async (fileDest, contents) => {
  try {
    await write(fileDest, contents);
    return fileDest;
  } catch (err) {
    log(`Unable to write: ${err.message}`);
    throw err;
  }
};

module.exports = writeLogFile;
