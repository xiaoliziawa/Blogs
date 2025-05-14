import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import HomeContent from './components/HomeContent.vue'
import GitHubChart from './components/GitHubChart.vue'
import Comments from './components/Comments.vue'
import TypewriterHero from './components/TypewriterHero.vue'
import Layout from './Layout.vue'
import Contributors from './components/Contributors.vue'
import CursorHighlight from './components/CursorHighlight.vue'
import CollapsibleCodeBlock from './components/CollapsibleCodeBlock.vue'
import TimeLine from './components/TimeLine.vue'
import EnhancedImageViewer from './components/EnhancedImageViewer.vue'
import MermaidChart from './components/MermaidChart.vue'
import EChartsComponent from './components/EChartsComponent.vue'
import FeatureBox from './components/FeatureBox.vue'
import ThemeColorPicker from './components/ThemeColorPicker.vue'
import AdBanner from './components/AdBanner.vue'
import ModInfo from './components/ModInfo.vue'
import './styles/index.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('GitHubChart', GitHubChart)
    app.component('Comments', Comments)
    app.component('HomeContent', HomeContent)
    app.component('TypewriterHero', TypewriterHero)
    app.component('Contributors', Contributors)
    app.component('CursorHighlight', CursorHighlight)
    app.component('CollapsibleCodeBlock', CollapsibleCodeBlock)
    app.component('TimeLine', TimeLine)
    app.component('EnhancedImageViewer', EnhancedImageViewer)
    app.component('MermaidChart', MermaidChart)
    app.component('EChartsComponent', EChartsComponent)
    app.component('FeatureBox', FeatureBox)
    app.component('ThemeColorPicker', ThemeColorPicker)
    app.component('AdBanner', AdBanner)
    app.component('ModInfo', ModInfo)
    
    if (typeof window !== 'undefined') {
      window.addEventListener('DOMContentLoaded', () => {
        // 初始处理
        addTitlesToLongTexts()
        
        const observer = new MutationObserver((mutations) => {
          addTitlesToLongTexts()
        })
        
        setTimeout(() => {
          const sidebar = document.querySelector('.VPSidebar')
          if (sidebar) {
            observer.observe(sidebar, { 
              childList: true, 
              subtree: true 
            })
          }
        }, 500)
      })
    }
  },
  layout: {
    'doc-after': () => h(Contributors)
  }
}

function addTitlesToLongTexts() {
  document.querySelectorAll('.VPSidebarItem .text').forEach(el => {
    if (el.scrollWidth > el.clientWidth) {
      if (!el.hasAttribute('title')) {
        el.setAttribute('title', el.textContent.trim())
      }
    }
  })
} 