#!/usr/bin/env node
var conventionalChangelog = require('conventional-changelog')
var conventionalRecommendedBump = require('conventional-recommended-bump')
var path = require('path')
var argv = require('yargs')
  .usage('Usage: $0 [options]')
  .option('infile', {
    alias: 'i',
    describe: 'Read the CHANGELOG from this file',
    default: 'CHANGELOG.md',
    global: true
  })
  .option('preset', {
    alias: 'p',
    describe: 'Name of the preset you want to use. Must be one of the following:\nangular, atom, codemirror, ember, eslint, express, jquery, jscs, or jshint',
    default: 'angular',
    global: true
  })
  .option('message', {
    alias: 'm',
    describe: 'Commit message, replaces %s with new version',
    type: 'string',
    default: 'chore(release): %s',
    global: true
  })
  .option('first-release', {
    alias: 'f',
    describe: 'Is this the first release?',
    type: 'boolean',
    default: false,
    global: true
  })
  .help()
  .alias('help', 'h')
  .example('$0', 'Update changelog and tag release')
  .example('$0 -m "%s: see changelog for details"', 'Update changelog and tag release with custom commit message')
  .wrap(97)
  .argv

var addStream = require('add-stream')
var chalk = require('chalk')
var exec = require('child_process').exec
var fs = require('fs')
var pkgPath = path.resolve(process.cwd(), './package.json')
var pkg = require(pkgPath)
var semver = require('semver')
var tempfile = require('tempfile')
var rimraf = require('rimraf')
var util = require('util')

conventionalRecommendedBump({
  preset: argv.preset
}, function (err, release) {
  if (err) {
    console.error(chalk.red(err.message))
    return
  }

  var newVersion = pkg.version
  if (!argv.firstRelease) {
    newVersion = semver.inc(pkg.version, release.releaseAs)

    console.log(chalk.bold('1.') + ' bump version ' + chalk.bold(release.releaseAs) + ' in package.json (' + pkg.version + ' → ' + chalk.green(newVersion) + ')')
    pkg.version = newVersion
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8')
  } else {
    console.log(chalk.yellow('skip package.json update on first release'))
  }

  outputChangelog(argv, function () {
    commit(argv, newVersion, function () {
      return tag(newVersion, argv)
    })
  })
})

function outputChangelog (argv, cb) {
  console.log(chalk.bold('2.') + ' update changelog (' + chalk.bold(argv.infile) + ')')

  createIfMissing(argv)

  var readStream = fs.createReadStream(argv.infile)
    .on('error', function (err) {
      console.warn(chalk.yellow(err.message))
    })

  var changelogStream = conventionalChangelog({
    preset: argv.preset,
    outputUnreleased: true,
    pkg: {
      path: path.resolve(process.cwd(), './package.json')
    }
  })
    .on('error', function (err) {
      console.error(chalk.red(err.message))
      process.exit(1)
    })
  var tmp = tempfile()

  changelogStream
    .pipe(addStream(readStream))
    .pipe(fs.createWriteStream(tmp))
    .on('finish', function () {
      fs.createReadStream(tmp)
        .pipe(fs.createWriteStream(argv.infile))
        .on('finish', function () {
          rimraf.sync(tmp)
          return cb()
        })
    })
}

function commit (argv, newVersion, cb) {
  console.log(chalk.bold('3.') + ' commit ' + chalk.bold('package.json') + ' and ' + chalk.bold(argv.infile))
  exec('git add package.json ' + argv.infile + ';git commit package.json ' + argv.infile + ' -m "' + formatCommitMessage(argv.message, newVersion) + '"', function (err, stdout, stderr) {
    var errMessage = null
    if (err) errMessage = err.message
    if (stderr) errMessage = stderr
    if (errMessage) {
      console.log(chalk.red(errMessage))
      process.exit(1)
    }
    return cb()
  })
}

function formatCommitMessage (msg, newVersion) {
  return String(msg).indexOf('%s') !== -1 ? util.format(msg, newVersion) : msg
}

function tag (newVersion, argv) {
  console.log(chalk.bold('4.') + ' tag release (' + chalk.green(newVersion) + ')')
  exec('git tag -a v' + newVersion + ' -m "' + argv.message + '"', function (err, stdout, stderr) {
    var errMessage = null
    if (err) errMessage = err.message
    if (stderr) errMessage = stderr
    if (errMessage) {
      console.log(chalk.red(errMessage))
      process.exit(1)
    }
  })
}

function createIfMissing (argv) {
  try {
    fs.accessSync(argv.infile, fs.F_OK)
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(chalk.green('creating ') + argv.infile)
      argv.outputUnreleased = true
      fs.writeFileSync(argv.infile, '', 'utf-8')
    }
  }
}
