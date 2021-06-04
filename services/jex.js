import mssql from 'mssql';
import settings from '../settings.js';

// holds the connection pool
let pool = null;

function jexClose() {
  if (!pool) return;
  pool.close();
  pool = null;
}

async function jexQuery(query) {
  try {
    if (!pool) {
      pool = await mssql.connect(settings.jex);
    }
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default {
  query: jexQuery,
  close: jexClose,
};
