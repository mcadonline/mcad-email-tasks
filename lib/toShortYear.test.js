import toShortYear from './toShortYear.js';

describe('toShortYear', () => {
  it('returns a 2-digit version of the year', () => {
    expect(toShortYear(2019)).toBe('19');
    expect(toShortYear('2019')).toBe('19');
  });
});
