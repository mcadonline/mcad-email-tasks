const getBbOrientationRecords = require('./getBbOrientationRecords');

describe('getBbCourseOpenRecords', () => {
  it('gets orientation records', async () => {
    const records = await getBbOrientationRecords({ today: '2020-01-14' });
    expect(records.length).toBeGreaterThan(10);
    expect(records.length).toBeLessThan(100);
    const { courseCode, openDate } = records[0];
    expect(courseCode).toMatchInlineSnapshot(`"CSSD 5900 20"`);
    expect(openDate).toMatchInlineSnapshot(`"Sun, Jan 19, 2020"`);
  });
});
