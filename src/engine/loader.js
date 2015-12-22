'use strict'

const fs = require(`fs`)
const resolve = require(`path`).resolve

const loadFixtures = (folder, done) => {
  folder = resolve(folder)
  fs.readdir(folder, (err, entries) => {
    if (err || entries.length === 0) {
      return done(new Error(`failed to read challenge subfolder ${folder}: ${err}`))
    }
    // only keep inputs
    let only = entries.filter(e => /\.in\.only$/.test(e))[0]
    entries = only ? [only] : entries.filter(e => /\.in?$/.test(e))
    let fixtures = []
    entries.forEach(file => {
      let name = file.replace(/\.in(\.only)?$/, '')
      let inFile = resolve(folder, file)

      fs.readFile(inFile, (err, input) => {
        if (err) {
          return done(new Error(`failed to read input fixture ${inFile}: ${err}`))
        }

        let outFile = resolve(folder, `${name}.out`)
        fs.readFile(outFile, (err, output) => {
          if (err) {
            return done(new Error(`failed to read ${outFile}: ${err}`))
          }

          fixtures.push({
            name,
            input: input.toString().split(/\r?\n/),
            expect: output.toString().split(/\r?\n/)
          })
          if(fixtures.length === entries.length) {
            // order fixtures by name
            done(null, fixtures.sort((f1, f2) => f1.name < f2.name ? -1 : 1))
          }
        })
      })
    })
  })
}

module.exports = loadFixtures;
