const sql = require('mssql');
const settings = require('../settings');
const cleanJexData = require('../lib/cleanJexData');

async function jexQuery(query) {
  const {
    username, password, server, database,
  } = settings.jex;
  const uri = `mssql://${username}:${password}@${server}/${database}`;
  try {
    const pool = await sql.connect(uri);
    const result = await pool.request().query(query);
    pool.close();
    return result.recordset.map(cleanJexData);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = {
  query: jexQuery,
};
