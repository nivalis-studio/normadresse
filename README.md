# @nivalis/normadresse

> French Postal Addresses Normalizer

[![npm version](https://badgen.net/npm/v/@nivalis/normadresse)](https://www.npmjs.com/package/@nivalis/normadresse)
[![dependencies Status](https://img.shields.io/librariesio/release/npm/%40nivalis%2Fnormadresse)](https://img.shields.io/librariesio/release/npm/%40nivalis%2Fnormadresse)

`@nivalis/normadresse` is a zero-dependency TypeScript implementation of the
normalization rules published by the French Base Adresse Nationale (BAN).
It uses the same rules and dataset as Etalab's `normadresse`, and its output
matches the BAN `nom_afnor` column except for two deliberate differences (see
[Differences from BAN output](#differences-from-ban-output)). Use it to predict
how an address will be shortened before printing envelopes, creating database
keys, or comparing postal data.

## Why this package?

- Battle-tested dataset: rules are ported from the official Etalab
  `normadresse` distribution.
- Deterministic, locale-aware output (diacritics removed, particles handled,
  saints abbreviated, etc.).
- Works in both Node.js and modern bundlers without native dependencies.
- Configurable output length (default 32 characters) to fit legacy systems.

## Installation

```bash
pnpm add @nivalis/normadresse
# or
npm install @nivalis/normadresse
# or
yarn add @nivalis/normadresse
```

## Quick start

```ts
import { normalize } from '@nivalis/normadresse';

const raw = 'Boulevard du Marechal Jean Marie de Lattre de Tassigny';
const normalized = normalize(raw);

console.log(normalized);
// -> BD MAL J M DE LATTRE DE TASSIGNY
```

Need to squeeze the output even more? Pass a custom `maxLength` (in characters):

```ts
normalize(raw, 24);
// -> BD MAL J M L DE TASSIGNY
```

The function always returns an uppercase string so that you can safely compare
normalized addresses.

## API

### `normalize(input: string, maxLength = 32): string`

- `input` – any raw address line; accents, punctuation, and casing do not
  matter.
- `maxLength` – target maximum length, defaulting to 32 characters (best
  effort, see below).

Returns the normalized uppercase address. When the input already fits in the
requested length, the string is merely sanitized (trimmed, deduplicated spaces,
and diacritics removed).

`maxLength` is a target, not a guarantee. When the rules run out before the
address fits, the result is returned anyway and can be longer than `maxLength`:

```ts
normalize('BOULEVARD DU MARECHAL JEAN MARIE DE LATTRE DE TASSIGNY', 20);
// -> BD MAL J M L TASSIGNY (21 characters)
```

A single word longer than `maxLength` is returned unchanged.

## Normalization pipeline

The implementation follows the historical Etalab steps:

1. Pre-processing: remove diacritics, uppercase the string, drop punctuation,
   and collapse repeated spaces.
2. Apply a sequence of replacements (road types, honorific titles, general
   abbreviations, prenoms, saint/sainte, etc.) while progressively checking the
   string length.
3. Handle tricky cases such as particles (`de`, `du`, `des`), `Saint` → `St`,
   or repeated articles that should disappear only when necessary.
4. Finish by applying residual abbreviations and article removals until the
   desired length is reached or no change is possible.

Because every step is deterministic, running the function twice with the same
input (even across platforms) always yields the same output.

## Differences from BAN output

The upstream [`js-normadresse`](https://github.com/BaseAdresseNationale/js-normadresse)
reproduces the BAN `nom_afnor` column exactly. This package deliberately
differs from it in two ways:

1. **Whitespace is cleaned up before the length check.** The input is trimmed
   and runs of spaces are collapsed. BAN keeps the double or trailing spaces
   left where punctuation was removed, and those spaces count toward the
   length, so BAN sometimes abbreviates a name that already fits here.
2. **First names are matched as whole words only.** Upstream also matches a
   first name inside a longer word (`IRENE` contains `RENE`).

| Input | BAN `nom_afnor` | `@nivalis/normadresse` |
| --- | --- | --- |
| `Lotissement d'Aurumy II (à nommer)` | `LOT D AURUMY II A NOMMER` | `LOTISSEMENT D AURUMY II A NOMMER` |
| `Rue Irène et Frédéric Joliot Curie` | `RUE R ET FREDERIC JOLIOT CURIE` | `RUE I ET FREDERIC JOLIOT CURIE` |

On 157,338 distinct street names from 9 departments (BAN extracts of
2026-11-10), the output differs from `nom_afnor` for 629 names (0.4%), and 597
of those differ only in whitespace. When comparing with BAN data, trim the BAN
value and collapse its runs of spaces first.

The known differences are pinned in
[`fixtures/ban-known-divergences.json`](./fixtures/ban-known-divergences.json)
and checked by [`conformance.spec.ts`](./conformance.spec.ts).

## Data source & contributions

The rules live in [`rules.ts`](./rules.ts) and originate from Etalab's
[`normadresse`](https://github.com/etalab/normadresse) project as well as the
[`js-normadresse`](https://github.com/BaseAdresseNationale/js-normadresse)
port. If you notice a discrepancy with the official BAN output that is not
listed in [Differences from BAN output](#differences-from-ban-output), please
open a pull request adding a failing test to `index.spec.ts` and, if possible,
a reference to the authoritative rule.

## Development

```bash
pnpm install       # install dependencies
pnpm test          # run the Bun-powered test suite
pnpm lint          # biome static analysis
pnpm build         # compile TypeScript via zshy
```

## See also

- [`js-normadresse`](https://github.com/BaseAdresseNationale/js-normadresse): Original js version
- [`normadresse`](https://github.com/etalab/normadresse): Original Python version
- [`go-normadresse`](https://github.com/united-drivers/go-normadresse): Golang port

## License

MIT
