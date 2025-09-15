const fs = require('fs')
const execa = require('execa')

const targets = fs.readdirSync('packages').filter((f) => {
  if (!fs.statSync(`packages/${f}`).isDirectory()) {
    return false
  }
  if (f === 'company') return false
  const pkg = require(`../packages/${f}/package.json`)
  if (pkg.private && !pkg.buildOptions) {
    return false
  }
  return true
})


// 命令行参数解析
const getArgv = () => {
  var argv = require('minimist')(process.argv.slice(2))
  return argv
}

const binRun = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts })


module.exports = {
  getArgv,
  binRun,
  targets
}

