#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vitepress/dist

# 创建 CNAME 文件
echo 'lirxowo.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 推送到你的仓库
git push -f git@github.com:xiaoliziawa/xiaoliziawa.github.io.git main

cd - 