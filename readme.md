# CodinGame Runner

A command-line program to run your JavaScript solutions locally, like on [CodinGame][cg] !

## Usage

    Usage: cg-runner [options] <challenge>

Give the name of a challenge (located into challenges folder), and it will
search for a sub-folder with that name containing a js file (same name) and
a collections of fixtures.

Each fixtures is separated in two file (with the same name): X.in and X.out.
Fixtures files are plain text files.

Example:

    + challenges
    |--+ genome-sequencing
       |-- genome-sequencing.js
       |-- AACTT.in
       |-- AACTT.out
       |-- AGATTACAGA.in
       |-- AGATTACAGA.out

Options:
  - `-h, --help` output usage information
  - `-V, --version` output the version number
  - `-f, --folder <folder>` specify challenges folder (default to 'challenges')
  - `-w, --watch` does not quit and run again when challenge file changes

If you want to skip some fixtures, give your `.in` file another extension.
If you want to test against only one fixture, use the `.in.only` extension.


## Limitations

As it's written in pure [Node.js][node], it only runs solutions written in JavaScript.
Be warned that it uses [Babel][babel] to compile from ES2015 to ES5, so you may accidentaly
use language features unsupported on CodinGame, which uses *only* [JavaScript 1.8.5][faq]

As well, it can't show you the beautiful CodinGame's animations and games.

[faq]: https://www.codingame.com/faq
[node]: https://nodejs.org
[cg]: https://www.codingame.com


## TODO
- use timeout for individual tests
- use timeout between outputs
- add tests
- use sourceMap to display runtime errors
