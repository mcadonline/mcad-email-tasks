const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, './.env'),
});

module.exports = {
  postmark: {
    apiKey: process.env.postmark_api_key,
  },
  jex: {
    username: process.env.jex_username,
    password: process.env.jex_password,
    server: process.env.jex_server,
    database: process.env.jex_database,
  },
  ldap: {
    url: process.env.ldap_url,
    base: process.env.ldap_base,
    dn: process.env.ldap_dn,
    password: process.env.ldap_password,
  },
  log: {
    to: process.env.log_to,
    from: process.env.log_from,
  },
};
