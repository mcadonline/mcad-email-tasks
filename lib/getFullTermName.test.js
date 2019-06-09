const getFullTermName = require('./getFullTermName');

describe('getFullTermName', () => {
  it('translates semesters into full name', () => {
    expect(getFullTermName('FA')).toBe('Fall');
    expect(getFullTermName('SP')).toBe('Spring');
    expect(getFullTermName('SU')).toBe('Summer');
    expect(getFullTermName('invalid')).toBe(null);
  });
});
