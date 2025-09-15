const { getArgv } = require('./utils')

function run() {
  const argv = getArgv()
  console.info(argv)

  const paramTarget = argv._
  LOCALDIR = argv.local

  console.log('test lerna publish')
}