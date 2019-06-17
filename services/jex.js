const sql = require('mssql');
const R = require('ramda');
const correctSQLDateTimeOffset = require('../lib/correctSQLDateTimeOffset');
const settings = require('../settings');

const fixDatesInRecord = record => R.map((val) => {
  if (val instanceof Date) return correctSQLDateTimeOffset(val);
  return val;
}, record);

// holds the connection pool
let pool = null;

function jexClose() {
  pool.close();
  pool = null;
}

async function jexQuery(query) {
  const {
    username, password, server, database,
  } = settings.jex;
  const uri = `mssql://${username}:${password}@${server}/${database}`;
  try {
    if (!pool) {
      pool = await sql.connect(uri);
    }
    const result = await pool.request().query(query);
    const fixedRecords = result.recordset.map(fixDatesInRecord);
    return fixedRecords;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = {
  query: jexQuery,
  close: jexClose,
};
