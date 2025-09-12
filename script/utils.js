
// 命令行参数解析
const getArgv = () => {
  var argv = require('minimist')(process.argv.slice(2))
  return argv
}

module.exports = {
  getArgv
}