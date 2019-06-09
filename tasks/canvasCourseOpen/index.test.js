const task = require('./index');

describe('canvasCourseOpen', () => {
  it('generates course open emails', async () => {
    const emails = await task({ today: '2019-01-20' });
    expect(emails.length).toBe(31);

    const {
      to, from, subject, html,
    } = emails[0];
    expect(/online@mcad.edu/.test(from)).toBeTruthy();
    expect(/@/.test(to)).toBeTruthy();
    expect(subject).toBe('🚀 Get Started! User Experience Design is now OPEN!');
    expect(/Login to Canvas/.test(html)).toBeTruthy();
  });
});
