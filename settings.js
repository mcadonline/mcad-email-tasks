import path from 'path';
import dotenv from 'dotenv';

// path relative to __dirname
const pathname = path.resolve('./.env');

dotenv.config({
  path: pathname,
});

const settings = {
  postmark: {
    apiKey: process.env.postmark_api_key,
  },
  mandril: {
    apiKey: process.env.mandril_api_key,
  },
  jex: {
    user: process.env.jex_username,
    password: process.env.jex_password,
    server: process.env.jex_server,
    database: process.env.jex_database,
    options: {
      useUTC: false,
      enableArithAbort: true,
      encrypt: true,
      trustServerCertificate: true,
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
  salesforce: {
    email: process.env.salesforce_email,
  },
  mailClient: process.env.mail_client,
};

export default settings;
