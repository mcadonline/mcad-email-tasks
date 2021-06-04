import { promisify } from 'util';
import { readdir, stat } from 'fs';
import { join } from 'path';

const readdirAsync = promisify(readdir);
const statAsync = promisify(stat);

async function getDirectories(path) {
  const dirContents = await readdirAsync(path);

  return dirContents.filter(async (file) => {
    const fileStat = await statAsync(join(path, file));
    return fileStat.isDirectory();
  });
}

export default getDirectories;
