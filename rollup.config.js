const path = require('path')
const fs = require('fs')

// 获取所有包
const packagesDir = path.resolve(__dirname, 'packages')
const packages = fs.readdirSync(path.resolve(__dirname, 'packages'));


// 目标包
const packageDir = path.resolve(packagesDir, process.env.TARGET)
const packageDirDist = process.env.LOCALDIR === undefined ? `${packageDir}/dist` : process.env.LOCALDIR

console.log('=====res target package', packageDir, packageDirDist)

const name = path.basename(packageDir)

console.log('=======res bansename', name)

const projectName = '@monitor'
const paths = {}

packages.forEach((item) => {
  if (item.startsWith('.')) return
  paths[`${projectName}/${item}`] = [`${packagesDir}/${item}/src`]
})



