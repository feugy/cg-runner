# CodinGame Runner

A command-line program to run your solutions locally, like on [CodinGame][cg] !


## Installation

`cg-runner` is a [node.js][node] application, so you'll need to install `node`
(and `npm` which is a separated package on linux distributions) to run it.

Once you got them, open a terminal, and install it (only once, need network access):

> npm install -g cg-runner

Then, use `cg-runner` command from your terminal.


## Usage

    Usage: cg-runner [options] <challenge>

Runs your algorithms like on cofingame.com.

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

Supported languages (and their file extensions) are:
  - JavaScript (.js)
  - Python (.py)

Options:

  - `-h, --help`               output usage information
  - `-V, --version`            output the version number
  - `-f, --folder <folder>`    specify challenges folder (default to './challenges')
  - `-l, --langage <langage>`  langage of your solution (default to 'javascript')
  - `-t, --timeout <timeout>`  maximum timeout between each ouputs, in milliseconds (default to 300)
  - `-w, --watch`              does not quit and run again when challenge file changes

If you want to skip some fixtures, give your `.in` file another extension.
If you want to test against only one fixture, use the `.in.only` extension.

The watch mode will ease your development, and you can now plug external debuging programs
to your running algorithm.


## Engines

Try to stick as much as possible to [CodingGame][faq] versions and library.
It will ease copy-pasting from and to the online IDE.

### JavaScript (.js extension)
To run JavaScript, you need to download the [proper build][spidermonkey] of SpiderMonkey, Mozilla's JS engine.

Choose the `jsshell-XXX.zip` file of your platform, and unzip it into the `js-engine` folder of cg-runner.

### Python (.py extension)
You need to have an accessible `python` command on your environment.
Goes to [Pyhton][python] download page, and follow instructions relative to your operating system.


## Limitations and adaptations

Obviously, you can't simulate complex challenges like bots with a bunch of static input files.
And you won't see beautiful CodinGame's animations.
Take it as a simple way to debug locally your solutions on specific cases.

If the challenge contains a game loop, you need to reflect "turns" in your `.in` and `.out` fixtures
by adding a blank line (no tabs, no space) between intput/output of different turns.

A practical example for a challenge expecting 2 inputs at each turns:

    2
    10 41

    2
    10 40

    2
    9 40

Cg-runner launches your algorithm in a separated process,
using the relevant runtime (JavaScript, Phython, Java...).

As on CodinGame, it awaits on standard output stream, and consider standard error stream as debug information.

But the both streams are not synchronized, and you may received debug data mixed with output: order within each
streams is garantee, but not across them.


## TODO
- add tests
- support java, scala...

[faq]: https://www.codingame.com/faq
[node]: https://nodejs.org
[cg]: https://www.codingame.com
[spidermonkey]: https://ftp.mozilla.org/pub/firefox/nightly/latest-mozilla-central/
[python]: https://www.python.org/downloads/