<template>
  <div class="theme-color-picker">
    <button 
      class="color-picker-toggle" 
      @click="isOpen = !isOpen"
      :title="isOpen ? '关闭主题色选择器' : '打开主题色选择器'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
        <path fill="none" d="M0 0h24v24H0z"/>
        <path d="M12 2c5.522 0 10 3.978 10 8.889a5.558 5.558 0 0 1-5.556 5.555h-1.966c-.922 0-1.667.745-1.667 1.667 0 .422.167.811.422 1.1.267.3.434.689.434 1.122C13.667 21.256 12.9 22 12 22 6.478 22 2 17.522 2 12S6.478 2 12 2zm-1.189 16.111a3.664 3.664 0 0 1 3.667-3.667h1.966A3.558 3.558 0 0 0 20 10.89C20 7.139 16.468 4 12 4a8 8 0 0 0-.676 15.972 3.648 3.648 0 0 1-.513-1.86zM7.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM12 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" :fill="currentThemeColor"/>
      </svg>
    </button>
    
    <div class="color-picker-dropdown" v-show="isOpen">
      <div class="color-picker-title">选择主题色</div>
      
      <div class="theme-category">
        <div class="category-label">经典色彩</div>
        <div class="color-swatches">
          <button 
            v-for="(color, name) in basicThemeColors" 
            :key="name"
            class="color-swatch"
            :class="{ active: currentTheme === name }"
            :style="{ backgroundColor: color.primary }"
            @click="setTheme(name, color)"
            :title="name"
          ></button>
        </div>
      </div>
      
      <div class="theme-category">
        <div class="category-label">特殊主题</div>
        <div class="color-swatches">
          <button 
            v-for="(color, name) in specialThemeColors" 
            :key="name"
            class="color-swatch special-swatch"
            :class="{ 
              active: currentTheme === name,
              'cyberpunk-swatch': name === 'cyberpunk',
              'neon-swatch': name === 'neon',
              'rainbow-swatch': name === 'rainbow',
              'rgb-swatch': name === 'rgb',
              'sunset-swatch': name === 'sunset',
              'ocean-swatch': name === 'ocean',
              'galaxy-swatch': name === 'galaxy',
              'nord-swatch': name === 'nord'
            }"
            @click="setTheme(name, color)"
            :title="getThemeTitle(name)"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const isOpen = ref(false)
const currentTheme = ref('default')

const basicThemeColors = {
  default: { 
    primary: '#3eaf7c', 
    variables: { 
      '--vp-c-brand': '#3eaf7c',
      '--vp-c-brand-light': '#4abf8a',
      '--vp-c-brand-lighter': '#6ccb9a',
      '--vp-c-brand-dark': '#389d70',
      '--vp-c-brand-darker': '#337f5b'
    }
  },
  blue: { 
    primary: '#3b82f6', 
    variables: { 
      '--vp-c-brand': '#3b82f6',
      '--vp-c-brand-light': '#60a5fa',
      '--vp-c-brand-lighter': '#93c5fd',
      '--vp-c-brand-dark': '#2563eb',
      '--vp-c-brand-darker': '#1d4ed8'
    } 
  },
  purple: { 
    primary: '#8b5cf6', 
    variables: { 
      '--vp-c-brand': '#8b5cf6',
      '--vp-c-brand-light': '#a78bfa',
      '--vp-c-brand-lighter': '#c4b5fd',
      '--vp-c-brand-dark': '#7c3aed',
      '--vp-c-brand-darker': '#6d28d9'
    } 
  },
  pink: { 
    primary: '#ec4899', 
    variables: { 
      '--vp-c-brand': '#ec4899',
      '--vp-c-brand-light': '#f472b6',
      '--vp-c-brand-lighter': '#f9a8d4',
      '--vp-c-brand-dark': '#db2777',
      '--vp-c-brand-darker': '#be185d'
    } 
  },
  orange: { 
    primary: '#f97316', 
    variables: { 
      '--vp-c-brand': '#f97316',
      '--vp-c-brand-light': '#fb923c',
      '--vp-c-brand-lighter': '#fdba74',
      '--vp-c-brand-dark': '#ea580c',
      '--vp-c-brand-darker': '#c2410c'
    } 
  },
  red: { 
    primary: '#ef4444', 
    variables: { 
      '--vp-c-brand': '#ef4444',
      '--vp-c-brand-light': '#f87171',
      '--vp-c-brand-lighter': '#fca5a5',
      '--vp-c-brand-dark': '#dc2626',
      '--vp-c-brand-darker': '#b91c1c'
    } 
  },
  amber: { 
    primary: '#f59e0b', 
    variables: { 
      '--vp-c-brand': '#f59e0b',
      '--vp-c-brand-light': '#fbbf24',
      '--vp-c-brand-lighter': '#fcd34d',
      '--vp-c-brand-dark': '#d97706',
      '--vp-c-brand-darker': '#b45309'
    } 
  },
  teal: { 
    primary: '#14b8a6', 
    variables: { 
      '--vp-c-brand': '#14b8a6',
      '--vp-c-brand-light': '#2dd4bf',
      '--vp-c-brand-lighter': '#5eead4',
      '--vp-c-brand-dark': '#0d9488',
      '--vp-c-brand-darker': '#0f766e'
    } 
  },
  lime: { 
    primary: '#84cc16', 
    variables: { 
      '--vp-c-brand': '#84cc16',
      '--vp-c-brand-light': '#a3e635',
      '--vp-c-brand-lighter': '#bef264',
      '--vp-c-brand-dark': '#65a30d',
      '--vp-c-brand-darker': '#4d7c0f'
    } 
  },
}

