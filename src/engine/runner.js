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

const runOnce = (file, opts, done) => {
  done = done || (err => {
    if (err) {
      logger.error(err)
    } else {
      logger.runner(`execution successful !`)
    }
  })

  let start = Date.now()

  loadFixtures(path.dirname(file), (err, fixtures) => {
    logger.runner(`loaded ${chalk.green(fixtures.length)} fixtures in ${Date.now() - start} ms`)
    start = Date.now()

    babel.transformFile(file, babelOpts, (err, result) => {
      if (err) {
        return done(new Error(`failed to read or compilee source ${file}: ${err}`))
      }
      logger.runner(`compiled in ${Date.now() - start} ms\n`)

      fixtures.forEach(fixture => {
        start = Date.now()
        logger.runner(`execute test '${chalk.green(fixture.name)}'...`)
        try {
          let out = []
          setupIO(fixture.input, out, fixture.expect)
          new Function(result.code)()

          out.some(trace => {
            logger[trace.debug ? `debug` : `out`].apply(console, trace.args)
            if (trace.err) {
              logger.error(trace.err.message)
            }
            return trace.err
          })
          logger.runner(`'${chalk.green(fixture.name)}'' executed in ${Date.now() - start} ms\n`)
        } catch (exc) {
          done(new Error(`error while running: ${exc.message}`))
        }
      })
    })
  })
}

const run = (challenge, opts, done) => {
  let folder = path.resolve(opts.folder || `./challenges`, challenge)
  let file = path.resolve(folder, `${challenge}.js`)

  runOnce(file, opts, opts.watch ? null : done)
  if (opts.watch) {
    fs.watchFile(file, () => {
      runOnce(file, opts)
    })
  }
}

module.exports = run
