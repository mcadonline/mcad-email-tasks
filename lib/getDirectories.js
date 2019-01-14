const { promisify } = require('util');
const fs = require('fs');
const { join } = require('path');

const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

async function getDirectories(path) {
  const dirContents = await readdirAsync(path);

  return dirContents.filter(async (file) => {
    const fileStat = await statAsync(join(path, file));
    return fileStat.isDirectory();
  });
}

module.exports = getDirectories;
