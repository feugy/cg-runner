'use strict'

const spawn = require(`child_process`).spawn
const path = require(`path`)
const format = require(`util`).format
const chalk = require(`chalk`)
const supported = require('./langages')

module.exports = (file, langage, timeout, inputs, expects) =>
  new Promise((resolve, reject) => {
    const enginSpec = supported[langage]
    const engine = spawn(enginSpec.path, format(enginSpec.args, file).split(`,`))

    let expectIdx = 0
    let inputIdx = 0
    const out = []
    let timer

    const sendInputs = () => {
      if (!inputs.length) {
        return engine.kill()
      }
      try {
        let removed = 0
        inputs.some(input => {
          inputIdx++
          removed++
          let endOfTurn = input.length === 0
          if (!endOfTurn) {
            engine.stdin.write(`${input}\n`)
          }
          return endOfTurn
        })
        inputs.splice(0, removed)
      } catch (err) {
        reject(new Error(`failed to send input: ${err}`))
      }

      timer = setTimeout(() => {
        out.push({err: new Error(`Take too long !`)})
        engine.kill()
      }, timeout)
    }

    engine.stderr.on(`data`, data => {
      data.toString().split(/\r?\n/).forEach(line => {
        out.push({line, debug: true})
      })
    })

    const processOutput = line => {
      clearTimeout(timer)
      let expected = expects[expectIdx++]
      let err
      if (line !== expected) {
        err = new Error(`Unexpected output:
  ${chalk.green(`expected: ` + expected)}
  ${chalk.red(`  actual: ` + line)}
        `)
      }
      out.push({line, err})
      // empty expected line: next turn please !
      if (expectIdx === expects.length || expects[expectIdx] === '') {
        out[out.length - 1].eot = true
        expectIdx++
        setTimeout(sendInputs, 10)
      }
    }

    engine.stdout.on(`data`, data => {
      data.toString().split(/\r?\n/).filter(l => l.length).forEach(processOutput)
    })

    engine.on(`close`, errCode => {
      if (!errCode) {
        return resolve(out)
      }
      const name = path.basename(file)
      const details = out.filter(trace => trace.debug).map(trace => trace.line.replace(file, name)).join(`\n`)
      reject(new Error(`Execution failed with code ${errCode}:\n${details}`))
    })

    setTimeout(sendInputs, 10)
  })
