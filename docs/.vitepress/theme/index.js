import DefaultTheme from 'vitepress/theme'
import HomeHero from './components/HomeHero.vue'
import GitHubChart from './components/GitHubChart.vue'
import Comments from './components/Comments.vue'
import Layout from './Layout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HomeHero', HomeHero)
    app.component('GitHubChart', GitHubChart)
    app.component('Comments', Comments)
  }
} 