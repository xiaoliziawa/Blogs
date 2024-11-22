---
layout: home
hero:
  name: PrizOwO Blogs
  text: Welcome !
  tagline: 收录各种网站、Code！
  image:
    src: /page-icon.png
    alt: Logo
  actions:
    - theme: brand
      text: Start !
      link: /code/
    - theme: alt
      text: Questions
      link: /err/
    - theme: alt
      text: Github
      link: https://github.com/xiaoliziawa
    - theme: alt
      text: Cards
      link: /cards/

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

<div class="github-activity-section">
  <div class="github-chart-container">
    <GitHubChart />
  </div>
</div>

<style>
.VPHero .image-container {
  transform: none !important;
  overflow: visible !important;
  position: relative;
  z-index: 1;
}

.VPHero .image-bg {
  width: 250px !important;
  height: 250px !important;
  overflow: visible !important;
  background: transparent !important;
}

.VPHero .image {
  position: relative;
  width: 250px;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 修改光晕效果，只在暗色模式下显示 */
html:not(.dark) .VPHero .image::before,
html:not(.dark) .VPHero .image::after {
  display: none;
}

.VPHero .image::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle at center,
    rgba(139, 69, 19, 0.2) 0%,
    rgba(139, 69, 19, 0.15) 20%,
    rgba(139, 69, 19, 0.1) 40%,
    rgba(139, 69, 19, 0.05) 60%,
    transparent 80%
  );
  border-radius: 50%;
  z-index: -1;
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.VPHero .image::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle at center,
    rgba(139, 69, 19, 0.1) 0%,
    rgba(139, 69, 19, 0.05) 30%,
    rgba(139, 69, 19, 0.02) 60%,
    transparent 80%
  );
  border-radius: 50%;
  z-index: -2;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

:root {
  --vp-home-hero-image-background-image: none;
  --vp-home-hero-image-filter: none;
}

.github-activity-section {
  padding: 48px 24px;
  max-width: 1152px;
  margin: 0 auto;
}

.github-chart-container {
  width: 100%;
  height: 300px;
}

@media (max-width: 960px) {
  .github-activity-section {
    padding: 32px 16px;
  }
  
  .github-chart-container {
    height: 250px;
  }
}
</style>