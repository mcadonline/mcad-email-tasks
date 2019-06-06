const getDirectories = require('./getDirectories');

describe('getDirectories', () => {
  it('gets a list of directories in a given path', async () => {
    const dirs = await getDirectories(process.cwd());
    expect(dirs).toContain('lib');
    expect(dirs).toContain('services');
  });
});
