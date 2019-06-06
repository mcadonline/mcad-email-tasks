const getSundayBefore = require('./getSundayBefore');

describe('getSundayBefore', () => {
  it('gets sunday before a given date', () => {
    expect(getSundayBefore(new Date('2019-07-01 00:00:00 CST'))).toEqual(
      new Date('2019-06-30 00:00:00 CST'),
    );
    expect(getSundayBefore(new Date('2019-01-01 00:00:00 CST'))).toEqual(
      new Date('2018-12-30 00:00:00 CST'),
    );
  });
});
