<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GitHubChart from './GitHubChart.vue'

gsap.registerPlugin(ScrollTrigger)

const homeRoot = ref(null)
let mediaContext

const routes = [
  {
    index: '01',
    icon: '</>',
    title: '代码实验室',
    description: 'KubeJS、Minecraft Modding 与前端开发实践。',
    link: '/code/',
    accent: 'mint'
  },
  {
    index: '02',
    icon: 'MC',
    title: '模组推荐',
    description: '发现实用、有趣，以及值得长期游玩的模组。',
    link: '/modrec/',
    accent: 'violet'
  },
  {
    index: '03',
    icon: 'PK',
    title: '整合包',
    description: '围绕机制、体验与完成度挑选优质整合包。',
    link: '/modpacks/',
    accent: 'orange'
  },
  {
    index: '04',
    icon: 'APP',
    title: '软件工具',
    description: '整理开发、创作和日常使用的软件清单。',
    link: '/software/',
    accent: 'blue'
  },
  {
    index: '05',
    icon: 'WWW',
    title: '网址导航',
    description: '把常用资源和高质量站点集中在一个入口。',
    link: '/websites/',
    accent: 'rose'
  }
]

const focusItems = [
  { label: 'KubeJS', value: '脚本与玩法扩展' },
  { label: 'NeoForge', value: '现代模组开发' },
  { label: 'Vue', value: '交互与视觉实验' }
]

onMounted(async () => {
  await nextTick()
  if (!homeRoot.value) return

  mediaContext = gsap.matchMedia()
  mediaContext.add(
    {
      desktop: '(min-width: 960px)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    },
    (context) => {
      const { desktop, reduceMotion } = context.conditions

      if (reduceMotion) {
        gsap.set(
          '.home-eyebrow, .home-title-line, .home-summary, .home-actions, .home-metric, .home-visual-stage, .home-route-card, .home-insight-card',
          { clearProps: 'all' }
        )
        return
      }

      const intro = gsap.timeline({
        defaults: { duration: 0.8, ease: 'power3.out' }
      })

      intro
        .from('.home-eyebrow', { autoAlpha: 0, y: 18 })
        .from('.home-title-line', { autoAlpha: 0, y: 54, stagger: 0.12 }, '-=0.48')
        .from('.home-summary', { autoAlpha: 0, y: 24 }, '-=0.52')
        .from('.home-actions', { autoAlpha: 0, y: 20 }, '-=0.56')
        .from('.home-metric', { autoAlpha: 0, y: 18, stagger: 0.08 }, '-=0.54')
        .from('.home-visual-stage', { autoAlpha: 0, scale: 0.9, rotation: 4 }, '-=0.9')

      gsap.to('.home-visual-core', {
        y: -14,
        rotation: 2,
        duration: 3.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      })

      gsap.from('.home-route-card', {
        autoAlpha: 0,
        y: 48,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.home-routes-grid',
          start: 'top 82%',
          once: true
        }
      })

      gsap.from('.home-insight-card', {
        autoAlpha: 0,
        y: 44,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.home-insights-grid',
          start: 'top 82%',
          once: true
        }
      })

      if (desktop) {
        gsap.to('.home-visual-stage', {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: '.home-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8
          }
        })

        gsap.to('.home-orb-one', {
          x: 90,
          y: 60,
          ease: 'none',
          scrollTrigger: {
            trigger: homeRoot.value,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1
          }
        })
      }
    },
    homeRoot.value
  )
})

onUnmounted(() => {
  mediaContext?.revert()
})
</script>

