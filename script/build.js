const { getArgv, binRun, targets: allTargets } = require('./utils')
const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const consola = require('consola')
let buildTypes = true
// local debug
let LOCALDIR = 'dist'
let rollupWatch = false
run()

function run() {
  const argv = getArgv()
  console.info(argv)

  const paramTarget = argv._
  LOCALDIR = argv.local
  buildTypes = argv.types !== 'fasle'
  rollupWatch = argv.watch === 'true'
  if (paramTarget.length === 0) {
    buildAll(allTargets)
  } else {
    buildAll(paramTarget)
  }
}

function buildAll(targets) {
  runParallel(10, targets, rollupBuild)
}


async function runParallel(maxConcurrency, sources, iteratorFn) {
  const ret = []
  // const executing = []
  for (const item of sources) {
    const p = Promise.resolve().then(() => iteratorFn(item))
    ret.push(p)
  }
  return Promise.all(ret)
}

/**
 *
 * @param {*} target packages下的文件夹名称
 */
async function rollupBuild(target) {
  const pkgDir = path.resolve(`packages/${target}`)
  const pkg = require(`${pkgDir}/package.json`)
  if (pkg.private) {
    return
  }
  // const env = [pkg.buildOption && pkg.buildOption.env]
  const args = [
    '-c',
    '--environment',
    [
      `TARGET:${target}`,
      `TYPES:${buildTypes}`,
      `LOCALDIR:${LOCALDIR}`
    ]
      .filter(Boolean)
      .join(',')
  ]
  rollupWatch && args.push('--watch')
  const result = await binRun('rollup', args)

  if (buildTypes && pkg.types) {
    console.info(chalk.bold(chalk.yellow(`Rolling up type definitions for ${target}...`)))

    // build types
    const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor')

    const extractorConfigPath = path.resolve(pkgDir, `api-extractor.json`)
    const extractorConfig = ExtractorConfig.loadFileAndPrepare(extractorConfigPath)
    const extractorResult = Extractor.invoke(extractorConfig, {
      localBuild: true,
      showVerboseMessages: false
    })
    if (extractorResult.succeeded) {
      consola.success(chalk.green(`API Extractor completed successfully.`))
    }
    consola.info('pkgDir', pkgDir)
    await fs.remove(`${pkgDir}/dist/packages`)
  }
}
