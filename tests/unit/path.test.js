import { describe, expect, it } from 'vitest';
import { withBase } from '../../src/lib/path.js';

describe('withBase', () => {
  it('adds the base prefix', () => {
    expect(withBase('/tr/exam', '/kpss-rehber')).toBe('/kpss-rehber/tr/exam');
  });
  it('normalizes leading and trailing slashes', () => {
    expect(withBase('exam', '/kpss-rehber/')).toBe('/kpss-rehber/exam');
  });
  it('works with a root base', () => {
    expect(withBase('/profile', '/')).toBe('/profile');
  });
});
