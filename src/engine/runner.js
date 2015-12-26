'use strict'

const path = require(`path`)
const fs = require(`fs`)
const chalk = require(`chalk`)
const logger = require(`../logger`)
const execute = require(`./execute`)
const loadFixtures = require(`./loader`)
const supported = require(`./langages`)

const print = (out) => {
  let turn = 1
  logger.runner(`--- turn ${turn++}`)
  return out.some((trace, i) => {
    if (trace.line) {
      logger[trace.debug ? `debug` : `out`](trace.line)
      if (trace.eot) {
        logger.runner(`--- turn ${turn++}`)
      }
    }
    // display error
    if (trace.err) {
      logger.error(trace.err.message)
    }
    return trace.err
  })
}

const runTest = (opts, fixtures) =>
  new Promise((resolve, reject) => {
    // no more test to be run
    if (fixtures.length === 0) {
      return resolve()
    }
    let fixture = fixtures.shift()
    let start = Date.now()

    logger.runner(`execute test '${chalk.green(fixture.name)}'...`)
    execute(opts.file, opts.langage, opts.timeout, fixture.input, fixture.expect).
      then(out => {
        let hasError = print(out)
        logger.runner(`'${chalk[hasError ? 'red' : 'green'](fixture.name)}' executed in ${Date.now() - start} ms\n`)
        // run next test
        runTest(opts, fixtures).then(resolve)
      }).
      catch(err => {
        // stop at first exception
        logger.error(err.message);
        logger.runner(`'${chalk.red(fixture.name)}' errored in ${Date.now() - start} ms\n`)
        resolve()
      })
  })

const run = (opts) => {
  let start = Date.now()
  let fixturePath = path.dirname(opts.file)

  return loadFixtures(fixturePath).
    then(fixtures => {
      logger.runner(`loaded ${chalk.green(fixtures.length)} fixtures in ${Date.now() - start} ms`)
      return runTest(opts, fixtures)
    })
}

module.exports = (challenge, opts) =>
  new Promise((resolve, reject) => {
    let folder = path.resolve(opts.folder, challenge)
    opts.langage = opts.langage.toLowerCase().trim()

    if (!supported[opts.langage]) {
      return reject(new Error(`unsupported langage ${opts.langage}`))
    }
    opts.file = path.resolve(folder, `${challenge}.${supported[opts.langage].ext}`)

    run(opts).then(() => {
      if (!opts.watch) {
        logger.runner(`execution successful !`)
        return resolve()
      }
      // or infinite promise: no resolve
      logger.runner(`watch for changes in ${chalk.gray(folder)}...\n`)
      let running = false
      fs.watch(folder, () => {
        if (!running) {
          running = true
          logger.runner(chalk.bgYellow.black(`--- new execution ---\n`))
          run(opts).
            then(() => {
              running = false
              logger.runner(`execution successful !`)
            }).
            catch(err => {
              running = false
              logger.error(`execution successful !`)
            })
        }
      })
    }).catch(reject)
  })
