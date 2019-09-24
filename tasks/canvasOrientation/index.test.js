const task = require('./index');

describe('canvasOriention', () => {
  it('generates orientation emails', async () => {
    const { emails, errors } = await task({ today: '2019-01-15' });
    expect(emails.length).toBeGreaterThan(10);
    expect(errors).toEqual([]);

    const {
      to, from, subject, text,
    } = emails[0];
    expect(/online@mcad.edu/.test(from)).toBeTruthy();
    expect(/@/.test(to)).toBeTruthy();
    expect(subject).toMatch('🐼 Using Canvas LMS for');
    // contains username
    expect(/Username: [a-z0-9-]+/.test(text)).toBeTruthy();
  });
});
