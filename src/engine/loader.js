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
    entries = entries.filter(e => /\.in$/.test(e))
    let fixtures = []
    entries.forEach(file => {
      let name = file.replace(/\.in$/, '')
      file = resolve(folder, `${name}.in`)

      fs.readFile(file, (err, input) => {
        if (err) {
          return done(new Error(`failed to read input fixture ${file}: ${err}`))
        }

        file = resolve(folder, `${name}.out`)
        fs.readFile(file, (err, output) => {
          if (err) {
            return done(new Error(`failed to read ${file}: ${err}`))
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
