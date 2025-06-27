# @nivalis/normadresse

> French Postal Addresses Normalizer

[![npm version](https://badgen.net/npm/v/@nivalis/normadresse)](https://www.npmjs.com/package/@nivalis/normadresse)
[![dependencies Status](https://img.shields.io/librariesio/release/npm/%40nivalis%2Fnormadresse)](https://img.shields.io/librariesio/release/npm/%40nivalis%2Fnormadresse)

## Getting started

```bash
$ npm install @nivalis/normadresse
```

## API

This library exposes a `normalize` method:

```js
import { normalize } from '@nivalis/normadresse'

console.log(normalize('BOULEVARD DU MARECHAL JEAN MARIE DE LATTRE DE TASSIGNY'))
// Output: BD MAL J M DE LATTRE DE TASSIGNY
```

## See also

- [`js-normadresse`](https://github.com/BaseAdresseNationale/js-normadresse): Original js version
- [`normadresse`](https://github.com/etalab/normadresse): Original Python version
- [`go-normadresse`](https://github.com/united-drivers/go-normadresse): Golang port

## License

MIT
