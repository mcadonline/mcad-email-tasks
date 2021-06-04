import task from './index.js';
import jex from '../../services/jex.js';

describe('cePapercut', () => {
  afterEach(() => {
    jex.close();
  });

  it('generates papercut emails', async () => {
    const { emails, errors } = await task({ today: '2019-03-21' });
    expect(emails.length).toBe(8);
    expect(errors).toEqual([]);

    const { to, from, subject, text } = emails[0];
    expect(/continuing_education@mcad.edu/.test(from)).toBeTruthy();
    expect(/@/.test(to)).toBeTruthy();
    expect(subject).toBe(
      '✏️ Advanced Typography Bootcamp begins soon! Setup your MCAD Account now.',
    );
    // contains username
    expect(/Username dmarkworth/.test(text)).toBeTruthy();
  });
  it('does not include hybridCanvas courses', async () => {
    // TODO: Improve Test
    // Walking as Artistic Practice is a Hybrid
    const { emails, errors } = await task({ today: '2019-07-23' });
    // expect that no emails contain 'CSLA-4004-01'
    const doesNotContainWalkingCourse = emails.every(({ text }) => !/CSLA-4004-01/.test(text));
    expect(doesNotContainWalkingCourse).toBeTruthy();
    expect(errors.length).toBe(0);
  });
});
