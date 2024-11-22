---
layout: home
hero:
  name: PrizOwO Blogs
  text: Welcome !
  tagline: 收录各种网站、Code！
  actions:
    - theme: brand
      text: Start !
      link: /code/
    - theme: alt
      text: Questions
      link: /code/faq
    - theme: alt
      text: Github
      link: https://github.com/xiaoliziawa
features:
  - icon: 💻
    title: 代码示例
    details: 提供一些关于KubeJS以及Modding的代码示例。
    link: /code/
  - icon: 💾
    title: 软件列表
    details: 罗列一些常用软件。
    link: /software/
  - icon: 🌐
    title: 网址导航
    details: 导航常用网站。
    link: /websites/
---

<div class="github-activity">
  <div class="activity-stats">
    <div class="contribution-graph" :class="{ 'dark-theme': isDark }">
      <img :src="`https://github-readme-activity-graph.vercel.app/graph?username=xiaoliziawa&repo=Blogs&bg_color=${isDark ? '121212' : 'ffffff'}&color=${isDark ? '4169e1' : '000000'}&line=${isDark ? '8B00FF' : '4169e1'}&point=${isDark ? '4169e1' : '4169e1'}&area=true&hide_border=true`" alt="Blogs Activity Graph">
    </div>
    <div class="commit-info">
      <span>仓库活动</span>
      <span class="commit-count">COMMIT ACTIVITY 6/MONTH</span>
    </div>
  </div>
</div>

<script setup>
import { useData } from 'vitepress'
const { isDark } = useData()
</script>

<style>
.github-activity {
  padding: 2rem;
  margin: 2rem auto;
  max-width: 900px;
  text-align: center;
}

.contribution-graph {
  background: var(--vp-c-bg);
  border-radius: 8px;
  padding: 1rem;
  transition: background-color 0.3s;
}

.contribution-graph img {
  width: 100%;
  height: auto;
  border-radius: 6px;
}

.commit-info {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--vp-c-text-2);
}

.commit-count {
  background: var(--vp-c-brand);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
}
</style> 