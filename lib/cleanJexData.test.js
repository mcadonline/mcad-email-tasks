import cleanJexData from './cleanJexData.js';

describe('cleanJexData', () => {
  it('makes credits human readable', () => {
    expect(cleanJexData({ credits: 0 }).credits).toEqual('non-credit');
    expect(cleanJexData({ credits: 3 }).credits).toEqual('3 cr.');
  });
  it('includes courseId if code, term, and year exist', () => {
    const course = cleanJexData({
      courseCode: 'IDM  6610 20',
      term: 'SP',
      year: 2019,
    });
    expect(course.courseId).toEqual('IDM-6610-20-SP19');
  });
  it('includes a termCode', () => {
    const rawCourseData = {
      courseCode: 'IDM  6610 20',
      term: 'SP',
      year: 2019,
    };
    const course = cleanJexData(rawCourseData);

    expect(course.termCode).toBe('SP');
  });
  it('makes the term human readable', () => {
    expect(
      cleanJexData({
        term: 'SP',
      }).term,
    ).toBe('Spring');
    expect(
      cleanJexData({
        term: 'FA',
      }).term,
    ).toBe('Fall');
    expect(
      cleanJexData({
        term: 'SU',
      }).term,
    ).toBe('Summer');
    expect(
      cleanJexData({
        term: null,
      }).term,
    ).toBe(null);
  });
  it('uses preferred name as first name if it exists', () => {
    expect(
      cleanJexData({
        firstName: 'James',
        preferredName: null,
      }).firstName,
    ).toBe('James');
    expect(
      cleanJexData({
        firstName: 'James',
        preferredName: 'JJ',
      }).firstName,
    ).toBe('JJ');
  });
  it('makes startDate Pretty', () => {
    expect(
      cleanJexData({
        startDate: new Date('2019-06-03T06:00:00Z'),
      }).startDate,
    ).toBe('Mon, Jun 3, 2019');
  });
  it('makes endDate Pretty', () => {
    expect(
      cleanJexData({
        endDate: new Date('2019-06-03T06:00:00Z'),
      }).endDate,
    ).toBe('Mon, Jun 3, 2019');
  });
  it('gets the open date given the start date', () => {
    expect(
      cleanJexData({
        startDate: new Date('2019-06-03T06:00:00Z'),
      }).openDate,
    ).toBe('Sun, Jun 2, 2019');
  });
});
