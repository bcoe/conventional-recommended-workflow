const toml = require('@iarna/toml')
const detectNewline = require('detect-newline')

function findLineIndexWithVersion (lines, name) {
  const lineWithName = lines.findIndex(line => line.match(`name = "${name}"`))
  let lineWithVersion = lineWithName + 1

  let keep = true
  while (keep) {
    const maybeLine = lines[lineWithVersion]
    if (maybeLine.match('version = ')) {
      keep = false
    } else {
      lineWithVersion += 1
    }
  }

  return lineWithVersion
}

exports.readVersion = function readVersion (contents, name) {
  const parsed = toml.parse(contents)
  return parsed.package
    .find(pkg => pkg.name === name)
    .version
}

exports.writeVersion = function writeVersion (contents, version, name) {
  const newline = detectNewline(contents)
  const byLine = contents.split(newline)
  const lineIndexWithVersion = findLineIndexWithVersion(byLine, name)

  const lineWithVersion = byLine[lineIndexWithVersion]
  byLine[lineIndexWithVersion] = lineWithVersion.replace(/".*?"/g, `"${version}"`)

  return byLine.join(newline)
}

exports.isPrivate = function isPrivate () {
  // standard-version should not do anything with cargo crates for sure,
  // thus, consider everything private
  return true
}
