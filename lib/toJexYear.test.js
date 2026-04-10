import toJexYear from './toJexYear.js';

describe('toJexYear', () => {
  it('uses the calendar year for FA and ST', () => {
    expect(toJexYear({ term: 'FA', realYear: 2026 })).toBe(2026);
    expect(toJexYear({ term: 'ST', realYear: 2026 })).toBe(2026);
  });

  it('uses the prior academic year for non-FA/ST terms', () => {
    expect(toJexYear({ term: 'SP', realYear: 2026 })).toBe(2025);
  });
});
