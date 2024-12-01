import DefaultTheme from 'vitepress/theme'
import HomeContent from './components/HomeContent.vue'
import GitHubChart from './components/GitHubChart.vue'
import Comments from './components/Comments.vue'
import TypewriterHero from './components/TypewriterHero.vue'
import Layout from './Layout.vue'
import { h } from 'vue'
import Contributors from './components/Contributors.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('GitHubChart', GitHubChart)
    app.component('Comments', Comments)
    app.component('HomeContent', HomeContent)
    app.component('TypewriterHero', TypewriterHero)
    app.component('Contributors', Contributors)
  },
  layout: {
    'doc-after': () => h(Contributors)
  }
} 