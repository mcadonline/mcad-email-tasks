const getCanvasOrientationRecords = require('./getCanvasOrientationRecords');

describe('getCanvasOrientationRecords', () => {
  it('gets orientation records', async () => {
    const records = await getCanvasOrientationRecords({ today: '2020-01-14' });
    expect(records.length).toBeGreaterThan(100);
    expect(records.length).toBeLessThan(300);
    const { courseCode, startDate } = records[0];
    expect(courseCode).toMatchInlineSnapshot(`"SD   6500 20"`);
    expect(startDate).toMatchInlineSnapshot(`"Tue, Jan 21, 2020"`);
  }, 15000);
});
