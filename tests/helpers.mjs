// Shared helpers for the test files (this file is not itself a test).
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = join(dirname(fileURLToPath(import.meta.url)), '..')
export const src = join(root, 'src')

// Text of a project file, e.g. read('src/App.vue')
export const read = (path) => readFileSync(join(root, path), 'utf8')

// Every file under a directory, recursively.
export const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
