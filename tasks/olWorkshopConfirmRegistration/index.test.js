const jex = require('../../services/jex');
const task = require('./index');

describe('olWorkshopRegConfirm', () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => jex.close());

  it('generates an error if a record is missing MCAD email', async () => {
    jex.query = jest.fn().mockResolvedValue([
      {
        id: 1,
        username: 'user1',
        mcadEmail: null,
        personalEmail: '1@gmail.com',
      },
      {
        id: 2,
        username: 'user2',
        mcadEmail: 'user2@mcad.edu',
        personalEmail: '2@gmail.com',
      },
    ]);
    const { emails, errors } = await task({ today: '2019-01-22' });
    expect(emails.length).toBe(1);
    expect(errors).toMatchInlineSnapshot(`
      Array [
        "Error: Record does not have values in all required fields. Not generating email.
      Required Fields: [username, mcadEmail]
      Record: {
        \\"id\\": 1,
        \\"username\\": \\"user1\\",
        \\"mcadEmail\\": null,
        \\"personalEmail\\": \\"1@gmail.com\\"
      }",
      ]
    `);
  });

  it('generates an error if a record is missing username', async () => {
    jex.query = jest.fn().mockResolvedValue([
      {
        id: 1,
        username: null,
        mcadEmail: 'user1@mcad.edu',
        personalEmail: '1@gmail.com',
      },
      {
        id: 2,
        username: 'user2',
        mcadEmail: 'user2@mcad.edu',
        personalEmail: '2@gmail.com',
      },
    ]);
    const { emails, errors } = await task({ today: '2019-01-22' });
    expect(emails.length).toBe(1);
    expect(errors).toMatchInlineSnapshot(`
      Array [
        "Error: Record does not have values in all required fields. Not generating email.
      Required Fields: [username, mcadEmail]
      Record: {
        \\"id\\": 1,
        \\"username\\": null,
        \\"mcadEmail\\": \\"user1@mcad.edu\\",
        \\"personalEmail\\": \\"1@gmail.com\\"
      }",
      ]
    `);
  });
});
