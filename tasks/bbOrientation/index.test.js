const task = require('./index');

describe('bbOrientation task', () => {
  it('generates emails 1 week before start date', async () => {
    // pinning test
    // If today were 1 week before Summer 2018 starts,
    // 52 students would receive notifications
    const { emails, errors } = await task({ today: '2020-01-14' });
    expect(emails.length).toBeGreaterThan(20);
    expect(errors).toEqual([]);
  });
});