const specialThemeColors = {
  cyberpunk: {
    primary: '#f700ff', 
    variables: { 
      '--vp-c-brand': '#f700ff',
      '--vp-c-brand-light': '#ff2cf7',
      '--vp-c-brand-lighter': '#ff56f9',
      '--vp-c-brand-dark': '#d600d9',
      '--vp-c-brand-darker': '#b100b3',
      '--vp-c-bg-alt': '#05001e',
      '--vp-c-bg': '#0c0034',
      '--vp-c-bg-soft': '#150052',
      '--vp-c-bg-mute': '#1f007a',
      '--vp-c-text-1': '#fcff5d',
      '--vp-c-text-2': '#fdff93',
      '--vp-c-text-3': '#fdffc3'
    },
    customCSS: `
      :root {
        --neon-highlight: 0 0 10px #f700ff, 0 0 20px rgba(247, 0, 255, 0.5);
      }
      .vp-doc a, .vp-doc a > code, .VPNavBarMenuLink.active, .VPNavBarMenuLink:hover, .edit-link-button .vp-link, .vp-doc .custom-block a {
        text-shadow: var(--neon-highlight);
      }
      .VPButton.brand {
        box-shadow: var(--neon-highlight);
      }
    `
  },
  neon: {
    primary: '#39ff14', 
    variables: { 
      '--vp-c-brand': '#39ff14',
      '--vp-c-brand-light': '#65ff47',
      '--vp-c-brand-lighter': '#95ff80',
      '--vp-c-brand-dark': '#15e900',
      '--vp-c-brand-darker': '#11cc00',
      '--vp-c-bg-alt': '#020a01',
      '--vp-c-bg': '#041002',
      '--vp-c-bg-soft': '#071804',
      '--vp-c-bg-mute': '#0a2406',
      '--vp-c-text-1': '#f0f0ff',
      '--vp-c-text-2': '#d8d8ff',
      '--vp-c-text-3': '#bbbbff'
    },
    customCSS: `
      :root {
        --neon-glow: 0 0 10px #39ff14, 0 0 20px rgba(57, 255, 20, 0.5);
      }
      .vp-doc a, .vp-doc a > code, .VPNavBarMenuLink.active, .VPNavBarMenuLink:hover, .edit-link-button .vp-link, .vp-doc .custom-block a {
        text-shadow: var(--neon-glow);
      }
      .VPButton.brand {
        box-shadow: var(--neon-glow);
      }
    `
  },
  rainbow: {
    primary: '#ff6b6b', 
    variables: { 
      '--vp-c-brand': '#ff6b6b',
      '--vp-c-brand-light': '#ff8a8a',
      '--vp-c-brand-lighter': '#ffa8a8',
      '--vp-c-brand-dark': '#ff5252',
      '--vp-c-brand-darker': '#ff3939'
    },
    customCSS: `
      .vp-doc a, .vp-doc a > code, .VPNavBarMenuLink.active, .VPNavBarMenuLink:hover, .edit-link-button .vp-link, .vp-doc .custom-block a {
        background-image: linear-gradient(90deg, #ff0000, #ffa500, #ffff00, #008000, #0000ff, #4b0082, #ee82ee);
        background-size: 200% auto;
        color: transparent;
        -webkit-background-clip: text;
        background-clip: text;
        animation: rainbow 6s linear infinite;
      }
      
      @keyframes rainbow { 
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
      
      .VPButton.brand {
        background-image: linear-gradient(90deg, #ff0000, #ffa500, #ffff00, #008000, #0000ff, #4b0082, #ee82ee);
        background-size: 200% auto;
        animation: rainbow 6s linear infinite;
        border: none;
      }
    `
  },
  rgb: {
    primary: '#ff0000', 
    variables: { 
      '--vp-c-brand': '#ff0000',
      '--vp-c-brand-light': '#ff3333',
      '--vp-c-brand-lighter': '#ff6666',
      '--vp-c-brand-dark': '#cc0000',
      '--vp-c-brand-darker': '#990000'
    },
    customCSS: `
      .vp-doc a, .vp-doc a > code, .VPNavBarMenuLink.active, .VPNavBarMenuLink:hover, .edit-link-button .vp-link, .vp-doc .custom-block a {
        animation: rgb-shift 3s infinite;
      }
      
      .VPButton.brand {
        animation: rgb-shift 3s infinite;
        border: none;
      }
      
      @keyframes rgb-shift {
        0% { color: #ff0000; --vp-c-brand: #ff0000; background-color: #ff0000; }
        33% { color: #00ff00; --vp-c-brand: #00ff00; background-color: #00ff00; }
        66% { color: #0000ff; --vp-c-brand: #0000ff; background-color: #0000ff; }
        100% { color: #ff0000; --vp-c-brand: #ff0000; background-color: #ff0000; }
      }
    `
  },
  sunset: {
    primary: '#fd746c', 
    variables: { 
      '--vp-c-brand': '#fd746c',
      '--vp-c-brand-light': '#fe8d86',
      '--vp-c-brand-lighter': '#fea5a0',
      '--vp-c-brand-dark': '#fd5b52',
      '--vp-c-brand-darker': '#fc4439'
    },
    customCSS: `
      :root {
        --sunset-gradient: linear-gradient(to right, #ff9966, #ff5e62);
      }
      .vp-doc a, .vp-doc a > code, .VPNavBarMenuLink.active, .VPNavBarMenuLink:hover, .edit-link-button .vp-link, .vp-doc .custom-block a {
        background: var(--sunset-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .VPButton.brand {
        background: var(--sunset-gradient);
        border: none;
      }
    `
  },
  ocean: {
    primary: '#1a78c2', 
    variables: { 
      '--vp-c-brand': '#1a78c2',
      '--vp-c-brand-light': '#3389ce',
      '--vp-c-brand-lighter': '#4c9ada',
      '--vp-c-brand-dark': '#1667a9',
      '--vp-c-brand-darker': '#125591'
    },
    customCSS: `
      :root {
        --ocean-gradient: linear-gradient(to right, #1a78c2, #1bcedf);
      }
      .vp-doc a, .vp-doc a > code, .VPNavBarMenuLink.active, .VPNavBarMenuLink:hover, .edit-link-button .vp-link, .vp-doc .custom-block a {
        background: var(--ocean-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .VPButton.brand {
        background: var(--ocean-gradient);
        border: none;
      }
    `
  },
  galaxy: {
    primary: '#8f4fbc', 
    variables: { 
      '--vp-c-brand': '#8f4fbc',
      '--vp-c-brand-light': '#a26fc7',
      '--vp-c-brand-lighter': '#b58fd2',
      '--vp-c-brand-dark': '#7c3fa8',
      '--vp-c-brand-darker': '#693094'
    },
    customCSS: `
      :root {
        --galaxy-gradient: linear-gradient(to right, #4b6cb7, #8f4fbc, #c061cb);
      }
      .vp-doc a, .vp-doc a > code, .VPNavBarMenuLink.active, .VPNavBarMenuLink:hover, .edit-link-button .vp-link, .vp-doc .custom-block a {
        background: var(--galaxy-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .VPButton.brand {
        background: var(--galaxy-gradient);
        border: none;
      }
    `
  },
  nord: {
    primary: '#88c0d0', 
    variables: { 
      '--vp-c-brand': '#88c0d0',
      '--vp-c-brand-light': '#a0ceda',
      '--vp-c-brand-lighter': '#b7dce3',
      '--vp-c-brand-dark': '#6fb2c6',
      '--vp-c-brand-darker': '#57a4bd',
      '--vp-c-bg-alt': '#242933',
      '--vp-c-bg': '#2e3440',
      '--vp-c-bg-soft': '#3b4252',
      '--vp-c-bg-mute': '#434c5e',
      '--vp-c-text-1': '#eceff4',
      '--vp-c-text-2': '#e5e9f0',
      '--vp-c-text-3': '#d8dee9'
    }
  }
}

