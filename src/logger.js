'use strict'

const chalk = require(`chalk`)
const moment = require(`moment`)

const levels = {
  runner: `gray`,
  out: `green`,
  debug: `magenta`,
  error: `red`
}

const paddLength = Object.keys(levels).reduce(((max, key) => key.length > max ? key.length : max), 0)

const padd = (str) => {
  let n = paddLength - str.length
  while(n-- > 0) {
    str = ` ` + str
  }
  return str
}

const print = (level, args) => {
  args.unshift(moment().format(`HH:MM:ss SSS`), `${chalk[levels[level]](padd(level))} -`)
  console.log.apply(console, args)
}

for (let level in levels) {
  // use a classical function to propagate arguments to print
  exports[level] = function() {
    let args = []
    for (let i = 0; i < arguments.length; i++) {
      args[i] = arguments[i]
    }
    print(level, args)
  }
}
