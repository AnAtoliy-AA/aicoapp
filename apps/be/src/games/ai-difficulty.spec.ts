import {
  AI_DIFFICULTIES,
  DEFAULT_AI_DIFFICULTY,
  isAiDifficulty,
} from './ai-difficulty';

describe('ai-difficulty', () => {
  it('exposes nine difficulty tiers', () => {
    expect(AI_DIFFICULTIES).toEqual([
      'beginner',
      'easy',
      'intermediate',
      'medium',
      'advanced',
      'strong',
      'hard',
      'master',
      'expert',
    ]);
  });

  it('defaults to medium', () => {
    expect(DEFAULT_AI_DIFFICULTY).toBe('medium');
  });

  it.each([
    'beginner',
    'easy',
    'intermediate',
    'medium',
    'advanced',
    'strong',
    'hard',
    'master',
    'expert',
  ])('accepts %s as a valid difficulty', (d) => {
    expect(isAiDifficulty(d)).toBe(true);
  });

  it.each([undefined, null, '', 'impossible', 3, {}])(
    'rejects %p as a difficulty',
    (d) => {
      expect(isAiDifficulty(d)).toBe(false);
    },
  );
});