<template>
  <main ref="homeRoot" class="home-page">
    <div class="home-background" aria-hidden="true">
      <span class="home-grid"></span>
      <span class="home-orb home-orb-one"></span>
      <span class="home-orb home-orb-two"></span>
    </div>

    <section class="home-hero" aria-labelledby="home-title">
      <div class="home-hero-copy">
        <div class="home-eyebrow">
          <span class="home-status-dot"></span>
          Minecraft · Code · Creative Notes
        </div>

        <h1 id="home-title" class="home-title">
          <span class="home-title-line">Build ideas.</span>
          <span class="home-title-line home-title-accent">Explore worlds.</span>
          <span class="home-title-line">Share the process.</span>
        </h1>

        <p class="home-summary">
          这里是 LirxOwO 的个人知识库。记录模组开发、KubeJS、前端实验，
          也收藏真正值得再次打开的工具与内容。
        </p>

        <div class="home-actions">
          <a class="home-button home-button-primary" href="/code/">
            开始探索
            <span aria-hidden="true">↗</span>
          </a>
          <a class="home-button home-button-secondary" href="https://github.com/xiaoliziawa" target="_blank" rel="noreferrer">
            GitHub
            <span aria-hidden="true">⌁</span>
          </a>
        </div>

        <div class="home-metrics" aria-label="站点内容概览">
          <div class="home-metric">
            <strong>05</strong>
            <span>内容入口</span>
          </div>
          <div class="home-metric">
            <strong>∞</strong>
            <span>持续更新</span>
          </div>
          <div class="home-metric">
            <strong>01</strong>
            <span>个人世界</span>
          </div>
        </div>
      </div>

      <div class="home-visual" aria-hidden="true">
        <div class="home-visual-stage">
          <span class="home-orbit home-orbit-outer"></span>
          <span class="home-orbit home-orbit-inner"></span>
          <div class="home-visual-core">
            <span class="home-core-glow"></span>
            <img src="/Vue.png" alt="" />
          </div>
          <div class="home-float-card home-float-card-code">
            <span>CODE</span>
            <strong>KubeJS</strong>
          </div>
          <div class="home-float-card home-float-card-mod">
            <span>MODDING</span>
            <strong>NeoForge</strong>
          </div>
          <div class="home-float-card home-float-card-web">
            <span>WEB</span>
            <strong>Vue + GSAP</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="home-section home-routes" aria-labelledby="routes-title">
      <div class="home-section-heading">
        <div>
          <span class="home-section-kicker">Explore the archive</span>
          <h2 id="routes-title">从感兴趣的方向开始</h2>
        </div>
        <p>没有复杂的目录树，先进入一个主题，再沿着内容继续探索。</p>
      </div>

      <div class="home-routes-grid">
        <a
          v-for="route in routes"
          :key="route.link"
          class="home-route-card"
          :class="`home-route-card-${route.accent}`"
          :href="route.link"
        >
          <div class="home-route-topline">
            <span class="home-route-icon">{{ route.icon }}</span>
            <span class="home-route-index">{{ route.index }}</span>
          </div>
          <h3>{{ route.title }}</h3>
          <p>{{ route.description }}</p>
          <span class="home-route-link">进入主题 <span aria-hidden="true">→</span></span>
        </a>
      </div>
    </section>

    <section class="home-section home-insights" aria-labelledby="insights-title">
      <div class="home-section-heading">
        <div>
          <span class="home-section-kicker">Behind the pages</span>
          <h2 id="insights-title">持续构建，也持续记录</h2>
        </div>
        <p>代码提交只是轨迹，真正留下的是解决问题的方法和不断迭代的思路。</p>
      </div>

      <div class="home-insights-grid">
        <article class="home-insight-card home-focus-card">
          <span class="home-card-label">CURRENT FOCUS</span>
          <h3>最近关注</h3>
          <div class="home-focus-list">
            <div v-for="item in focusItems" :key="item.label" class="home-focus-item">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </div>
          </div>
          <a href="/wiki/" class="home-inline-link">打开 Wiki <span aria-hidden="true">↗</span></a>
        </article>

        <article class="home-insight-card home-chart-card">
          <div class="home-chart-heading">
            <div>
              <span class="home-card-label">GITHUB ACTIVITY</span>
              <h3>一周提交节奏</h3>
            </div>
            <span class="home-live-indicator">Live</span>
          </div>
          <div class="home-chart-container">
            <GitHubChart />
          </div>
        </article>
      </div>
    </section>

    <section class="home-cta home-insight-card" aria-label="继续探索">
      <div>
        <span class="home-section-kicker">Keep exploring</span>
        <h2>下一篇内容，也许正好解决你的问题。</h2>
      </div>
      <a class="home-button home-button-primary" href="/cards/">
        浏览全部导航
        <span aria-hidden="true">→</span>
      </a>
    </section>
  </main>
</template>

<style scoped>
.home-page {
  --home-accent: #5eead4;
  --home-accent-strong: #14b8a6;
  --home-violet: #a78bfa;
  --home-surface: color-mix(in srgb, var(--vp-c-bg-soft) 76%, transparent);
  position: relative;
  isolation: isolate;
  margin: 0 auto;
  max-width: 1280px;
  color: var(--vp-c-text-1);
}

