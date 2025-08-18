import fs from 'fs'
import path from 'path'

export function genCname(root) {
  const cnamePath = path.resolve(root, '.vitepress/dist/CNAME')
  fs.writeFileSync(cnamePath, 'www.lirxowo.com\n')
} 