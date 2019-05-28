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
  canvasCourses: [
    {
      term: 'SP',
      year: 2019,
      sections: [
        'SD   6750 20',
        'GWD  7460 20',
        'HS   5010 20',
        '2D   3206 20',
        'ILL  2000 01',
        'GRD  5100 01',
        'AH   2103 01',
      ],
    },
    {
      term: 'SU',
      year: 2019,
      sections: ['HS   5010 20', 'GWD  7800 20'],
    },
    {
      term: 'FA',
      year: 2019,
      sections: ['GWD  7410 20', 'CSDE 9478 20', 'GWD  7460 20', 'HS   5010 20'],
    },
  ],
};