.home-background {
  position: absolute;
  inset: -80px calc(50% - 50vw) 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.home-grid {
  position: absolute;
  inset: 0;
  opacity: 0.32;
  background-image:
    linear-gradient(color-mix(in srgb, var(--vp-c-divider) 34%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--vp-c-divider) 34%, transparent) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, black, transparent 78%);
}

.home-orb {
  position: absolute;
  display: block;
  border-radius: 999px;
  filter: blur(8px);
  opacity: 0.28;
}

.home-orb-one {
  top: 4%;
  right: -8%;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, color-mix(in srgb, var(--home-accent) 58%, transparent), transparent 68%);
  will-change: transform;
}

.home-orb-two {
  top: 42%;
  left: -16%;
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, color-mix(in srgb, var(--home-violet) 42%, transparent), transparent 68%);
}

.home-hero {
  min-height: min(780px, calc(100vh - var(--vp-nav-height)));
  padding: clamp(72px, 10vw, 132px) 0 96px;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr);
  align-items: center;
  gap: clamp(48px, 7vw, 96px);
}

.home-hero-copy {
  position: relative;
  z-index: 2;
}

.home-eyebrow,
.home-section-kicker,
.home-card-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.home-eyebrow {
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 26px;
  color: var(--vp-c-text-2);
}

.home-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--home-accent-strong);
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--home-accent) 16%, transparent);
}

.home-title {
  margin: 0;
  border: 0;
  padding: 0;
  font-size: clamp(48px, 6.25vw, 88px);
  font-weight: 800;
  line-height: 0.98;
  letter-spacing: -0.065em;
}

.home-title-line {
  display: block;
  width: fit-content;
  will-change: transform, opacity;
}

.home-title-accent {
  padding-right: 0.08em;
  color: transparent;
  background: linear-gradient(110deg, var(--home-accent-strong), #60a5fa 52%, var(--home-violet));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.home-summary {
  max-width: 650px;
  margin: 30px 0 0;
  color: var(--vp-c-text-2);
  font-size: clamp(16px, 1.5vw, 19px);
  line-height: 1.82;
}

.home-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 34px;
}

.home-button {
  min-height: 50px;
  padding: 0 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none !important;
  transition: transform 220ms ease, border-color 220ms ease, background-color 220ms ease, box-shadow 220ms ease !important;
}

.home-button:hover {
  transform: translateY(-3px);
}

.home-button-primary {
  color: #062e2a !important;
  background: linear-gradient(135deg, #99f6e4, #5eead4 54%, #67e8f9);
  box-shadow: 0 14px 36px rgba(20, 184, 166, 0.22);
}

.home-button-primary:hover {
  box-shadow: 0 18px 44px rgba(20, 184, 166, 0.32);
}

.home-button-secondary {
  color: var(--vp-c-text-1) !important;
  border-color: var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg-soft) 70%, transparent);
  backdrop-filter: blur(16px);
}

.home-button-secondary:hover {
  border-color: color-mix(in srgb, var(--home-accent-strong) 48%, var(--vp-c-divider));
}

.home-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}

.home-metric {
  min-width: 100px;
  display: grid;
  gap: 3px;
}

.home-metric strong {
  font-size: 22px;
  line-height: 1;
}

.home-metric span {
  color: var(--vp-c-text-3);
  font-size: 12px;
}

.home-visual {
  position: relative;
  min-height: 520px;
  display: grid;
  place-items: center;
}

.home-visual-stage {
  position: relative;
  width: min(100%, 500px);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  will-change: transform, opacity;
}

.home-visual-stage::before {
  content: '';
  position: absolute;
  inset: 10%;
  border-radius: 34% 66% 62% 38% / 42% 38% 62% 58%;
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--home-accent) 14%, transparent), color-mix(in srgb, var(--home-violet) 10%, transparent)),
    color-mix(in srgb, var(--vp-c-bg-soft) 66%, transparent);
  border: 1px solid color-mix(in srgb, var(--home-accent) 28%, var(--vp-c-divider));
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.22), 0 32px 90px rgba(15, 23, 42, 0.14);
  backdrop-filter: blur(22px);
  transform: rotate(-8deg);
}

