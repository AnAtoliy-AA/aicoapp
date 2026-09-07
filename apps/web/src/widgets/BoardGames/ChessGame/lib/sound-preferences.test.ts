import { describe, it, expect } from 'vitest';
import { SOUND_PACK_OPTIONS } from './sound-preferences';

describe('SOUND_PACK_OPTIONS', () => {
  it('has 4 options', () => {
    expect(SOUND_PACK_OPTIONS).toHaveLength(4);
  });

  it('contains classic, arcade, minimal, off', () => {
    const ids = SOUND_PACK_OPTIONS.map((p) => p.id);
    expect(ids).toContain('classic');
    expect(ids).toContain('arcade');
    expect(ids).toContain('minimal');
    expect(ids).toContain('off');
  });

  it('all options have name and description', () => {
    for (const opt of SOUND_PACK_OPTIONS) {
      expect(opt.name.length).toBeGreaterThan(0);
      expect(opt.description.length).toBeGreaterThan(0);
    }
  });
});
