#!/usr/bin/env node
'use strict'

const program = require(`commander`)
const descriptor = require(`../package.json`)
const run = require(`./engine/runner`)

program.
  version(descriptor.version).
  description(`Runs your algorithms like on cofingame.com.

  Give the name of a challenge (located into challenges folder), and it will
  search for a sub-folder with that name containing a js file (same name) and
  a collections of fixtures.

  Each fixtures is separated in two file (with the same name): X.in and X.out.
  Fixtures files are plain text files.`).
  option(`-f, --folder <folder>`, `specify challenges folder (default to './challenges')`).
  option(`-w, --watch`, `does not quit and run again when challenge file changes`).
  arguments(`<challenge>`).
  action((challenge, opts) => run(challenge, opts))

program.parse(process.argv)
program._name = Object.keys(descriptor.bin)[0]

// displays help if nothing found
if (!program.args.length) {
  program.help()
}
