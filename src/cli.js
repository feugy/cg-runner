#!/usr/bin/env node
'use strict'

const program = require(`commander`)
const descriptor = require(`../package.json`)
const run = require(`./engine/runner`)
const monitorCtrlC = require(`monitorctrlc`)

monitorCtrlC(process.exit)

const parseString = str => str
const parseNumber = str => +str

program.
  version(descriptor.version).
  description(`Runs your algorithms like on cofingame.com.

  Give the name of a challenge (located into challenges folder), and it will
  search for a sub-folder with that name containing a js file (same name) and
  a collections of fixtures.

  Each fixtures is separated in two file (with the same name): X.in and X.out.
  Fixtures files are plain text files.

  Supported languages (and their file extensions) are:
  - JavaScript (.js)
  - Python (.py)
  `).
  option(`-f, --folder <folder>`, `specify challenges folder (default to './challenges')`, parseString, './challenges').
  option(`-l, --langage <langage>`, `langage of your solution (default to 'javascript')`, parseString, 'javascript').
  option(`-t, --timeout <timeout>`, `maximum timeout between each ouputs, in milliseconds (default to 300)`, parseNumber, 300).
  option(`-w, --watch`, `does not quit and run again when challenge file changes`).
  arguments(`<challenge>`).
  action((challenge, opts) => run(challenge, {
    watch: opts.watch,
    langage: opts.langage,
    timeout: opts.timeout,
    folder: opts.folder
  }).then(process.exit).catch(process.exit))

program.parse(process.argv)
program._name = Object.keys(descriptor.bin)[0]

// displays help if nothing found
if (!program.args.length) {
  program.help()
}
