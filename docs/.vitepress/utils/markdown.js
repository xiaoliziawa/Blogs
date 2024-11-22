import fs from 'fs'
import path from 'path'

// 计算字数（排除标点符号和空格）
function countWords(content) {
  return content
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')  // 只保留中文、英文和数字
    .length
}

// 获取文件最后修改时间
function getLastUpdated(filePath) {
  const stats = fs.statSync(filePath)
  return stats.mtime
}

// 处理单个 Markdown 文件
function processMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  return {
    wordCount: countWords(content),
    lastUpdated: getLastUpdated(filePath)
  }
}

// 扫描目录下的所有 Markdown 文件
function scanMarkdownFiles(dir) {
  const fileStats = {}
  
  function scan(directory) {
    const files = fs.readdirSync(directory)
    
    files.forEach(file => {
      const fullPath = path.join(directory, file)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        scan(fullPath)
      } else if (file.endsWith('.md')) {
        const relativePath = path.relative(process.cwd(), fullPath)
        fileStats[relativePath] = processMarkdownFile(fullPath)
      }
    })
  }
  
  scan(dir)
  return fileStats
}

export { scanMarkdownFiles } 