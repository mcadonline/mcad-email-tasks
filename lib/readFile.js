import { readFile } from 'fs';

function readFilePromisified(path) {
  return new Promise((resolve, reject) => {
    readFile(path, 'utf8', (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
}

export default readFilePromisified;
