const jex = require('../../services/jex');
const task = require('./index');

describe('canvasCourseOpen', () => {
  afterEach(() => jex.close());
  it('generates course open emails', async () => {
    const { emails, errors } = await task({ today: '2019-01-20' });
    expect(emails.length).toBeGreaterThan(100);
    expect(emails.length).toBeLessThan(300);

    expect(errors).toEqual([]);

    const { to, from, subject, html } = emails[0];
    expect(/online@mcad.edu/.test(from)).toBeTruthy();
    expect(/@/.test(to)).toBeTruthy();
    expect(subject).toMatch(/🚀 Get Started! .* is now OPEN!/);
    expect(/Login to Canvas/.test(html)).toBeTruthy();
  }, 10000);
});
