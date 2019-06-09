const toHyphenatedCourseCode = require('./toHyphenatedCourseCode');

describe('toHyphenatedCourseCode', () => {
  it('hyphenates a space-separated course code', () => {
    expect(toHyphenatedCourseCode('IDM  6610 20')).toBe('IDM-6610-20');
  });
});
