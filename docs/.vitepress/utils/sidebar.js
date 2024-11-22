import fs from 'fs'
import path from 'path'

function generateSidebar(docsPath) {
  const sidebar = {}
  const dirs = fs.readdirSync(docsPath)

  // 过滤掉隐藏文件和特殊目录
  dirs.forEach(dir => {
    if (dir.startsWith('.') || dir === 'public' || !fs.statSync(path.join(docsPath, dir)).isDirectory()) return
    
    const fullPath = path.join(docsPath, dir)
    sidebar[`/${dir}/`] = generateSidebarItems(fullPath)
  })

  return sidebar
}

function generateSidebarItems(dirPath) {
  const items = []
  const files = fs.readdirSync(dirPath)
  
  // 处理目录下的所有文件和文件夹
  files.forEach(file => {
    const fullPath = path.join(dirPath, file)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      // 如果是目录，递归处理
      const subItems = generateSidebarItems(fullPath)
      if (subItems.length > 0) {
        items.push({
          text: formatName(file),
          collapsible: true,
          collapsed: false,
          items: subItems
        })
      }
    } else if (file.endsWith('.md')) {
      // 如果是 markdown 文件
      const content = fs.readFileSync(fullPath, 'utf-8')
      const title = getTitle(content) || formatName(file.replace('.md', ''))
      
      // index.md 放在最前面
      if (file === 'index.md') {
        items.unshift({
          text: title,
          link: getLink(dirPath, file)
        })
      } else {
        items.push({
          text: title,
          link: getLink(dirPath, file)
        })
      }
    }
  })

  return items
}

// 从 markdown 文件中提取标题
function getTitle(content) {
  const match = content.match(/^#\s+(.*)$/m)
  return match ? match[1].trim() : null
}

// 格式化显示名称
function formatName(name) {
  return name
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// 生成链接
function getLink(dirPath, file) {
  const relativePath = path.relative(path.join(process.cwd(), 'docs'), dirPath)
  return `/${relativePath}/${file.replace('.md', '')}`
}

export default generateSidebar 