const correctSQLDateTimeOffset = require('./correctSQLDateTimeOffset');

describe('correctSQLDateTimes', () => {
  it('corrects dates from sql queries', async () => {
    const jexDateFromDB = new Date('2019-01-22');
    expect(correctSQLDateTimeOffset(jexDateFromDB)).toEqual(new Date('2019-01-22T06:00:00.000Z'));
  });
});
