const task = require('./index');

describe('canvasOriention', () => {
  it('generates orientation emails', async () => {
    const emails = await task({ today: '2019-01-15' });
    expect(emails.length).toBe(75);

    const {
      to, from, subject, text,
    } = emails[0];
    expect(/online@mcad.edu/.test(from)).toBeTruthy();
    expect(/@/.test(to)).toBeTruthy();
    expect(subject).toBe('🐼 Using Canvas LMS for Senior Project: Graphic Design');
    // contains username
    expect(/Username: kaustin/.test(text)).toBeTruthy();
  });
});
