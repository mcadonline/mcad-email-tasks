import toPrettyDate from './toPrettyDate.js';

describe('toPrettyDate', () => {
  it('returns a pretty date', () => {
    const date = new Date('2019-01-01T06:00:00Z');
    expect(toPrettyDate(date)).toBe('Tue, Jan 1, 2019');
  });
});
