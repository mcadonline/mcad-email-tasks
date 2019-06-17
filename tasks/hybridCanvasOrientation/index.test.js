const task = require('./index');

describe('hybridCanvasOrientation', () => {
  it('generates papercut emails', async () => {
    const { emails, errors } = await task({ today: '2019-07-23' });
    expect(emails.length).toBeTruthy();
    expect(errors).toEqual([]);

    const {
      to, from, subject, text,
    } = emails[0];
    expect(/continuing_education@mcad.edu/.test(from)).toBeTruthy();
    expect(/@/.test(to)).toBeTruthy();
    expect(subject).toBe(
      '✏️ Walking as Artistic Practice begins soon! Setup your MCAD Account now.',
    );

    expect(text).toMatch(/Username [a-z0-9_]+/i);
    expect(text).toMatch(/Student ID# [0-9]+/i);
  });
});
