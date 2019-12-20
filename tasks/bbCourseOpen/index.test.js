const task = require('./index');

describe('bbCourseOpen', () => {
  // pinning test. 4 course open emails should
  // be generated for IDM-6613-20 (Fall 2017)
  it('generates course open emails for students who have added before start date', async () => {
    const { emails, errors } = await task({ today: '2020-01-19' });
    expect(emails.length).toBeGreaterThan(20);
    expect(errors).toEqual([]);
  });
});
