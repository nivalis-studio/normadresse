# @nivalis/normadresse

> French Postal Addresses Normalizer

[![npm version](https://badgen.net/npm/v/@nivalis/normadresse)](https://www.npmjs.com/package/@nivalis/normadresse)
[![dependencies Status](https://badgen.net/david/dep/nivalis/js-normadresse)](https://david-dm.org/nivalis/js-normadresse)
[![codecov](https://badgen.net/codecov/c/github/nivalis/js-normadresse)](https://codecov.io/gh/nivalis/js-normadresse)
[![XO code style](https://badgen.net/badge/code%20style/XO/cyan)](https://github.com/xojs/xo)

## Getting started

```bash
$ yarn add @nivalis/normadresse
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
