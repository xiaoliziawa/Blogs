import { readdirSync, statSync } from 'fs'
import { join, relative } from 'path'
import matter from 'gray-matter'

function getFirstHeading(content) {
  const match = content.match(/^#\s+(.*)$/m)
  return match ? match[1] : null
}

export default function generateSidebar(root = 'docs') {
  const sidebar = {}
  
  function getIndexSidebar(dir) {
    const indexPath = join(dir, 'index.md')
    try {
      const indexContent = matter.read(indexPath)
      if (indexContent.data.sidebar) {
        return JSON.parse(JSON.stringify(indexContent.data.sidebar))
      }
      return null
    } catch (e) {
      return null
    }
  }

  function processDirectory(dir) {
    const customSidebar = getIndexSidebar(dir)
    if (customSidebar) {
      const dirPath = '/' + relative(root, dir).replace(/\\/g, '/') + '/'
      
      const processedSidebar = customSidebar.map(section => {
        if (section.items) {
          return {
            ...section,
            items: section.items.map(item => {
              if (item.link && !item.link.startsWith('http')) {
                const link = item.link.startsWith('/') ? item.link : '/' + item.link
                return { ...item, link }
              }
              return item
            })
          }
        }
        return section
      })

      sidebar[dirPath] = processedSidebar
      return []
    }

    const items = []
    const files = readdirSync(dir)
    
    files.forEach(file => {
      const fullPath = join(dir, file)
      const stat = statSync(fullPath)
      
      if (stat.isDirectory()) {
        processDirectory(fullPath)
      } else if (file.endsWith('.md') && file !== 'index.md') {
        const content = matter.read(fullPath)
        const title = content.data.title || getFirstHeading(content.content) || file.replace('.md', '')
        
        items.push({
          text: title,
          link: `/${relative(root, fullPath).replace(/\.md$/, '').replace(/\\/g, '/')}`
        })
      }
    })
    
    if (items.length > 0) {
      const dirPath = '/' + relative(root, dir).replace(/\\/g, '/') + '/'
      if (!sidebar[dirPath]) {
        sidebar[dirPath] = items
      }
    }
    
    return items
  }

  readdirSync(root).forEach(dir => {
    const fullPath = join(root, dir)
    if (statSync(fullPath).isDirectory()) {
      processDirectory(fullPath)
    }
  })

  return sidebar
} 