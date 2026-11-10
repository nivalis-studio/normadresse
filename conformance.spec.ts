/**
 * Conformance against the official Base Adresse Nationale (BAN) output.
 *
 * Oracle: the `nom_afnor` column of the BAN address exports is produced by
 * the upstream js-normadresse (github.com/BaseAdresseNationale/js-normadresse),
 * which reproduces it exactly. `fixtures/ban-sample.json` holds 390
 * deterministic `[nom_voie, nom_afnor]` pairs sampled from 157,338 distinct
 * street names of departments 48, 75, 2A, 13, 59, 33, 69, 974 and 29.
 *
 * This port deviates from BAN on purpose in two ways:
 * 1. Whitespace: `preprocessInput` trims and collapses repeated spaces, while
 *    BAN keeps the double and trailing spaces left by removed punctuation.
 *    BAN values are therefore compared with whitespace collapsed. Because the
 *    collapsed string is shorter, it can also change whether a name exceeds
 *    the 32-character limit and so how it is shortened.
 * 2. First names (commit 378473d): first-name rules match whole words only,
 *    where upstream matches substrings (BAN turns IRENE into R because it
 *    contains RENE; this port turns it into I).
 * Every sample pair whose output differs from the collapsed BAN value for one
 * of these reasons is listed, with this port's output, in
 * `fixtures/ban-known-divergences.json`. Any other difference is a regression.
 *
 * Data source: Base Adresse Nationale, https://adresse.data.gouv.fr,
 * published under the Licence Ouverte / Open Licence 2.0 (Etalab).
 */
import { describe, expect, it } from 'bun:test';
import knownDivergences from './fixtures/ban-known-divergences.json' with {
  type: 'json',
};
import banSample from './fixtures/ban-sample.json' with { type: 'json' };
import { normalize } from './index.js';

type Pair = [input: string, output: string];

const SAMPLE = banSample as Array<Pair>;
const DIVERGENCES = new Map(knownDivergences as Array<Pair>);

const collapseWhitespace = (value: string): string =>
  value.replaceAll(/\s+/g, ' ').trim();

describe('BAN conformance', () => {
  it('should match BAN nom_afnor for every sampled street name', () => {
    const mismatches: Array<{
      input: string;
      expected: string;
      actual: string;
    }> = [];

    for (const [input, banOutput] of SAMPLE) {
      const expected = DIVERGENCES.get(input) ?? collapseWhitespace(banOutput);
      const actual = normalize(input);

      if (actual !== expected) {
        mismatches.push({ input, expected, actual });
      }
    }

    expect(SAMPLE.length).toBe(390);
    expect(mismatches).toEqual([]);
  });

  it('should only list known divergences that still differ from BAN', () => {
    const banByInput = new Map(SAMPLE);
    const stale: Array<string> = [];

    for (const [input, portOutput] of DIVERGENCES) {
      const banOutput = banByInput.get(input);

      if (
        banOutput === undefined ||
        collapseWhitespace(banOutput) === portOutput
      ) {
        stale.push(input);
      }
    }

    expect(DIVERGENCES.size).toBe(32);
    expect(stale).toEqual([]);
  });
});
