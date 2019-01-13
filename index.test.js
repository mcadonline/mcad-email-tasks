const huginn = require('./index');

describe('generates messages for postmarkClient consumption', () => {
  const data = [
    { name: 'Test 1', email: 'jjohnson136+test1@mcad.edu' },
    { name: 'Test 2', email: 'jjohnson136+test2@mcad.edu' },
  ];

  it('handles to template functions', () => {
    const to = ({ name, email }) => `${name} <${email}>`;
    const from = () => 'Me <jjohnson136@mcad.edu>';
    const subject = ({ name }) => `Hey ${name}!`;
    const body = ({ name }) => `
      <h1>Hey ${name}</h1>
    `;
    const expected = [
      {
        to: 'Test 1 <jjohnson136+test1@mcad.edu>',
        from: 'Me <jjohnson136@mcad.edu>',
        subject: 'Hey Test 1!',
        body: '<h1>Hey Test 1</h1>',
      },
      {
        to: 'Test 2 <jjohnson136+test2@mcad.edu>',
        from: 'Me <jjohnson136@mcad.edu>',
        subject: 'Hey Test 2!',
        body: '<h1>Hey Test 2</h1>',
      },
    ];

    expect(
      huginn({
        data,
        to,
        from,
        subject,
        body,
        send: false,
      }),
    ).toEqual(expected);
  });
});
