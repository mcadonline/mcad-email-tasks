const { DateTime } = require('luxon');

/**
 * Corrects DateTimes returned from Jenzabar.
 * That is, a jex stores a local date, but mssql
 * node returns a JS DateTime and iterprets the local date
 * as a UTC datetime.
 * SQL Server = '2019-06-06 00:00:00'
 * mssql.query = JS Date 2019-06-06T00:00:00Z
 * Note: This may be a temporary bug in node-mssql library
 * See: https://github.com/tediousjs/node-mssql/issues/509)
 *
 * @param sqlDateTime - local datetime returned from sql query
 * @returns {Date} - JS Date with corrected UTC datetime
 */

module.exports = function correctForJexDateOffset(localDateTime) {
  const dt = DateTime.fromJSDate(localDateTime, { zone: 'America/Chicago' });
  return dt.plus({ minutes: -1 * dt.offset }).toJSDate();
};
