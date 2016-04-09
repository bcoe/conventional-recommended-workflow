# Standard Version

[![Build Status](https://travis-ci.org/conventional-changelog/standard-version.svg)](https://travis-ci.org/conventional-changelog/standard-version)
[![NPM version](https://img.shields.io/npm/v/standard-version.svg)](https://www.npmjs.com/package/standard-version)
[![Coverage Status](https://coveralls.io/repos/conventional-changelog/standard-version/badge.svg?branch=)](https://coveralls.io/r/conventional-changelog/standard-version?branch=master)
[![Standard Version](https://img.shields.io/badge/standard-version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

> stop using `npm version`, use `standard-version` it rocks!

Automatic release and CHANGELOG management, using GitHub's new squash button and
the workflow outlined in [conventional-changelog-standard](https://github.com/bcoe/conventional-changelog-standard/blob/master/convention.md).

_how it works:_

1. when you land commits on your `master` branch, select the _Squash and Merge_ option.
2. add a title and body that follows the [conventional-changelog-standard conventions](https://github.com/bcoe/conventional-changelog-standard/blob/master/convention.md).
3. when you're ready to release to npm:
  1. checkout `master`.
  2. run `standard-version`.
  3. `git push --tags; git push origin master; npm publish`.

`standard-version` does the following:

1. bumps the version in package.json (based on your commit history).
2. uses [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) to update _CHANGELOG.md._
3. commits _package.json_ and _CHANGELOG.md_.
4. tags a new release.

## Initial CHANGELOG.md Generation

When you're generating your changelog for the first time, simply do:

`standard-version --first-release`

## Installation

`npm i standard-version -g`

_Or, add it as a development dependency like so:_

`npm i standard-version --save-dev`

_And add this to your _package.json:_

```json
{
  "scripts": {
    "release": "standard-version"
  }
}
```

## Commit Message Convention, at a Glance

_patches:_

```sh
-m "fix(parsing): fixed a bug in our parser"
```

_features:_

```sh
git commit -a -m "feat(parser): we now have a parser \o/"
```

_breaking changes:_

```sh
git commit -a -m "feat(new-parser): introduces a new parsing library
BREAKING CHANGE: new library does not support foo-construct"
```

_other changes:_

You decide, e.g., docs, chore, etc.

```sh
git commit -a -m "docs: fixed up the docs a bit"
```

_but wait, there's more!_

Github usernames (`@bcoe`) and issue references (#133) will be swapped out for the
appropriate URLs in your CHANGELOG.

## Badges!

Tell your users that you adhere to the `standard-version` commit guidelines:

```markdown
[![Standard Version](https://img.shields.io/badge/standard-version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)
```

## License

ISC
