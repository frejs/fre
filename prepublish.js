const fs = require('fs')

const paths = [
  "dist/fre.js",
  "dist/fre-esm.js",
  "dist/fre-umd.js",
]

for (path of paths) {
  if (! fs.existsSync(path)) {
    process.stderr.write(`ERROR: missing required file "${path}"\n\n`)
    process.exit(1)
  }
}
