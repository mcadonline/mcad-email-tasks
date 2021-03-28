const jex = require('../../services/jex');
const task = require('./index');

describe('olCourseRegConfirm', () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => jex.close());

  it('generates registration confirmation emails', async () => {
    const { emails, errors } = await task({ today: '2019-01-22' });
    expect(emails.length).toBe(2);
    expect(errors).toEqual([]);

    const { to, from, subject, text } = emails[0];
    expect(/online@mcad.edu/.test(from)).toBeTruthy();
    expect(/@/.test(to)).toBeTruthy();
    expect(subject).toBe("👍 You're Registered for: Current Events");

    // contains username
    expect(/Current Events/.test(text)).toBeTruthy();
  });

  it('generates an error if a record is missing personal email', async () => {
    jex.query = jest.fn().mockResolvedValue([
      {
        id: 1,
        personalEmail: null,
      },
      {
        id: 2,
        personalEmail: 'test@test.com',
      },
    ]);
    const { emails, errors } = await task({ today: '2019-01-22' });
    expect(emails.length).toBe(1);
    expect(errors).toMatchInlineSnapshot(`
      Array [
        "Error: Record does not have values in all required fields. Not generating email.
      Required Fields: [personalEmail]
      Record: {
        \\"id\\": 1,
        \\"personalEmail\\": null
      }",
      ]
    `);
  });
});
