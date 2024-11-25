import fs from 'fs'
import path from 'path'

export default function generateSidebar(rootDir = 'docs') {
  const sidebar = {}
  const docsPath = path.resolve(process.cwd(), rootDir)
  
  // 获取所有目录
  const dirs = fs.readdirSync(docsPath).filter(file => {
    const stat = fs.statSync(path.join(docsPath, file))
    return stat.isDirectory() && !file.startsWith('.') && file !== 'public'
  })

  // 为每个目录生成侧边栏配置
  dirs.forEach(dir => {
    if (dir === 'cards') return // 跳过 cards 目录，使用自定义配置

    const items = generateSidebarItems(path.join(docsPath, dir), dir)
    if (items.length) {
      sidebar[`/${dir}/`] = [
        {
          text: getDirectoryTitle(dir),
          items: items
        }
      ]
    }
  })

  return sidebar
}

function generateSidebarItems(dirPath, baseDir, parentPath = '') {
  const items = []
  const files = fs.readdirSync(dirPath)

  // 处理 index.md
  const indexFile = files.find(file => file === 'index.md')
  if (indexFile) {
    items.push({
      text: '介绍',
      link: `/${baseDir}${parentPath}/`
    })
  }

  // 处理其他 .md 文件
  files
    .filter(file => file.endsWith('.md') && file !== 'index.md')
    .sort()
    .forEach(file => {
      const name = path.basename(file, '.md')
      items.push({
        text: getFileTitle(path.join(dirPath, file)) || name,
        link: `/${baseDir}${parentPath}/${name}`
      })
    })

  // 处理子目录
  files
    .filter(file => {
      const filePath = path.join(dirPath, file)
      return fs.statSync(filePath).isDirectory() && !file.startsWith('.')
    })
    .forEach(dir => {
      const subItems = generateSidebarItems(
        path.join(dirPath, dir),
        baseDir,
        `${parentPath}/${dir}`
      )
      if (subItems.length) {
        items.push({
          text: getDirectoryTitle(dir),
          collapsed: true,
          items: subItems
        })
      }
    })

  return items
}

// 获取目录标题
function getDirectoryTitle(dir) {
  // 可以根据需要自定义目录标题
  return dir.charAt(0).toUpperCase() + dir.slice(1)
}

// 从 markdown 文件中获取标题
function getFileTitle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const titleMatch = content.match(/^#\s+(.*)$/m)
    return titleMatch ? titleMatch[1] : null
  } catch {
    return null
  }
} 