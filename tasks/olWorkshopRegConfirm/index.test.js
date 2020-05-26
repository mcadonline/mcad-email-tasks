const jex = require('../../services/jex');
const task = require('./index');

describe('olWorkshopRegConfirm', () => {
  beforeEach(() => jest.clearAllMocks());

  it.todo('generates workshop confirmation emails');

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
