const generateEmails = require('./generateEmails');
// const jex = require('../services/jex');

// jest.mock(jex);

const validRecords = [
  {
    id: 1,
    firstName: 'Elaine',
    preferredName: null,
    lastName: 'Benes',
    term: 'FA',
    courseCode: 'GWD  6610 20',
    year: '2019',
    courseName: 'Web Development',
    startDate: new Date('2019-08-26'),
    endDate: new Date('2019-12-13'),
    username: 'ebenes',
    mcadEmail: 'ebenes@mcad.edu',
    personalEmail: 'me@ebenes.com',
  },
  {
    id: 2,
    firstName: 'Art',
    preferredName: null,
    lastName: 'Vandalay',
    term: 'FA',
    courseCode: 'GWD  6610 20',
    year: '2019',
    courseName: 'Web Development',
    startDate: new Date('2019-08-26'),
    endDate: new Date('2019-12-13'),
    username: 'avandelay',
    mcadEmail: 'avandelay@mcad.edu',
    personalEmail: 'art@vandelayindustries.com',
  },
];

const invalidRecords = [
  {
    id: 3,
    firstName: 'Jerry',
    preferredName: null,
    lastName: 'Seinfeld',
    term: 'FA',
    courseCode: 'GWD  6610 20',
    year: '2019',
    courseName: 'Web Development',
    startDate: new Date('2019-08-26'),
    endDate: new Date('2019-12-13'),
    username: null, // no username listed
    mcadEmail: 'avandelay@mcad.edu',
    personalEmail: 'art@vandelayindustries.com',
  },
  {
    id: 3,
    firstName: 'Cosmo',
    preferredName: 'Kramer',
    lastName: 'Kramer',
    term: 'FA',
    courseCode: 'GWD  6610 20',
    year: '2019',
    courseName: 'Web Development',
    startDate: new Date('2019-08-26'),
    endDate: new Date('2019-12-13'),
    // missing username and emails
    username: null,
    mcadEmail: null,
    personalEmail: null,
  },
];

describe('generateEmails', () => {
  it('generates a list of emails from a template, given a list of records', async () => {
    // jex.query.mockResolvedValue(validRecords);
    const { emails, errors } = await generateEmails({
      template: 'cePapercut',
      records: validRecords,
      to: ({
        firstName, lastName, personalEmail, mcadEmail,
      }) => [
        `${firstName} ${lastName} <${personalEmail}>`,
        `${firstName} ${lastName} <${mcadEmail}>`,
      ].join(', '),
      from: () => 'test@test.com',
      bcc: () => 'test@test.com',
      requiredFields: ['username', 'personalEmail'],
    });

    expect(emails.length).toBe(2);
    expect(errors.length).toBe(0);
    const ebenesEmail = emails[0];
    expect(ebenesEmail.to).toBe('Elaine Benes <me@ebenes.com>, Elaine Benes <ebenes@mcad.edu>');
    expect(ebenesEmail.from).toBe('test@test.com');
    expect(ebenesEmail.bcc).toBe('test@test.com');
    expect(ebenesEmail.subject).toBeTruthy();
    expect(ebenesEmail.html).toBeTruthy();
    expect(ebenesEmail.text).toBeTruthy();
  });
  it('handles and empty array of data', async () => {
    const { emails, errors } = await generateEmails({
      template: 'cePapercut',
      records: [],
      to: ({
        firstName, lastName, personalEmail, mcadEmail,
      }) => [
        `${firstName} ${lastName} <${personalEmail}>`,
        `${firstName} ${lastName} <${mcadEmail}>`,
      ].join(', '),
      from: () => 'test@test.com',
      bcc: () => 'test@test.com',
      requiredFields: ['username', 'personalEmail'],
    });

    expect(emails.length).toBe(0);
    expect(errors.length).toBe(0);
  });
  it('returns an error if records do not contain required fields', async () => {
    const { emails, errors } = await generateEmails({
      template: 'cePapercut',
      records: validRecords.concat(invalidRecords),
      to: ({
        firstName, lastName, personalEmail, mcadEmail,
      }) => [
        `${firstName} ${lastName} <${personalEmail}>`,
        `${firstName} ${lastName} <${mcadEmail}>`,
      ].join(', '),
      from: () => 'test@test.com',
      bcc: () => 'test@test.com',
      requiredFields: ['username', 'personalEmail'],
    });

    expect(emails.length).toBe(2);
    expect(errors.length).toBe(2);
  });
});
