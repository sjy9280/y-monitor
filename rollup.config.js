import resolve from ''
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import size from 'rollup-plugin-sizes'
import typescript from 'rollup-plugin-typescript2'
import { visiualizer } from 'rollup-plugin-visualizer'
import { terser } from '@rollup/plugin-terser'
import clear from 'rollup-plugin-clear'
import cleanup from 'rollup-plugin-cleanup'


const path = require('path')
const fs = require('fs')

// 获取所有包
const packagesDir = path.resolve(__dirname, 'packages')
const packages = fs.readdirSync(path.resolve(__dirname, 'packages'));


// 目标包
const packageDir = path.resolve(packagesDir, process.env.TARGET)
const packageDirDist = process.env.LOCALDIR === undefined ? `${packageDir}/dist` : process.env.LOCALDIR

const name = path.basename(packageDir)

const projectName = '@monitor'
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
      visiualizer({
        title: `${projectName} analyzer`,
        filename: 'analyzer.html'
      }),
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
      })
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