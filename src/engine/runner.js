'use strict'

const babel = require(`babel-core`)
const path = require(`path`)
const fs = require(`fs`)
const chalk = require(`chalk`)
const setupIO = require(`./io`)
const logger = require(`../logger`)
const loadFixtures = require(`./loader`)

const babelOpts = {
  presets: [`es2015`]
}

const defaultDone = err => {
  if (err) {
    logger.error(err.stack)
  } else {
    logger.runner(`execution successful !`)
  }
}

const print = (out) => {
  let turn = 1
  return out.some(trace => {
    if (!trace.debug) {
      logger.runner(`--- turn ${turn++}`)
    }
    logger[trace.debug ? `debug` : `out`].apply(console, trace.args)
    // display error
    if (trace.err) {
      logger.error(trace.err.message)
    }
    return trace.err
  })
}

const runOnce = (file, opts, done) => {
  done = done || defaultDone

  let start = Date.now()
  let fixturePath = path.dirname(file)

  loadFixtures(fixturePath, (err, fixtures) => {
    if (err) {
      return done(err)
    }
    logger.runner(`loaded ${chalk.green(fixtures.length)} fixtures in ${Date.now() - start} ms`)
    start = Date.now()

    babel.transformFile(file, babelOpts, (err, result) => {
      if (err) {
        return done(new Error(`failed to read or compilee source ${file}: ${err}`))
      }
      logger.runner(`compiled in ${Date.now() - start} ms\n`)

      let interrupt = false
      fixtures.forEach(fixture => {
        if(interrupt) {
          return
        }
        let out = []
        start = Date.now()
        logger.runner(`execute test '${chalk.green(fixture.name)}'...`)
        try {
          setupIO(fixture.input, out, fixture.expect)
          new Function(result.code)()
        } catch (exc) {
          if (exc.message !== 'eof') {
            interrupt = true
            setTimeout(() => done(exc), 0)
          }
        } finally {
          let hasError = print(out)
          logger.runner(`'${chalk[interrupt || hasError ? 'red' : 'green'](fixture.name)}' executed in ${Date.now() - start} ms\n`)
        }
      })
      if (!interrupt) {
        done()
      }
    })
  })
}

const run = (challenge, opts, done) => {
  let folder = path.resolve(opts.folder || `./challenges`, challenge)
  let file = path.resolve(folder, `${challenge}.js`)

  logger.runner(`watch for changes in ${chalk.gray(folder)}...\n`)
  runOnce(file, opts, opts.watch ? null : done)

  if (opts.watch) {
    let running = false
    fs.watch(folder, () => {
      if (!running) {
        running = true
        logger.runner(chalk.bgYellow.black(`--- new execution ---\n`))
        runOnce(file, opts, err => {
          running = false
          defaultDone(err)
        })
      }
    })
  }
}

module.exports = run