const themeColors = {
  ...basicThemeColors,
  ...specialThemeColors
}

const currentThemeObject = computed(() => {
  return themeColors[currentTheme.value] || themeColors.default
})

const currentThemeColor = computed(() => {
  return currentThemeObject.value.primary
})

function getThemeTitle(name) {
  const titles = {
    cyberpunk: '赛博朋克主题',
    neon: '霓虹灯主题',
    rainbow: '彩虹渐变主题',
    rgb: 'RGB循环主题',
    sunset: '日落渐变主题',
    ocean: '海洋渐变主题',
    galaxy: '星系渐变主题',
    nord: '北欧风格主题'
  }
  return titles[name] || name
}

function applyCustomCSS(cssText) {
  let styleElement = document.getElementById('theme-custom-css')
  
  if (!styleElement) {
    styleElement = document.createElement('style')
    styleElement.id = 'theme-custom-css'
    document.head.appendChild(styleElement)
  }
  
  styleElement.textContent = cssText || ''
}

function setTheme(name, color) {
  const previousTheme = currentTheme.value
  const previousThemeChangesBackground = themeColors[previousTheme]?.variables && 
    (themeColors[previousTheme].variables['--vp-c-bg'] || 
     themeColors[previousTheme].variables['--vp-c-bg-alt']);
  
  const currentThemeChangesBackground = color.variables && 
    (color.variables['--vp-c-bg'] || 
     color.variables['--vp-c-bg-alt']);
  
  localStorage.setItem('vitepress-theme-color', name)
  
  if ((previousThemeChangesBackground && !currentThemeChangesBackground) || 
      (!previousThemeChangesBackground && currentThemeChangesBackground) ||
      (previousThemeChangesBackground && currentThemeChangesBackground)) {
    currentTheme.value = name
    
    sessionStorage.setItem('theme-refresh', 'true')
    
    window.location.reload()
    return
  }
  
  currentTheme.value = name
  
  const root = document.documentElement
  
  Object.entries(color.variables).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
  
  applyCustomCSS(color.customCSS || '')
  
  isOpen.value = false
}

