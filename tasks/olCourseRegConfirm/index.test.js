const task = require('./index');

describe('olCourseRegConfirm', () => {
  it('generates registration confirmation emails', async () => {
    const emails = await task({ today: '2019-01-22' });
    expect(emails.length).toBe(2);

    const {
      to, from, subject, text,
    } = emails[0];
    expect(/online@mcad.edu/.test(from)).toBeTruthy();
    expect(/@/.test(to)).toBeTruthy();
    expect(subject).toBe("👍 You're Registered for: Current Events");

    // contains username
    expect(/Current Events/.test(text)).toBeTruthy();
  });
});
