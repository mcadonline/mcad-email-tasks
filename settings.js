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
  // online courses on Canvas
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
      sections: [
        'GWD  7410 20', // MAGWD / Web Design
        'CSDE 9478 20', // CE / Motion Illustration
        'GWD  7460 20', // MAGWD / UX Design
        'HS   5010 20', // LA / LA Adv Sem
        'GWD  6610 20', // MAGWD / Web Dev: HTML + CSS
        'IDM  6611 20', // Web Dev: HTML
        'IDM  6612 20', // Web Dev: CSS
        'IDM  6613 20', // Web Dev: Projects
        'SD   7010 20', // SD Practicum
        'SD   7021 20', // SD Thesis Project 1
        'SD   7022 20', // SD Thesis Project 2
        'CSDE 9305 20', // CE / Comic Art Crash Course
        'CSID 6631 20', // Web Dev: PHP and MySQL
        'HS   3317 20', // LA / Myth, Ritual, and Symbolism
        'SD   6510 20', // SD / Systems Thinking
        'VC   4207 20', // CE / Graphic Design Essentials
        'CSID 6632 20', // CE / Web Dev: Wordpress
        'CSMA 9342 20', // CE / Game Mechanics
      ],
    },
  ],
  // F2F courses using Canvas
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