.home-orbit {
  position: absolute;
  border: 1px solid color-mix(in srgb, var(--home-accent) 28%, transparent);
  border-radius: 50%;
}

.home-orbit-outer {
  inset: 3%;
  transform: rotate(18deg) scaleY(0.72);
}

.home-orbit-inner {
  inset: 20%;
  border-style: dashed;
  transform: rotate(-24deg) scaleY(0.78);
}

.home-visual-core {
  position: relative;
  z-index: 2;
  width: 210px;
  height: 210px;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--home-accent) 45%, var(--vp-c-divider));
  border-radius: 50%;
  background: color-mix(in srgb, var(--vp-c-bg) 84%, transparent);
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);
  will-change: transform;
}

.home-visual-core img {
  position: relative;
  z-index: 2;
  width: 118px;
  height: 118px;
  object-fit: contain;
  filter: drop-shadow(0 16px 28px rgba(20, 184, 166, 0.22));
}

.home-core-glow {
  position: absolute;
  inset: 12%;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--home-accent) 32%, transparent), transparent 68%);
  filter: blur(14px);
}

.home-float-card {
  position: absolute;
  z-index: 3;
  min-width: 138px;
  padding: 14px 16px;
  display: grid;
  gap: 4px;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 84%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, var(--vp-c-bg) 78%, transparent);
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(18px);
}

.home-float-card span {
  color: var(--vp-c-text-3);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.home-float-card strong {
  font-size: 13px;
}

.home-float-card-code {
  top: 13%;
  left: 0;
}

.home-float-card-mod {
  right: -2%;
  top: 29%;
}

.home-float-card-web {
  bottom: 11%;
  left: 10%;
}

.home-section {
  padding: 96px 0;
}

.home-section-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
  align-items: end;
  gap: 42px;
  margin-bottom: 42px;
}

.home-section-kicker,
.home-card-label {
  color: var(--home-accent-strong);
}

.home-section-heading h2,
.home-cta h2 {
  margin: 8px 0 0;
  border: 0;
  padding: 0;
  font-size: clamp(32px, 4vw, 50px);
  line-height: 1.08;
  letter-spacing: -0.045em;
}

.home-section-heading p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.75;
}

.home-routes-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 16px;
}

.home-route-card {
  --route-accent: var(--home-accent);
  grid-column: span 4;
  min-height: 286px;
  padding: 26px;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vp-c-divider);
  border-radius: 24px;
  color: var(--vp-c-text-1) !important;
  background:
    radial-gradient(circle at 90% 0%, color-mix(in srgb, var(--route-accent) 14%, transparent), transparent 38%),
    var(--home-surface);
  text-decoration: none !important;
  overflow: hidden;
  backdrop-filter: blur(18px);
  transition: transform 240ms ease, border-color 240ms ease, box-shadow 240ms ease !important;
  will-change: transform, opacity;
}

.home-route-card:nth-child(4),
.home-route-card:nth-child(5) {
  grid-column: span 6;
}

.home-route-card:hover {
  transform: translateY(-8px);
  border-color: color-mix(in srgb, var(--route-accent) 54%, var(--vp-c-divider));
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
}

