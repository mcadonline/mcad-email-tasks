const getCanvasCourseOpenRecords = require('./getCanvasCourseOpenRecords');

describe('getCanvasCourseOpenRecords', () => {
  it('gets orientation records', async () => {
    const records = await getCanvasCourseOpenRecords({ today: '2020-01-19' });
    expect(records.length).toBeGreaterThan(100);
    expect(records.length).toBeLessThan(300);
    const { courseCode, openDate } = records[0];
    expect(courseCode).toMatchInlineSnapshot(`"SD   6500 20"`);
    expect(openDate).toMatchInlineSnapshot(`"Sun, Jan 19, 2020"`);
  });
});
