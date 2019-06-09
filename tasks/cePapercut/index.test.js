const task = require('./index');

describe('cePapercut', () => {
  it('generates papercut emails', async () => {
    const emails = await task({ today: '2019-03-21' });
    expect(emails.length).toBe(8);

    const {
      to, from, subject, text,
    } = emails[0];
    expect(/continuing_education@mcad.edu/.test(from)).toBeTruthy();
    expect(/@/.test(to)).toBeTruthy();
    expect(subject).toBe(
      '✏️ Advanced Typography Bootcamp begins soon! Setup your MCAD Account now.',
    );
    // contains username
    expect(/ Username dmarkworth/.test(text)).toBeTruthy();
  });
});
