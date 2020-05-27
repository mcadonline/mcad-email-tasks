const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, './.env'),
});

module.exports = {
  postmark: {
    apiKey: process.env.postmark_api_key,
  },
  jex: {
    user: process.env.jex_username,
    password: process.env.jex_password,
    server: process.env.jex_server,
    database: process.env.jex_database,
    options: {
      useUTC: false,
    },
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
  excludeCoursesFromCanvasEmails: [
    {
      term: 'SP',
      year: 2020,
      sections: [
        '2D   3297 20', // Experience Anatomy
        'CSSD 5900 20', // ISSP Prep Course
        'HS   3920 20', // Creative Writing
      ],
    },
  ],

  // CE F2F courses using Canvas
  // These students will be emailed about setting up their MCAD
  // account and going through the Canvas Orientation.
  // These courses will be _excluded_ from the CE Papercut course emails.
  // e.g. Ellen Mueller's Walking course
  hybridCanvasCourses: [
    {
      term: 'SU',
      year: 2019,
      sections: ['CSLA 4004 01'],
    },
  ],
};
