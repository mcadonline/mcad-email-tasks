const fs = require('fs');

function readFilePromisified(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
}

module.exports = readFilePromisified;
