const getCanvasOrientationRecords = require('./getCanvasOrientationRecords');

describe('getCanvasOrientationRecords', () => {
  it('gets orientation records', async () => {
    const records = await getCanvasOrientationRecords({ today: '2020-01-14' });
    const sdEnrollments = records.filter(
      enrollmentRecord => enrollmentRecord.courseCode === 'SD   6500 20',
    );
    expect(sdEnrollments.length).toBeGreaterThan(5);

    const firstEnrollment = sdEnrollments[0];
    expect(firstEnrollment.courseCode).toMatchInlineSnapshot('"SD   6500 20"');
    expect(firstEnrollment.startDate).toMatchInlineSnapshot(`"Tue, Jan 21, 2020"`);
  }, 15000);
});
