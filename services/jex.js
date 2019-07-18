const sql = require('mssql');
const settings = require('../settings');

// holds the connection pool
let pool = null;

function jexClose() {
  pool.close();
  pool = null;
}

async function jexQuery(query) {
  try {
    if (!pool) {
      pool = await sql.connect(settings.jex);
    }
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = {
  query: jexQuery,
  close: jexClose,
};
