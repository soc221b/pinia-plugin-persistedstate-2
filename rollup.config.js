import path from 'path'
import * as rm from 'rimraf'
import ts from 'rollup-plugin-typescript2'
import terser from '@rollup/plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import babel from '@rollup/plugin-babel'
import { pascalCase } from 'change-case'

rm.sync(resolvePackage('dist'))

const packageName = 'pinia-plugin-persistedstate-2'
const mainFilePath = 'src/index.ts'
const pascalCasePackageName = pascalCase(packageName)
const input = resolvePackage(mainFilePath)
const output = 'index'
const productionSuffix = 'prod'
const formats = ['es', 'iife', 'cjs']
if (process.env.DEVELOPMENT) formats.splice(2)

const configs = []
formats.forEach((format) => {
  const isIifeOrCjs = format === 'iife' || format === 'cjs'
  const isEsm = format === 'es'
  const ext = isEsm ? 'mjs' : 'js'

  const config = {
    input,
    plugins: [
      ts(),
      resolve(),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.ts'],
      }),
    ],
    output: {
      format,
      name: pascalCasePackageName,
      extend: true,
      exports: 'auto',
    },
  }

  configs.push({
    ...config,
    plugins: [
      ...config.plugins,
      ...(isIifeOrCjs
        ? [
            replace({
              preventAssignment: true,
              'process.env.NODE_ENV': "'development'",
            }),
          ]
        : []),
    ],
    output: {
      ...config.output,
      file: resolvePackage(`dist/${output}.${format}.${ext}`),
    },
  })

  configs.push({
    ...config,
    plugins: [
      ...config.plugins,
      ...(isIifeOrCjs
        ? [
            replace({
              preventAssignment: true,
              'process.env.NODE_ENV': "'production'",
            }),
          ]
        : []),
      terser(),
    ],
    output: {
      ...config.output,
      file: resolvePackage(
        `dist/${output}.${format}.${productionSuffix}.${ext}`,
      ),
    },
  })
})

export default configs

function resolvePackage(...paths) {
  return import.meta
    .resolve(['.', ...paths].join(path.sep), import.meta.url)
    .replace('file://', '')
}
