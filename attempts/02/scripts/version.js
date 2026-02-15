#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'

let version = '1.0.0'

try {
  const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))
  version = pkg.version || version
} catch (error) {
  // use fallback version
}

let build = 'dev'
let branch = 'unknown'

try {
  build = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim()
  branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim()
} catch (error) {
  // not in a git repository
}

const versionInfo = {
  version,
  build,
  branch,
  timestamp: new Date().toISOString()
}

const targets = ['./public/version.json', './version.json']

for (const target of targets) {
  try {
    writeFileSync(target, JSON.stringify(versionInfo, null, 2))
  } catch (error) {
    // target path missing
  }
}

if (existsSync('./dist')) {
  writeFileSync('./dist/version.json', JSON.stringify(versionInfo, null, 2))
}

console.log(`Version ${version} (${build})`)
