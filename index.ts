/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import path from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { parse } from 'csv-parse/sync';
import { deburr } from 'es-toolkit/string';

const DEFAULT_MAX_LENGTH = 32;

type CsvRule = {
  etape: string;
  long: string;
  court: string;
  option: string;
};
type CompiledRule = {
  long: string;
  short: string;
  pattern?: RegExp;
};

type Rules = {
  [key: number]: CompiledRule[];
};

let cachedRules: Rules | null = null;

const SPECIAL_CHARS_PATTERN = /[^A-Z0-9 ]/g;
const MULTIPLE_SPACES_PATTERN = /\s{2,}/g;
const UPPERCASE_ARTICLES_PATTERN =
  / (?:LE|LA|LES|AU|AUX|DE|DU|DES|[DAL]|ET|SUR|EN) /;
const LOWERCASE_ARTICLES_PATTERN =
  / (?:le|la|les|au|aux|de|du|des|[dal]|et|sur) /;

const findCsvFile = (): string => {
  const possiblePaths = ['../normadresse.csv', './normadresse.csv'];

  for (const relativePath of possiblePaths) {
    const fullPath = path.join(import.meta.dir, relativePath);

    if (existsSync(fullPath)) return fullPath;
  }

  throw new Error(
    `CSV file not found. Tried paths: ${possiblePaths.join(', ')}`,
  );
};

const compileRules = (): Rules => {
  if (cachedRules) return cachedRules;

  const csvContent = readFileSync(findCsvFile(), 'utf8');
  const parsed = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as CsvRule[];

  const rules = parsed.reduce<Rules>((acc: Rules, rule: CsvRule) => {
    const step = Number.parseFloat(rule.etape);
    const newRules = acc;

    newRules[step] ??= [];

    let pattern: RegExp | undefined;

    if (step === 1) {
      try {
        pattern = new RegExp(rule.long, 'g');
      } catch {
        // Fallback for invalid regex patterns
        pattern = new RegExp(
          rule.long.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'g',
        );
      }
    }

    newRules[step].push({
      long: rule.long,
      short: rule.court.replaceAll(/\\g<(\d+)>/g, '$$$1'),
      pattern,
    });

    return newRules;
  }, {});

  cachedRules = rules;

  return rules;
};

const selectShortWords = (
  input: string,
  output: string,
  maxLength: number,
): string => {
  const long = input.split(' ');
  const short = output.split(' ');

  for (let i = short.length - 1; i >= 0; i--) {
    if (short[i] === '@') {
      if (i > 0) {
        long[i - 1] = short[i - 1]!;
      }

      long.splice(i, 1);
      short.splice(i, 1);
    }
  }

  let next = '';

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
};

const preprocessInput = (originalInput: string): string => {
  return deburr(originalInput)
    .toUpperCase()
    .replaceAll(SPECIAL_CHARS_PATTERN, ' ')
    .replaceAll(MULTIPLE_SPACES_PATTERN, ' ')
    .trim();
};

const applyRoadTypeAbbreviations = (
  currentInput: string,
  currentOutput: string,
  maxLength: number,
): string => {
  const rules = compileRules();
  let output = currentOutput;

  for (const rule of rules[1] ?? []) {
    if (rule.pattern) {
      output = output.replace(rule.pattern, rule.short);
    } else {
      output = output.replace(new RegExp(rule.long), rule.short);
    }
  }

  return selectShortWords(currentInput, output, maxLength);
};

const applyTitleAbbreviations = (
  currentInput: string,
  currentOutput: string,
  maxLength: number,
): string => {
  const rules = compileRules();
  let output = currentOutput;

  // 2 - abréviation des titres militaires, religieux et civils
  for (let step = 0; step < 2; step++) {
    for (const rule of rules[2] ?? []) {
      output = output.replace(new RegExp(` ${rule.long} `), ` ${rule.short} `);
    }
  }

  return selectShortWords(currentInput, output, maxLength);
};

