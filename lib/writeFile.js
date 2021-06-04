import write from 'write';
import log from './log.js';

const writeLogFile = async (fileDest, contents) => {
  try {
    await write(fileDest, contents);
    return fileDest;
  } catch (err) {
    log(`Unable to write: ${err.message}`);
    throw err;
  }
};

export default writeLogFile;
