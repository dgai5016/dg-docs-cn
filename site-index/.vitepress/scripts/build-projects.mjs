#!/usr/bin/env node
/**
 * build-projects.mjs
 *
 * 扫描仓库根的所有子目录，读取每个 .project.json，
 * 输出汇总到 .vitepress/projects.json，供首页 index.md 渲染项目卡片。
 *
 * 运行方式：node .vitepress/scripts/build-projects.mjs
 * 仓库根通过 git rev-parse --show-toplevel 推断；fallback 到向上查找。
 */

import { readdir, readFile, writeFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 推断仓库根：优先用 git，否则向上找含 site-index 的目录
function findRepoRoot() {
  try {
    return execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim()
  } catch {
    let dir = resolve(__dirname, '..', '..', '..')
    while (dir !== '/') {
      if (existsSync(join(dir, 'site-index'))) return dir
      dir = dirname(dir)
    }
    return resolve(__dirname, '..', '..', '..')
  }
}

async function isDirectory(path) {
  try {
    return (await stat(path)).isDirectory()
  } catch {
    return false
  }
}

async function main() {
  const repoRoot = findRepoRoot()
  const outputPath = join(__dirname, '..', 'projects.json')

  const entries = await readdir(repoRoot, { withFileTypes: true })
  const projectDirs = entries.filter(
    (e) => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules' && e.name !== 'site-index'
  )

  const projects = []
  for (const dir of projectDirs) {
    const projectJsonPath = join(repoRoot, dir.name, '.project.json')
    if (!existsSync(projectJsonPath)) continue

    try {
      const raw = await readFile(projectJsonPath, 'utf-8')
      const data = JSON.parse(raw)
      projects.push({
        name: data.name || dir.name,
        dirName: dir.name,
        title: data.title || data.name || dir.name,
        description: data.description || '',
        framework: data.framework || 'unknown',
        originalUrl: data.original_url || '',
        originalRepo: data.original_repo || '',
        translatedAt: data.translated_at || '',
        status: data.status || 'unknown',
        originalCommitShort: data.original_commit_short || '',
        originalCommitDate: data.original_commit_date || '',
        lastUpdatedAt: data.last_updated_at || '',
        updateCount: data.update_count ?? 0,
        url: `/dg-docs-cn/${dir.name}/`
      })
    } catch (err) {
      console.warn(`[build-projects] 跳过 ${dir.name}/.project.json：${err.message}`)
    }
  }

  projects.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))

  await writeFile(outputPath, JSON.stringify(projects, null, 2), 'utf-8')
  console.log(`[build-projects] 写入 ${projects.length} 个项目到 ${outputPath}`)
}

main().catch((err) => {
  console.error('[build-projects] 失败：', err)
  process.exit(1)
})
