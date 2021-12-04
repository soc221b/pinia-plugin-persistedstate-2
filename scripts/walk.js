const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')

const ignoredPaths = [/node_modules/, /dist/]

main()

function main() {
  const relpath = process.argv[2]
  console.assert(relpath.trim() !== '')

  const args = process.argv.slice(3)
  const command = args.join(' ')
  console.assert(command.trim() !== '')

  const rootDir = path.resolve(__dirname, '..', relpath)

  const exampleDirectories = collectExampleDirectories(rootDir)
  exampleDirectories.forEach((dir) => execCommand(dir, command))
}

function collectExampleDirectories(dir, exampleDirectories = []) {
  for (const p of fs.readdirSync(dir)) {
    if (ignoredPaths.some((ignoredPath) => ignoredPath.test(p))) continue

    const absP = path.resolve(dir, p)
    if (p === 'package.json') {
      exampleDirectories.push(dir)
    }

    if (fs.lstatSync(absP).isDirectory()) {
      collectExampleDirectories(absP, exampleDirectories)
    }
  }

  return exampleDirectories
}

function execCommand(dir, command) {
  console.log('='.repeat(80))
  console.log(`> cd ${dir} && ${command}`)
  console.log('='.repeat(80))
  childProcess.execSync(`cd ${dir} && ${command}`, {
    stdio: 'inherit',
  })
}