function handleClickOutside(event) {
  const picker = document.querySelector('.theme-color-picker')
  if (picker && !picker.contains(event.target) && isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('vitepress-theme-color')
  
  const isThemeRefresh = sessionStorage.getItem('theme-refresh') === 'true'
  if (isThemeRefresh) {
    sessionStorage.removeItem('theme-refresh')
  }
  
  if (savedTheme && themeColors[savedTheme]) {
    if (isThemeRefresh) {
      currentTheme.value = savedTheme
      
      const root = document.documentElement
      const color = themeColors[savedTheme]
      
      Object.entries(color.variables).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })
      
      applyCustomCSS(color.customCSS || '')
    } else {
      setTheme(savedTheme, themeColors[savedTheme])
    }
  }
  
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.theme-color-picker {
  position: relative;
  z-index: 100;
}

.color-picker-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.color-picker-toggle:hover {
  background-color: var(--vp-c-bg-soft);
}

.color-picker-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  padding: 12px;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  box-shadow: var(--vp-shadow-2);
  min-width: 240px;
}

.color-picker-dropdown::before {
  content: '';
  position: absolute;
  top: -4px;
  right: 10px;
  width: 12px;
  height: 12px;
  background-color: var(--vp-c-bg-soft);
  transform: rotate(45deg);
}

.color-picker-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--vp-c-text-1);
  text-align: center;
}

.theme-category {
  margin-bottom: 16px;
}

.category-label {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--vp-c-text-2);
}

.color-swatches {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-bg);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.color-swatch:hover {
  transform: scale(1.1);
  box-shadow: 0 0 0 2px var(--vp-c-bg), 0 0 0 4px currentColor;
}

.color-swatch.active {
  box-shadow: 0 0 0 2px var(--vp-c-bg), 0 0 0 4px currentColor;
}

/* 特殊主题样式 */
.special-swatch {
  position: relative;
  overflow: hidden;
}

.cyberpunk-swatch {
  background: linear-gradient(45deg, #f700ff, #04eefd);
  border: 2px solid #fdff00;
  box-shadow: 0 0 8px rgba(247, 0, 255, 0.8);
}

.neon-swatch {
  background: #39ff14;
  border: 2px solid #f0f0ff;
  box-shadow: 0 0 8px rgba(57, 255, 20, 0.8);
}

.rainbow-swatch {
  background: linear-gradient(90deg, #ff0000, #ffa500, #ffff00, #008000, #0000ff, #4b0082, #ee82ee);
  background-size: 200% auto;
  animation: rainbow-bg 6s linear infinite;
}

.rgb-swatch {
  animation: rgb-shift-bg 3s infinite;
}

.sunset-swatch {
  background: linear-gradient(45deg, #ff9966, #ff5e62);
}

.ocean-swatch {
  background: linear-gradient(45deg, #1a78c2, #1bcedf);
}

.galaxy-swatch {
  background: linear-gradient(45deg, #4b6cb7, #8f4fbc, #c061cb);
}

.nord-swatch {
  background: linear-gradient(45deg, #88c0d0, #5e81ac);
}

@keyframes rainbow-bg { 
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

@keyframes rgb-shift-bg {
  0% { background-color: #ff0000; }
  33% { background-color: #00ff00; }
  66% { background-color: #0000ff; }
  100% { background-color: #ff0000; }
}

@media (max-width: 640px) {
  .color-swatches {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .color-swatch {
    width: 28px;
    height: 28px;
  }
}
</style> 