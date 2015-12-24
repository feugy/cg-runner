'use strict'

const fs = require(`fs`)
const path = require(`path`)

const readFixture = (file) =>
  new Promise((resolve, reject) => {
    let name = path.basename(file.replace(/\.in(\.only)?$/, ''))

    fs.readFile(file, (err, input) => {
      if (err) {
        return reject(new Error(`failed to read input fixture ${file}: ${err}`))
      }

      let outFile = path.resolve(path.dirname(file), `${name}.out`)
      fs.readFile(outFile, (err, output) => {
        if (err) {
          return reject(new Error(`failed to read ${outFile}: ${err}`))
        }

        resolve({
          name,
          input: input.toString().split(/\r?\n/),
          expect: output.toString().split(/\r?\n/)
        })
      })
    })
  })

module.exports = (folder) => {
  folder = path.resolve(folder)
  return new Promise((resolve, reject) => {
    fs.readdir(folder, (err, entries) => {
      if (err || entries.length === 0) {
        return reject(new Error(`failed to read challenge subfolder ${folder}: ${err}`))
      }
      // only keep inputs
      let only = entries.filter(e => /\.in\.only$/.test(e))[0]
      entries = only ? [only] : entries.filter(e => /\.in?$/.test(e))

      Promise.all(entries.map(file => readFixture(path.resolve(folder, file)))).
        then(fixtures => resolve(fixtures.sort((f1, f2) => f1.name < f2.name ? -1 : 1))).
        catch(reject)
    })
  })
}
