# @nivalis/normadresse

> French Postal Addresses Normalizer

[![npm version](https://badgen.net/npm/v/@nivalis/normadresse)](https://www.npmjs.com/package/@nivalis/normadresse)
[![dependencies Status](https://img.shields.io/librariesio/release/npm/%40nivalis%2Fnormadresse)](https://img.shields.io/librariesio/release/npm/%40nivalis%2Fnormadresse)

`@nivalis/normadresse` is a zero-dependency TypeScript implementation of the
normalization rules published by the French Base Adresse Nationale (BAN).
It replicates the historical Etalab/La Poste behavior so that you can predict
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
// -> BD MAL J M DE LATTRE
```

The function always returns an uppercase string so that you can safely compare
normalized addresses.

## API

### `normalize(input: string, maxLength = 32): string`

- `input` – any raw address line; accents, punctuation, and casing do not
  matter.
- `maxLength` – desired maximum length, defaulting to 32 characters.

Returns the normalized uppercase address. When the input already fits in the
requested length, the string is merely sanitized (trimmed, deduplicated spaces,
and diacritics removed).

### `clearRulesCache(): void`

The rule set is compiled once and cached. Call `clearRulesCache()` in test suites
when you need to isolate scenarios that alter the global state (for instance
when spying on `RegExp` creation).

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

## Data source & contributions

The rules live in [`index.ts`](./index.ts) and originate from Etalab's
[`normadresse`](https://github.com/etalab/normadresse) project as well as the
[`js-normadresse`](https://github.com/BaseAdresseNationale/js-normadresse)
port. If you notice a discrepancy with the official BAN output, please open an
issue with a failing example and, if possible, a reference to the authoritative
rule.

## Development

```bash
pnpm install       # install dependencies
pnpm test          # run the Bun-powered test suite
pnpm lint          # biome static analysis
pnpm build         # compile TypeScript via tsdown
```

## See also

- [`js-normadresse`](https://github.com/BaseAdresseNationale/js-normadresse): Original js version
- [`normadresse`](https://github.com/etalab/normadresse): Original Python version
- [`go-normadresse`](https://github.com/united-drivers/go-normadresse): Golang port

## License

MIT
