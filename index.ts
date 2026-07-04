import { RULES_DATA } from './rules.ts';

const DEFAULT_MAX_LENGTH = 32;

const deburrMap = new Map<string, string>([
  ['Æ', 'Ae'],
  ['Ð', 'D'],
  ['Ø', 'O'],
  ['Þ', 'Th'],
  ['ß', 'ss'],
  ['æ', 'ae'],
  ['ð', 'd'],
  ['ø', 'o'],
  ['þ', 'th'],
  ['Đ', 'D'],
  ['đ', 'd'],
  ['Ħ', 'H'],
  ['ħ', 'h'],
  ['ı', 'i'],
  ['Ĳ', 'IJ'],
  ['ĳ', 'ij'],
  ['ĸ', 'k'],
  ['Ŀ', 'L'],
  ['ŀ', 'l'],
  ['Ł', 'L'],
  ['ł', 'l'],
  ['ŉ', "'n"],
  ['Ŋ', 'N'],
  ['ŋ', 'n'],
  ['Œ', 'Oe'],
  ['œ', 'oe'],
  ['Ŧ', 'T'],
  ['ŧ', 't'],
  ['ſ', 's'],
]);

/**
 * Converts a string by replacing special characters and diacritical marks with their ASCII equivalents.
 * For example, "Crème brûlée" becomes "Creme brulee".
 *
 * @param {string} str_ - The input string to be deburred.
 * @returns {string} - The deburred string with special characters replaced by their ASCII equivalents.
 *
 * @example
 * // Basic usage:
 * deburr('Æthelred') // returns 'Aethelred'
 *
 * @example
 * // Handling diacritical marks:
 * deburr('München') // returns 'Munchen'
 *
 * @example
 * // Special characters:
 * deburr('Crème brûlée') // returns 'Creme brulee'
 */
function deburr(str: string): string {
  const str_ = str.normalize('NFD');

  let result = '';

  for (const char of str_) {
    if (
      (char >= '\u0300' && char <= '\u036f') ||
      (char >= '\ufe20' && char <= '\ufe23')
    ) {
      continue;
    }

    result += deburrMap.get(char) ?? char;
  }

  return result;
}

type CompiledRule = {
  short: string;
  pattern: RegExp;
};

type RoadTypeRule = CompiledRule & {
  /** ` ${long.trim()} ` — mid-string match used by the step-5 second pass. */
  trimmedSpaced: RegExp;
};

type RoadTypeBisRule = {
  short: string;
  /** ` ${long.trim()} ` — mid-string match. */
  trimmedSpaced: RegExp;
  /** `^${long.trim()} ` — match at the beginning of the address. */
  startAnchored: RegExp;
};

type Rules = {
  /** Step 1 — `pattern` is the raw rule; replaces the first occurrence only. */
  roadTypes: Array<RoadTypeRule>;
  /** Step 2 — `pattern` is ` ${long} `. */
  titles: Array<CompiledRule>;
  /** Step 3 — `pattern` is `^(?:${long})$`, matched against whole words. */
  firstNames: Array<CompiledRule>;
  /** Step 4 — `pattern` is `(^| )${long} `. */
  general: Array<CompiledRule>;
  /** Step 5 — road type abbreviations. */
  roadTypesBis: Array<RoadTypeBisRule>;
  /** Step 6 — `pattern` is the raw rule. */
  saints: Array<CompiledRule>;
  /** Step 9 — `pattern` is the raw rule. */
  particles: Array<CompiledRule>;
};

const SPECIAL_CHARS_PATTERN = /[^A-Z0-9 ]/g;
const MULTIPLE_SPACES_PATTERN = /\s{2,}/g;
const UPPERCASE_ARTICLES_PATTERN =
  / (?:LE|LA|LES|AU|AUX|DE|DU|DES|[DAL]|ET|SUR|EN) /;
const LOWERCASE_ARTICLES_PATTERN =
  / (?:le|la|les|au|aux|de|du|des|[dal]|et|sur) /;

const RULES: Rules = (() => {
  const rules: Rules = {
    roadTypes: [],
    titles: [],
    firstNames: [],
    general: [],
    roadTypesBis: [],
    saints: [],
    particles: [],
  };

  for (const rule of RULES_DATA) {
    const step = Number.parseFloat(rule.etape);
    const { long } = rule;
    const short = rule.court.replaceAll(/\\g<(\d+)>/g, '$$$1');

    switch (step) {
      case 1: {
        rules.roadTypes.push({
          short,
          pattern: new RegExp(long),
          trimmedSpaced: new RegExp(` ${long.trim()} `),
        });
        break;
      }

      case 2: {
        rules.titles.push({ short, pattern: new RegExp(` ${long} `) });
        break;
      }

      case 3: {
        rules.firstNames.push({ short, pattern: new RegExp(`^(?:${long})$`) });
        break;
      }

      case 4: {
        rules.general.push({ short, pattern: new RegExp(`(^| )${long} `) });
        break;
      }

      case 5: {
        rules.roadTypesBis.push({
          short,
          trimmedSpaced: new RegExp(` ${long.trim()} `),
          startAnchored: new RegExp(`^${long.trim()} `),
        });
        break;
      }

      case 6: {
        rules.saints.push({ short, pattern: new RegExp(long) });
        break;
      }

      case 9: {
        rules.particles.push({ short, pattern: new RegExp(long) });
        break;
      }

      default: {
        // Steps 0, 1.5 and 7 exist in the data but are never applied.
        break;
      }
    }
  }

  return rules;
})();

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
        // biome-ignore lint/style/noNonNullAssertion: checked earlier
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
  let output = currentOutput;

  for (const rule of RULES.roadTypes) {
    output = output.replace(rule.pattern, rule.short);
  }

  return selectShortWords(currentInput, output, maxLength);
};

