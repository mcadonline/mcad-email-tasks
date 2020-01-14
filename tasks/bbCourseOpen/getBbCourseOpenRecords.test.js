const getBbCourseOpenRecords = require('./getBbCourseOpenRecords');

describe('getBbCourseOpenRecords', () => {
  it('gets orientation records', async () => {
    const records = await getBbCourseOpenRecords({ today: '2020-01-19' });
    expect(records.length).toBeGreaterThan(10);
    expect(records.length).toBeLessThan(100);
    const { courseCode, openDate } = records[0];
    expect(courseCode).toMatchInlineSnapshot(`"CSSD 5900 20"`);
    expect(openDate).toMatchInlineSnapshot(`"Sun, Jan 19, 2020"`);
  });
});
