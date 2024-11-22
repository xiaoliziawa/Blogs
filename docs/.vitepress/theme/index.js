import DefaultTheme from 'vitepress/theme'
import HomeHero from './components/HomeHero.vue'
import GitHubChart from './components/GitHubChart.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeHero', HomeHero)
    app.component('GitHubChart', GitHubChart)
  }
} 