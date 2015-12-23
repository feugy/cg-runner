'use strict'

const chalk = require(`chalk`)

const setupIO = (input, out, expect) => {
  let inputIdx = 0
  let expectIdx = 0

  global.readline = () => input[inputIdx++]

  global.print = function() {
    let args = []
    for (let i = 0; i < arguments.length; i++) {
      args[i] = arguments[i]
    }

    // validates output
    let err
    let actual = args.join(` `)
    let expected = expect[expectIdx++]
    if (actual !== expected) {
      err = new Error(`Unexpected output:
  ${chalk.green(`expected: ` + expected)}
  ${chalk.red(`  actual: ` + actual)}
      `)
    }

    out.push({args, err})

    // interrupt execution at end
    if (expectIdx == expect.length) {
      throw new Error('eof')
    }
  }

  global.printErr = function() {
    let args = []
    for (let i = 0; i < arguments.length; i++) {
      args[i] = arguments[i]
    }
    out.push({args, debug: true})
  }
}

module.exports = setupIO;
