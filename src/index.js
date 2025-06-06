/* eslint-disable sonarjs/no-dead-store */
/* eslint-disable unicorn/prefer-code-point */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable logical-assignment-operators */
/* eslint-disable complexity */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-statements */
/* eslint-disable func-style */
/* eslint-disable unicorn/prefer-string-replace-all */
/* eslint-disable unicorn/prefer-number-properties */

import path from 'node:path';
import { readFileSync } from 'node:fs';
import { parse } from 'csv-parse/sync';
import { deburr } from 'es-toolkit/string';

const DEFAULT_MAX_LENGTH = 32;

const rules = parse(
  readFileSync(path.join(import.meta.dir, 'normadresse.csv')),
  {
    columns: true,
  },
).reduce((rules, rule) => {
  const step = parseFloat(rule.etape, 10);

  rules[step] = rules[step] || [];

  rules[step].push({
    long: rule.long,
    short: rule.court.replace(/\\g<(\d+)>/g, '$$$1'),
  });

  return rules;
}, {});

function selectShortWords(input, output, maxLength) {
  const long = input.split(' ');
  const short = output.split(' ');

  for (let i = short.length - 1; i >= 0; i--) {
    if (short[i] === '@') {
      long[i - 1] = short[i - 1];
      delete long[i];
      delete short[i];
    }
  }

  let next;

  for (let i = 1; i < short.length; ++i) {
    next = [
      ...short.slice(0, i).filter(Boolean),
      ...long.slice(i).filter(Boolean),
    ].join(' ');

    if (next.length <= maxLength) {
      break;
    }
  }

  return next;
}

function normalize_(input, maxLength = DEFAULT_MAX_LENGTH) {
  input = deburr(input)
    .toUpperCase()
    .replace(/[^A-Z0-9s]/g, ' ')
    .replace(/ {2}/g, ' ');

  let output = input;

  if (output.length <= maxLength) {
    return output;
  }

  // 1 - abréviation du type de voie
  for (const rule of rules[1]) {
    output = output.replace(new RegExp(rule.long), rule.short);
  }

  output = selectShortWords(input, output, maxLength);

  if (output.length <= maxLength) {
    return output;
  }

  input = output;

  // 2 - abréviation des titres militaires, religieux et civils
  for (let step = 0; step < 2; step++) {
    for (const rule of rules[2]) {
      output = output.replace(new RegExp(` ${rule.long} `), ` ${rule.short} `);
    }
  }

  output = selectShortWords(input, output, maxLength);

  if (output.length <= maxLength) {
    return output;
  }

  input = output;

  // 4 - abréviations générales
  for (let step = 0; step < 3; step++) {
    for (const rule of rules[4]) {
      output = output
        .replace(
          new RegExp(`(^| )${rule.long} `),
          ` ${rule.short.toLowerCase()} `,
        )
        .trim();
    }
  }

  output = selectShortWords(input, output, maxLength);

  if (output.length <= maxLength) {
    return output;
  }

  input = output;

  // 5 - abréviation type de voies
  for (let step = 0; step < 2; step++) {
    for (const rule of rules[5]) {
      output = output.replace(
        new RegExp(` ${rule.long.trim()} `),
        ` ${rule.short.trim().toLowerCase()} `,
      );
    }

    for (const rule of rules[1]) {
      output = output.replace(
        new RegExp(` ${rule.long.trim()} `),
        ` ${rule.short.trim().toLowerCase()} `,
      );
    }
  }

  output = selectShortWords(input, output, maxLength);

  if (output.length <= maxLength) {
    return output;
  }

  input = output;

  // 3 - abréviations prénoms sauf pour ST prénoms
  let words = output.split(' ');

  for (let i = 1; i < words.length - 1; i++) {
    const word = words[i];

    if (words[i - 1].slice(0, 5) !== 'SAINT') {
      for (const rule of rules[3]) {
        if (new RegExp(`${rule.long}`).test(word)) {
          words[i] = rule.short.toLowerCase();
        }
      }
    }

    output = words.join(' ');
  }

  output = selectShortWords(input, output, maxLength);

  if (output.length <= maxLength) {
    return output;
  }

  input = output;

  // 6 - abréviation saint/sainte et prolonge(e)/inférieur(e)
  for (let step = 0; step < 2; step++) {
    for (const rule of rules[6]) {
      output = output.replace(new RegExp(rule.long), rule.short.toLowerCase());
    }
  }

  output = selectShortWords(input, output, maxLength);

  if (output.length <= maxLength) {
    return output;
  }

  input = output;

  // 5bis - type de voie en début...
  for (const rule of rules[5]) {
    output = output.replace(
      new RegExp(`^${rule.long.trim()} `),
      `${rule.short.trim().toLowerCase()} `,
    );
  }

  output = selectShortWords(input, output, maxLength);

  if (output.length <= maxLength) {
    return output;
  }

  input = output;

  // 9 - remplacement des particules des noms propres pour ne pas les supprimer
  for (const rule of rules[9]) {
    output = output.replace(new RegExp(rule.long), rule.short);
  }

  // 10 - élimination des articles
  for (let step = 0; step < 6; step++) {
    output = output.replace(
      / (LE|LA|LES|AU|AUX|DE|DU|DES|[DAL]|ET|SUR|EN) /,
      ' ',
    );

    if (output.length <= maxLength) {
      return output;
    }
  }

  // 11 - abréviations résiduelle
  words = output.split(' ');

  for (let i = 1; i < words.length - 1; ++i) {
    const word = words[i];

    if (
      word === word.toUpperCase() &&
      word.length > 1 &&
      word.charCodeAt(0) >= 'A'.charCodeAt(0)
    ) {
      words[i] = word[0];

      output = words.join(' ');

      if (output.length <= maxLength) {
        return output;
      }
    }
  }

  // 12 - élimination des articles
  for (let step = 0; step < 4; step++) {
    output = output.replace(/ (le|la|les|au|aux|de|du|des|[dal]|et|sur) /, ' ');

    if (output.length <= maxLength) {
      return output;
    }
  }

  return output;
}

export function normalize(input, maxLength = DEFAULT_MAX_LENGTH) {
  return normalize_(input, maxLength).toUpperCase();
}
