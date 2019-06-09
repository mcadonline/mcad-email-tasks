const getCourseId = require('./getCourseId');

describe('getCourseId', () => {
  it('gives a hyphenated course ID string given a course code, term, and year', () => {
    expect(
      getCourseId({
        courseCode: 'IDM  6610 20',
        term: 'SP',
        year: 2019,
      }),
    ).toBe('IDM-6610-20-SP19');
  });
});
