const task = require('./index');

describe('canvasOrientation', () => {
  it('generates orientation emails', async () => {
    const { emails, errors } = await task({ today: '2020-01-14' });
    expect(emails.length).toBeGreaterThan(100);
    expect(emails.length).toBeLessThan(200);

    expect(errors).toEqual([]);

    const { to, from, subject, text } = emails[0];
    expect(/online@mcad.edu/.test(from)).toBeTruthy();
    expect(/@/.test(to)).toBeTruthy();
    expect(subject).toMatch('🎒 Get Ready!');
    // contains username
    expect(/USERNAME: [a-z0-9-]+/.test(text)).toBeTruthy();
  }, 15000);
});
