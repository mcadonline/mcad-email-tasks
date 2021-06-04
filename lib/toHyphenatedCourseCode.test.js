import toHyphenatedCourseCode from './toHyphenatedCourseCode.js';

describe('toHyphenatedCourseCode', () => {
  it('hyphenates a space-separated course code', () => {
    expect(toHyphenatedCourseCode('IDM  6610 20')).toBe('IDM-6610-20');
  });
});
