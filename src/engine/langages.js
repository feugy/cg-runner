'use strict'

const path = require(`path`)

module.exports = {
  javascript: {
    path: path.resolve(__dirname, '..', '..', 'js-engine', 'js.exe'),
    args: `--file=%s,-w`,
    ext: `js`
  },
  python: {
    path: 'python',
    args: `-u,%s`,
    ext: `py`
  }
}