.home-route-card-violet { --route-accent: #a78bfa; }
.home-route-card-orange { --route-accent: #fb923c; }
.home-route-card-blue { --route-accent: #60a5fa; }
.home-route-card-rose { --route-accent: #fb7185; }

.home-route-topline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.home-route-icon {
  min-width: 54px;
  height: 54px;
  padding: 0 10px;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--route-accent) 38%, var(--vp-c-divider));
  border-radius: 15px;
  color: color-mix(in srgb, var(--route-accent) 78%, var(--vp-c-text-1));
  background: color-mix(in srgb, var(--route-accent) 10%, transparent);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  font-weight: 800;
}

.home-route-index {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
}

.home-route-card h3 {
  margin: auto 0 10px;
  font-size: 24px;
  letter-spacing: -0.025em;
}

.home-route-card p {
  min-height: 52px;
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.65;
}

.home-route-link {
  margin-top: 22px;
  display: flex;
  justify-content: space-between;
  color: color-mix(in srgb, var(--route-accent) 68%, var(--vp-c-text-1));
  font-size: 13px;
  font-weight: 700;
}

.home-insights-grid {
  display: grid;
  grid-template-columns: minmax(280px, 0.72fr) minmax(0, 1.28fr);
  gap: 18px;
}

.home-insight-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 26px;
  background: var(--home-surface);
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(18px);
  will-change: transform, opacity;
}

.home-focus-card {
  padding: 30px;
}

.home-focus-card h3,
.home-chart-card h3 {
  margin: 8px 0 0;
  font-size: 25px;
  letter-spacing: -0.03em;
}

.home-focus-list {
  margin: 30px 0;
  display: grid;
}

.home-focus-item {
  padding: 18px 0;
  display: grid;
  gap: 4px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.home-focus-item:first-child {
  padding-top: 0;
}

.home-focus-item span {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
}

.home-focus-item strong {
  font-size: 15px;
}

.home-inline-link {
  color: var(--home-accent-strong) !important;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none !important;
}

.home-chart-card {
  min-width: 0;
  padding: 30px 30px 18px;
}

.home-chart-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.home-live-indicator {
  padding: 6px 10px;
  border: 1px solid color-mix(in srgb, var(--home-accent) 44%, var(--vp-c-divider));
  border-radius: 999px;
  color: var(--home-accent-strong);
  background: color-mix(in srgb, var(--home-accent) 10%, transparent);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.home-chart-container {
  height: 330px;
  margin-top: 14px;
}

.home-cta {
  margin: 68px 0 16px;
  padding: clamp(28px, 5vw, 56px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  background:
    radial-gradient(circle at 12% 0%, color-mix(in srgb, var(--home-accent) 18%, transparent), transparent 38%),
    radial-gradient(circle at 92% 100%, color-mix(in srgb, var(--home-violet) 16%, transparent), transparent 40%),
    var(--home-surface);
}

.home-cta h2 {
  max-width: 760px;
  font-size: clamp(28px, 3.5vw, 44px);
}

:global(.VPHome) {
  margin-bottom: 48px !important;
}

:global(.VPHome::before),
:global(.VPHome::after) {
  display: none !important;
}

:global(.VPHome .vp-doc.container) {
  max-width: 1408px;
}

:global(.VPHome .vp-doc > .home-page h2),
:global(.VPHome .vp-doc > .home-page h3) {
  border: 0;
}

@media (max-width: 959px) {
  .home-hero {
    min-height: auto;
    grid-template-columns: 1fr;
    padding-top: 84px;
  }

  .home-visual {
    min-height: 440px;
  }

  .home-visual-stage {
    width: min(100%, 460px);
  }

  .home-section-heading {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .home-route-card,
  .home-route-card:nth-child(4),
  .home-route-card:nth-child(5) {
    grid-column: span 6;
  }

  .home-route-card:last-child {
    grid-column: 4 / span 6;
  }

  .home-insights-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 639px) {
  .home-hero {
    padding: 64px 0 68px;
    gap: 36px;
  }

  .home-title {
    font-size: clamp(42px, 13vw, 60px);
  }

  .home-summary {
    margin-top: 24px;
    font-size: 15px;
  }

  .home-actions {
    display: grid;
  }

  .home-button {
    width: 100%;
  }

  .home-metrics {
    gap: 18px;
  }

  .home-metric {
    min-width: 82px;
  }

  .home-visual {
    min-height: 350px;
  }

  .home-visual-stage {
    width: 340px;
    max-width: 100%;
  }

  .home-visual-core {
    width: 150px;
    height: 150px;
  }

  .home-visual-core img {
    width: 86px;
    height: 86px;
  }

  .home-float-card {
    min-width: 112px;
    padding: 11px 12px;
  }

  .home-float-card-code {
    left: -2%;
  }

  .home-float-card-mod {
    right: -2%;
  }

  .home-section {
    padding: 70px 0;
  }

  .home-routes-grid {
    display: grid;
    grid-template-columns: 1fr;
  }

  .home-route-card,
  .home-route-card:nth-child(4),
  .home-route-card:nth-child(5),
  .home-route-card:last-child {
    grid-column: auto;
    min-height: 250px;
  }

  .home-focus-card,
  .home-chart-card {
    padding: 24px;
  }

  .home-chart-card {
    padding-bottom: 12px;
  }

  .home-chart-container {
    height: 280px;
    margin: 12px -12px 0;
  }

  .home-cta {
    align-items: stretch;
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-button,
  .home-route-card {
    transition: none !important;
  }
}
</style>
