# Stylelint-browserify

[![npm version](https://badge.fury.io/js/@bhsd%2Fstylelint-browserify.svg)](https://www.npmjs.com/package/@bhsd/stylelint-browserify)
[![License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](LICENSE)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/144196256274430b871abc36e9aa7d86)](https://app.codacy.com/gh/bhsd-harry/stylelint-browserify/dashboard)

# API

The `stylelint` global variable has a `lint()` method.

```js
const result = await stylelint.lint(options);
```

## Options

### `config`

A [configuration object](https://stylelint.io/user-guide/configure).

### `code`

A string to lint.

## The returned promise

`stylelint.lint()` returns a `Promise` that resolves with an object containing the following properties:

### `code`

A string that contains the autofixed code, if the `fix` option is set to `true`. Otherwise, it is `undefined`.

### `errored`

Boolean. If `true`, at least one rule with an "error"-level severity registered a problem.

### `report`

A JSON string that contains the formatted problems.

### `results`

An array containing all the Stylelint result objects (the objects that formatters consume).

### Edit info

When the [`computeEditInfo` option](https://stylelint.io/user-guide/options#computeeditinfo) is enabled, a warning may include a `fix` property that provides information about suggested fixes:

- `range` (`[number, number]`) - the pair of 0-based indices in source code text to remove
- `text` (`string`) - the text to add

For example, to change `a { opacity: 10%; }` to `a { opacity: 0.1; }`, the `EditInfo` might look like:

```jsonc
{
  // "line", "column", "rule", ...
  "fix": {
    "range": [13, 16], // Indices of "10%"
    "text": "0.1" // Replacement text
  }
}
```

Only a single `EditInfo` will be recorded for a specific region in source code. If multiple report ranges overlap, only the first will contain `EditInfo`.

## Syntax errors

`stylelint.lint()` does not reject the `Promise` when your CSS contains syntax errors.
It resolves with an object (see [the returned promise](#the-returned-promise)) that contains information about the syntax error.
