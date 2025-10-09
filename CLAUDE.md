# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript library that normalizes French postal addresses by applying a series of abbreviation rules to reduce address length while preserving meaning. It's published as `@nivalis/normadresse` and is built with Bun.

## Development Commands

### Essential Commands
- `bun test` - Run the test suite using Bun's built-in test runner
- `bun lint` - Run ESLint to check code style and potential issues
- `bun lint:fix` - Automatically fix ESLint issues where possible
- `bun ts` - Run TypeScript compiler for type checking
- `bun build` - Build the distribution files using tsdown
- `bun prepack` - Prepare package for publishing (runs build)

### Package Manager
This project uses Bun (`bun@1.2.21`) as the package manager. All scripts should be run with `bun` rather than `npm` or `yarn`.

## Architecture and Structure

### Core Algorithm
The normalization process applies a sequential series of transformation steps defined in `normadresse.csv`:

1. **Step 1**: Road type abbreviations (BOULEVARD → BD, AVENUE → AV, etc.)
2. **Step 2**: Military, religious, and civil title abbreviations
3. **Step 3**: General abbreviations  
4. **Step 4**: Additional road type abbreviations
5. **Step 5**: First name abbreviations (except after SAINT)
6. **Step 6**: Saint/Sainte abbreviations and extended/inferior forms
7. **Step 7**: Road types at the beginning of addresses
8. **Step 8**: Particle replacement for proper nouns
9. **Step 9**: Uppercase article elimination
10. **Step 10**: Residual abbreviations (first letters of uppercase words)
11. **Step 11**: Lowercase article elimination

### Key Components

- **`index.ts`**: Main normalization logic with step-by-step functions
- **`normadresse.csv`**: CSV file containing abbreviation rules organized by steps
- **Caching**: Rules are compiled once and cached for performance
- **Early termination**: Process stops when target length is reached
- **selectShortWords()**: Smart word selection algorithm that progressively uses shorter forms

### Rule System
Rules are loaded from `normadresse.csv` and compiled into RegExp patterns. Step 1 uses regex patterns while other steps use simple string replacement. The CSV format:
- `etape`: Step number (1-11)
- `long`: Full form to match
- `court`: Abbreviated form to replace with
- `option`: Additional options (like `@` for special handling)

### Export API
- `normalize(input: string, maxLength?: number)`: Main function that normalizes an address
- `clearRulesCache()`: Utility to clear the internal rules cache
- Default max length is 32 characters

## Testing Strategy

Tests use Bun's test runner and cover:
- Standard normalization cases with expected outputs
- Edge cases (empty strings, very short/long addresses)
- Custom max length parameters
- Unicode handling (accents, special characters)
- Each normalization step functionality
- Performance with extremely long addresses

Run a single test file: `bun test index.spec.ts`

## Build and Distribution

- Uses `tsdown` for building ESM distribution files
- Outputs to `dist/` directory with `.js` and `.d.ts` files
- The `normadresse.csv` file is included in the distribution package
- Git hooks via `lefthook` ensure code quality (ESLint fix on pre-commit, commitlint on commit-msg)

## Code Quality Tools

- **ESLint**: Uses `@nivalis/eslint-config` for consistent code style
- **TypeScript**: Strict mode enabled with additional safety checks
- **Prettier**: Code formatting via `@nivalis/prettier-config`
- **Commitlint**: Enforces conventional commit messages
- **Lefthook**: Git hooks for automated quality checks