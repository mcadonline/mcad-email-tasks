const task = require('./index');

describe('bbCourseOpen', () => {
  // pinning test. 4 course open emails should
  // be generated for IDM-6613-20 (Fall 2017)
  it('generates course open emails for students who have added before start date', async () => {
    const { emails, errors } = await task({ today: '2017-11-05' });
    expect(emails.length).toBe(4);
    expect(errors).toEqual([]);
  });
});