const applyGeneralAbbreviations = (
  currentInput: string,
  currentOutput: string,
  maxLength: number,
): string => {
  const rules = compileRules();
  let output = currentOutput;

  // 4 - abréviations générales
  for (let step = 0; step < 3; step++) {
    for (const rule of rules[4] ?? []) {
      output = output
        .replace(
          new RegExp(`(^| )${rule.long} `),
          ` ${rule.short.toLowerCase()} `,
        )
        .trim();
    }
  }

  return selectShortWords(currentInput, output, maxLength);
};

const applyRoadTypeAbbreviationsBis = (
  currentInput: string,
  currentOutput: string,
  maxLength: number,
): string => {
  const rules = compileRules();
  let output = currentOutput;

  // 5 - abréviation type de voies
  for (let step = 0; step < 2; step++) {
    for (const rule of rules[5] ?? []) {
      output = output.replace(
        new RegExp(` ${rule.long.trim()} `),
        ` ${rule.short.trim().toLowerCase()} `,
      );
    }

    for (const rule of rules[1] ?? []) {
      output = output.replace(
        new RegExp(` ${rule.long.trim()} `),
        ` ${rule.short.trim().toLowerCase()} `,
      );
    }
  }

  return selectShortWords(currentInput, output, maxLength);
};

const applyFirstNameAbbreviations = (
  currentInput: string,
  currentOutput: string,
  maxLength: number,
): string => {
  const rules = compileRules();
  let output = currentOutput;

  // 3 - abréviations prénoms sauf pour ST prénoms
  const words = output.split(' ');

  for (let i = 1; i < words.length - 1; i++) {
    const word = words[i];

    if (!words[i - 1]!.startsWith('SAINT')) {
      for (const rule of rules[3] ?? []) {
        if (new RegExp(rule.long).test(word!)) {
          words[i] = rule.short.toLowerCase();
        }
      }
    }

    output = words.join(' ');
  }

  return selectShortWords(currentInput, output, maxLength);
};

const applySaintAbbreviations = (
  currentInput: string,
  currentOutput: string,
  maxLength: number,
): string => {
  const rules = compileRules();
  let output = currentOutput;

  // 6 - abréviation saint/sainte et prolonge(e)/inférieur(e)
  for (let step = 0; step < 2; step++) {
    for (const rule of rules[6] ?? []) {
      output = output.replace(new RegExp(rule.long), rule.short.toLowerCase());
    }
  }

  return selectShortWords(currentInput, output, maxLength);
};

const applyRoadTypeBeginning = (
  currentInput: string,
  currentOutput: string,
  maxLength: number,
): string => {
  const rules = compileRules();
  let output = currentOutput;

  // 5bis - type de voie en début...
  for (const rule of rules[5] ?? []) {
    output = output.replace(
      new RegExp(`^${rule.long.trim()} `),
      `${rule.short.trim().toLowerCase()} `,
    );
  }

  return selectShortWords(currentInput, output, maxLength);
};

const applyParticleReplacement = (currentOutput: string): string => {
  const rules = compileRules();
  let output = currentOutput;

  // 9 - remplacement des particules des noms propres pour ne pas les supprimer
  for (const rule of rules[9] ?? []) {
    output = output.replace(new RegExp(rule.long), rule.short);
  }

  return output;
};

const removeUppercaseArticles = (
  currentOutput: string,
  maxLength: number,
): string => {
  let output = currentOutput;

  // 10 - élimination des articles
  for (let step = 0; step < 6; step++) {
    output = output.replace(UPPERCASE_ARTICLES_PATTERN, ' ');

    if (output.length <= maxLength) {
      return output;
    }
  }

  return output;
};

const applyResidualAbbreviations = (
  currentOutput: string,
  maxLength: number,
): string => {
  let output = currentOutput;

  // 11 - abréviations résiduelle
  const words = output.split(' ');

  for (let i = 1; i < words.length - 1; ++i) {
    const word = words[i];

    if (
      word === word!.toUpperCase() &&
      word.length > 1 &&
      word.codePointAt(0)! >= 'A'.codePointAt(0)!
    ) {
      words[i] = word[0]!;

      output = words.join(' ');

      if (output.length <= maxLength) {
        return output;
      }
    }
  }

  return output;
};

