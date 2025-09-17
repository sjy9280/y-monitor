import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import size from 'rollup-plugin-sizes'
import typescript from 'rollup-plugin-typescript2'
import { visualizer } from 'rollup-plugin-visualizer'
import terser from '@rollup/plugin-terser'
import clear from 'rollup-plugin-clear'
import cleanup from 'rollup-plugin-cleanup'
import path, { dirname } from 'path'
import fs from 'fs'
// const resolve = require('@rollup/plugin-node-resolve')
// const json = require('@rollup/plugin-json')
// const commonjs = require('@rollup/plugin-commonjs')
// const size = require('rollup-plugin-sizes')
// const typescript = require('rollup-plugin-typescript2')
// const terser = require('@rollup/plugin-terser')
// const clear = require('rollup-plugin-clear')
// const cleanup = require('rollup-plugin-cleanup')
// const pkg = require('rollup-plugin-visualizer')


// const path = require('path')
// const fs = require('fs')
import { fileURLToPath } from 'url';
const isDeclaration = process.env.TYPES !== 'false'

const __dirname = path.dirname(fileURLToPath(import.meta.url));


// 获取所有包
const packagesDir = path.resolve(__dirname, 'packages')
const packages = fs.readdirSync(path.resolve(__dirname, 'packages'));


// 目标包
const packageDir = path.resolve(packagesDir, process.env.TARGET)
const packageDirDist =`${packageDir}/dist`

const name = path.basename(packageDir)

const projectName = '@y-monitor'
const paths = {}

packages.forEach((item) => {
  if (item.startsWith('.')) return
  paths[`${projectName}/${item}`] = [`${packagesDir}/${item}/src`]
})

function getCommon(format) {
  const common = {
    input: `${packageDir}/src/index.ts`,
    plugins: [
      resolve(),
      json(),
      commonjs(),
      size(),
      cleanup({
        comments: 'none'
      }),
      typescript({ // TypeScript 配置
        tsconfig: 'tsconfig.build.json', // 使用专门的构建配置
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          compilerOptions: {
            declaration: isDeclaration, // 是否生成 .d.ts
            declarationMap: isDeclaration,
            declarationDir: `${packageDirDist}/packages/`, // 声明文件输出目录
            module: 'ES2015',
            paths // 路径映射
          }
        },
        include: ['*.ts+(|x)', '**/*.ts+(|x)', '../**/*.ts+(|x)']
      }),
      visualizer({
        title: `${projectName} analyzer`,
        filename: 'analyzer.html'
      }),
    ]
  }
  return common
}

const common = getCommon()


const esmPackage = {
  ...common,
  output: {
    file: `${packageDirDist}/${name}.esm.js`,
    format: 'es',
    sourcemap: true,
    ...common.output
  },
  plugins: [
    ...common.plugins,
    clear({
      targets: [packageDirDist]
    })
  ]
}
const cjsPackage = {
  ...common,
  external: [],
  output: {
    file: `${packageDirDist}/${name}.js`,
    format: 'cjs',
    sourcemap: true,
    minifyInternalExports: true,
    ...common.output
  },
  plugins: [...common.plugins]
}

const iifePackage = {
  ...common,
  external: [],
  output: {
    file: `${packageDirDist}/${name}.min.js`,
    format: 'iife',
    name: 'MONITOR',
    ...common.output
  },
  plugins: [...common.plugins, terser()]
}


const total = {
  cjsPackage,
  esmPackage,
  iifePackage
}

export default [...Object.values(total)]