const applyTitleAbbreviations = (
  currentInput: string,
  currentOutput: string,
  maxLength: number,
): string => {
  let output = currentOutput;

  // 2 - abréviation des titres militaires, religieux et civils
  for (let step = 0; step < 2; step++) {
    for (const rule of RULES.titles) {
      output = output.replace(rule.pattern, ` ${rule.short} `);
    }
  }

  return selectShortWords(currentInput, output, maxLength);
};

const applyGeneralAbbreviations = (
  currentInput: string,
  currentOutput: string,
  maxLength: number,
): string => {
  let output = currentOutput;

  // 4 - abréviations générales
  for (let step = 0; step < 3; step++) {
    for (const rule of RULES.general) {
      output = output
        .replace(rule.pattern, ` ${rule.short.toLowerCase()} `)
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
  let output = currentOutput;

  // 5 - abréviation type de voies
  for (let step = 0; step < 2; step++) {
    for (const rule of RULES.roadTypesBis) {
      output = output.replace(
        rule.trimmedSpaced,
        ` ${rule.short.trim().toLowerCase()} `,
      );
    }

    for (const rule of RULES.roadTypes) {
      output = output.replace(
        rule.trimmedSpaced,
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
  let output = currentOutput;

  // 3 - abréviations prénoms sauf pour ST prénoms
  const words = output.split(' ');

  for (let i = 1; i < words.length - 1; i++) {
    const word = words[i];

    if (!words[i - 1]?.startsWith('SAINT')) {
      for (const rule of RULES.firstNames) {
        // biome-ignore lint/style/noNonNullAssertion: checked earlier
        if (rule.pattern.test(word!)) {
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
  let output = currentOutput;

  // 6 - abréviation saint/sainte et prolonge(e)/inférieur(e)
  for (let step = 0; step < 2; step++) {
    for (const rule of RULES.saints) {
      output = output.replace(rule.pattern, rule.short.toLowerCase());
    }
  }

  return selectShortWords(currentInput, output, maxLength);
};

const applyRoadTypeBeginning = (
  currentInput: string,
  currentOutput: string,
  maxLength: number,
): string => {
  let output = currentOutput;

  // 5bis - type de voie en début...
  for (const rule of RULES.roadTypesBis) {
    output = output.replace(
      rule.startAnchored,
      `${rule.short.trim().toLowerCase()} `,
    );
  }

  return selectShortWords(currentInput, output, maxLength);
};

const applyParticleReplacement = (currentOutput: string): string => {
  let output = currentOutput;

  // 9 - remplacement des particules des noms propres pour ne pas les supprimer
  for (const rule of RULES.particles) {
    output = output.replace(rule.pattern, rule.short);
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
      word &&
      word === word.toUpperCase() &&
      word.length > 1 &&
      // biome-ignore lint/style/noNonNullAssertion: can't be null
      word.codePointAt(0)! >= 'A'.codePointAt(0)!
    ) {
      // biome-ignore lint/style/noNonNullAssertion: number of chars is greater than 1
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

/**
 * The selectShortWords-based abbreviation steps, in the order applied by
 * upstream etalab/normadresse (steps 1, 2, 4, 5, 3, 6, 5bis).
 */
const ABBREVIATION_STEPS = [
  applyRoadTypeAbbreviations, // 1
  applyTitleAbbreviations, // 2
  applyGeneralAbbreviations, // 4
  applyRoadTypeAbbreviationsBis, // 5
  applyFirstNameAbbreviations, // 3
  applySaintAbbreviations, // 6
  applyRoadTypeBeginning, // 5bis
] as const;

const normalizer = (
  originalInput: string,
  maxLength = DEFAULT_MAX_LENGTH,
): string => {
  const input = preprocessInput(originalInput);
  let output = input;

  if (output.length <= maxLength) {
    return output;
  }

  let currentInput = input;

  for (const step of ABBREVIATION_STEPS) {
    output = step(currentInput, output, maxLength);

    if (output.length <= maxLength) {
      return output;
    }

    // 5bis diffs against the same "long" input as step 6: the input is not
    // advanced between applySaintAbbreviations and applyRoadTypeBeginning.
    if (step !== applySaintAbbreviations) {
      currentInput = output;
    }
  }

  // 9 - particle replacement (no length check)
  output = applyParticleReplacement(output);

  // 10 - remove uppercase articles
  output = removeUppercaseArticles(output, maxLength);

  if (output.length <= maxLength) {
    return output;
  }

  // 11 - residual abbreviations
  output = applyResidualAbbreviations(output, maxLength);

  if (output.length <= maxLength) {
    return output;
  }

  // 12 - remove lowercase articles
  return removeLowercaseArticles(output, maxLength);
};

export const normalize = (
  input: string,
  maxLength = DEFAULT_MAX_LENGTH,
): string => {
  return normalizer(input, maxLength).toUpperCase();
};