const removeLowercaseArticles = (
  currentOutput: string,
  maxLength: number,
): string => {
  let output = currentOutput;

  // 12 - élimination des articles
  for (let step = 0; step < 4; step++) {
    output = output.replace(LOWERCASE_ARTICLES_PATTERN, ' ');

    if (output.length <= maxLength) {
      return output;
    }
  }

  return output;
};

const applyInitialSteps = (
  input: string,
  maxLength: number,
): { output: string; currentInput: string } => {
  let output = input;
  let currentInput = input;

  // Step 1: Road type abbreviations
  output = applyRoadTypeAbbreviations(currentInput, output, maxLength);

  if (output.length <= maxLength) {
    return { output, currentInput };
  }

  currentInput = output;

  // Step 2: Title abbreviations
  output = applyTitleAbbreviations(currentInput, output, maxLength);

  if (output.length <= maxLength) {
    return { output, currentInput };
  }

  currentInput = output;

  // Step 3: General abbreviations
  output = applyGeneralAbbreviations(currentInput, output, maxLength);

  if (output.length <= maxLength) {
    return { output, currentInput };
  }

  currentInput = output;

  return { output, currentInput };
};

const applyMiddleSteps = (
  input: string,
  currentInput: string,
  maxLength: number,
): { output: string; currentInput: string } => {
  let output = input;
  let updatedInput = currentInput;

  // Step 4: Road type abbreviations bis
  output = applyRoadTypeAbbreviationsBis(updatedInput, output, maxLength);

  if (output.length <= maxLength) {
    return { output, currentInput: updatedInput };
  }

  updatedInput = output;

  // Step 5: First name abbreviations
  output = applyFirstNameAbbreviations(updatedInput, output, maxLength);

  if (output.length <= maxLength) {
    return { output, currentInput: updatedInput };
  }

  updatedInput = output;

  // Step 6: Saint abbreviations
  output = applySaintAbbreviations(updatedInput, output, maxLength);

  if (output.length <= maxLength) {
    return { output, currentInput: updatedInput };
  }

  return { output, currentInput: updatedInput };
};

const applyFinalSteps = (
  output: string,
  currentInput: string,
  maxLength: number,
): string => {
  let result = output;

  // Step 7: Road type at beginning
  result = applyRoadTypeBeginning(currentInput, result, maxLength);

  if (result.length <= maxLength) {
    return result;
  }

  // Step 8: Particle replacement
  result = applyParticleReplacement(result);

  // Step 9: Remove uppercase articles
  result = removeUppercaseArticles(result, maxLength);

  if (result.length <= maxLength) {
    return result;
  }

  // Step 10: Residual abbreviations
  result = applyResidualAbbreviations(result, maxLength);

  if (result.length <= maxLength) {
    return result;
  }

  // Step 11: Remove lowercase articles
  result = removeLowercaseArticles(result, maxLength);

  return result;
};

const normalizer = (
  originalInput: string,
  maxLength = DEFAULT_MAX_LENGTH,
): string => {
  const input = preprocessInput(originalInput);
  const output = input;

  if (output.length <= maxLength) {
    return output;
  }

  const initialResult = applyInitialSteps(output, maxLength);

  if (initialResult.output.length <= maxLength) {
    return initialResult.output;
  }

  const middleResult = applyMiddleSteps(
    initialResult.output,
    initialResult.currentInput,
    maxLength,
  );

  if (middleResult.output.length <= maxLength) {
    return middleResult.output;
  }

  return applyFinalSteps(
    middleResult.output,
    middleResult.currentInput,
    maxLength,
  );
};

export const normalize = (
  input: string,
  maxLength = DEFAULT_MAX_LENGTH,
): string => {
  return normalizer(input, maxLength).toUpperCase();
};

export const clearRulesCache = (): void => {
  cachedRules = null;
};
