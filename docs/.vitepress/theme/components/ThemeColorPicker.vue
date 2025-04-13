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
              'nord-swatch': name === 'nord',
              'matrix-swatch': name === 'matrix',
              'retrowave-swatch': name === 'retrowave',
              'coffee-swatch': name === 'coffee',
              'mint-swatch': name === 'mint',
              'synthwave-swatch': name === 'synthwave',
              'sakura-swatch': name === 'sakura',
              'forest-swatch': name === 'forest',
              'autumn-swatch': name === 'autumn',
              'glacier-swatch': name === 'glacier'
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
  indigo: { 
    primary: '#6366f1', 
    variables: { 
      '--vp-c-brand': '#6366f1',
      '--vp-c-brand-light': '#818cf8',
      '--vp-c-brand-lighter': '#a5b4fc',
      '--vp-c-brand-dark': '#4f46e5',
      '--vp-c-brand-darker': '#4338ca'
    } 
  },
  emerald: { 
    primary: '#10b981', 
    variables: { 
      '--vp-c-brand': '#10b981',
      '--vp-c-brand-light': '#34d399',
      '--vp-c-brand-lighter': '#6ee7b7',
      '--vp-c-brand-dark': '#059669',
      '--vp-c-brand-darker': '#047857'
    } 
  },
  rose: { 
    primary: '#f43f5e', 
    variables: { 
      '--vp-c-brand': '#f43f5e',
      '--vp-c-brand-light': '#fb7185',
      '--vp-c-brand-lighter': '#fda4af',
      '--vp-c-brand-dark': '#e11d48',
      '--vp-c-brand-darker': '#be123c'
    } 
  },
  slate: { 
    primary: '#64748b', 
    variables: { 
      '--vp-c-brand': '#64748b',
      '--vp-c-brand-light': '#94a3b8',
      '--vp-c-brand-lighter': '#cbd5e1',
      '--vp-c-brand-dark': '#475569',
      '--vp-c-brand-darker': '#334155'
    } 
  },
  sky: { 
    primary: '#0ea5e9', 
    variables: { 
      '--vp-c-brand': '#0ea5e9',
      '--vp-c-brand-light': '#38bdf8',
      '--vp-c-brand-lighter': '#7dd3fc',
      '--vp-c-brand-dark': '#0284c7',
      '--vp-c-brand-darker': '#0369a1'
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
      '--vp-c-brand-darker': '#990000',
      '--vp-c-bg-alt': '#121212',
      '--vp-c-bg': '#1a1a1a',
      '--vp-c-bg-soft': '#242424',
      '--vp-c-bg-mute': '#2c2c2c',
    },
    customCSS: `
      .vp-doc a, .vp-doc a > code, .VPNavBarMenuLink.active, .VPNavBarMenuLink:hover, .edit-link-button .vp-link, .vp-doc .custom-block a {
        animation: rgb-text-shift 3s infinite;
      }
      
      .VPButton.brand {
        animation: rgb-button-shift 3s infinite;
        border: none;
      }
      
      @keyframes rgb-text-shift {
        0% { color: #ff0000; }
        33% { color: #00ff00; }
        66% { color: #0000ff; }
        100% { color: #ff0000; }
      }
      
      @keyframes rgb-button-shift {
        0% { background-color: #ff0000; }
        33% { background-color: #00ff00; }
        66% { background-color: #0000ff; }
        100% { background-color: #ff0000; }
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
      '--vp-c-brand-darker': '#fc4439',
      '--vp-c-bg-alt': '#2a1215',
      '--vp-c-bg': '#331518',
      '--vp-c-bg-soft': '#3d181c',
      '--vp-c-bg-mute': '#461c20'
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
      '--vp-c-brand-darker': '#125591',
      '--vp-c-bg-alt': '#0a1928',
      '--vp-c-bg': '#0d1f32',
      '--vp-c-bg-soft': '#12283e',
      '--vp-c-bg-mute': '#183148'
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
      '--vp-c-brand-darker': '#693094',
      '--vp-c-bg-alt': '#10081a',
      '--vp-c-bg': '#150b22',
      '--vp-c-bg-soft': '#1b0d2b',
      '--vp-c-bg-mute': '#221036'
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
  },
  matrix: {
    primary: '#00ff41', 
    variables: { 
      '--vp-c-brand': '#00ff41',
      '--vp-c-brand-light': '#33ff64',
      '--vp-c-brand-lighter': '#66ff87',
      '--vp-c-brand-dark': '#00cc34',
      '--vp-c-brand-darker': '#00992a',
      '--vp-c-bg-alt': '#000900',
      '--vp-c-bg': '#001100',
      '--vp-c-bg-soft': '#001800',
      '--vp-c-bg-mute': '#002200',
      '--vp-c-text-1': '#00ff41',
      '--vp-c-text-2': '#33ff64',
      '--vp-c-text-3': '#66ff87'
    },
    customCSS: `
      :root {
        --matrix-glow: 0 0 2px #00ff41, 0 0 5px rgba(0, 255, 65, 0.5);
      }
      
      body {
        font-family: 'Courier New', monospace;
      }
      
      .vp-doc a, .vp-doc a > code, .VPNavBarMenuLink.active, .VPNavBarMenuLink:hover, .edit-link-button .vp-link, .vp-doc .custom-block a {
        text-shadow: var(--matrix-glow);
      }
      
      .VPButton.brand {
        box-shadow: var(--matrix-glow);
        text-transform: uppercase;
      }
      
      code {
        color: #00ff41 !important;
        background-color: rgba(0, 25, 0, 0.8) !important;
      }
    `
  },
  retrowave: {
    primary: '#ff2afc', 
    variables: { 
      '--vp-c-brand': '#ff2afc',
      '--vp-c-brand-light': '#ff54fd',
      '--vp-c-brand-lighter': '#ff7dfd',
      '--vp-c-brand-dark': '#cc21ca',
      '--vp-c-brand-darker': '#991997',
      '--vp-c-bg-alt': '#190025',
      '--vp-c-bg': '#220030',
      '--vp-c-bg-soft': '#2c003f',
      '--vp-c-bg-mute': '#36004e',
      '--vp-c-text-1': '#00f0ff',
      '--vp-c-text-2': '#44f3ff',
      '--vp-c-text-3': '#88f7ff'
    },
    customCSS: `
      :root {
        --retrowave-glow: 0 0 10px #ff2afc, 0 0 20px rgba(255, 42, 252, 0.5);
        --text-glow: 0 0 10px #00f0ff, 0 0 20px rgba(0, 240, 255, 0.5);
        --retrowave-gradient: linear-gradient(to right, #ff2afc, #00f0ff);
      }
      
      .vp-doc a, .vp-doc a > code, .VPNavBarMenuLink.active, .VPNavBarMenuLink:hover, .edit-link-button .vp-link, .vp-doc .custom-block a {
        text-shadow: var(--text-glow);
      }
      
      .VPButton.brand {
        background: var(--retrowave-gradient);
        box-shadow: var(--retrowave-glow);
        border: none;
      }
      
      h1, h2, h3 {
        text-shadow: var(--retrowave-glow);
      }
    `
  },
  coffee: {
    primary: '#c0a080', 
    variables: { 
      '--vp-c-brand': '#c0a080',
      '--vp-c-brand-light': '#cdb296',
      '--vp-c-brand-lighter': '#dac4ad',
      '--vp-c-brand-dark': '#a88c70',
      '--vp-c-brand-darker': '#907860',
      '--vp-c-bg-alt': '#1c1714',
      '--vp-c-bg': '#241c17',
      '--vp-c-bg-soft': '#2c221c',
      '--vp-c-bg-mute': '#342821',
      '--vp-c-text-1': '#f2e6d8',
      '--vp-c-text-2': '#e8d9c7',
      '--vp-c-text-3': '#d9c5ae'
    },
    customCSS: `
      :root {
        --coffee-gradient: linear-gradient(to right, #c0a080, #8c6c4c);
      }
      
      body {
        font-family: Georgia, serif;
      }
      
      .vp-doc a, .vp-doc a > code, .VPNavBarMenuLink.active, .VPNavBarMenuLink:hover, .edit-link-button .vp-link, .vp-doc .custom-block a {
        background: var(--coffee-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-decoration: underline #c0a080;
      }
      
      .VPButton.brand {
        background: var(--coffee-gradient);
        border: none;
      }
      
      code {
        background-color: rgba(192, 160, 128, 0.1) !important;
      }
    `
  },
  mint: {
    primary: '#82e9de', 
    variables: { 
      '--vp-c-brand': '#82e9de',
      '--vp-c-brand-light': '#9eeee6',
      '--vp-c-brand-lighter': '#baf4ee',
      '--vp-c-brand-dark': '#67d2c7',
      '--vp-c-brand-darker': '#4dbbb0',
      '--vp-c-bg-alt': 'var(--vp-mint-bg-alt)',
      '--vp-c-bg': 'var(--vp-mint-bg)',
      '--vp-c-bg-soft': 'var(--vp-mint-bg-soft)',
      '--vp-c-bg-mute': 'var(--vp-mint-bg-mute)',
      '--vp-c-text-1': 'var(--vp-mint-text-1)',
      '--vp-c-text-2': 'var(--vp-mint-text-2)',
      '--vp-c-text-3': 'var(--vp-mint-text-3)'
    },
    customCSS: `
      :root {
        --vp-mint-bg-alt-light: #f0fcfa;
        --vp-mint-bg-light: #f8fffd;
        --vp-mint-bg-soft-light: #e4f7f4;
        --vp-mint-bg-mute-light: #d0efec;
        --vp-mint-text-1-light: #064e45;
        --vp-mint-text-2-light: #1a726a;
        --vp-mint-text-3-light: #2e8c82;
        
        --vp-mint-bg-alt-dark: #0a2e2a;
        --vp-mint-bg-dark: #0d3b35;
        --vp-mint-bg-soft-dark: #124941;
        --vp-mint-bg-mute-dark: #18574c;
        --vp-mint-text-1-dark: #82e9de;
        --vp-mint-text-2-dark: #65dbd0;
        --vp-mint-text-3-dark: #48cdc1;
        
        --vp-mint-bg-alt: var(--vp-mint-bg-alt-light);
        --vp-mint-bg: var(--vp-mint-bg-light);
        --vp-mint-bg-soft: var(--vp-mint-bg-soft-light);
        --vp-mint-bg-mute: var(--vp-mint-bg-mute-light);
        --vp-mint-text-1: var(--vp-mint-text-1-light);
        --vp-mint-text-2: var(--vp-mint-text-2-light);
        --vp-mint-text-3: var(--vp-mint-text-3-light);
      }
      
      .dark {
        --vp-mint-bg-alt: var(--vp-mint-bg-alt-dark);
        --vp-mint-bg: var(--vp-mint-bg-dark);
        --vp-mint-bg-soft: var(--vp-mint-bg-soft-dark);
        --vp-mint-bg-mute: var(--vp-mint-bg-mute-dark);
        --vp-mint-text-1: var(--vp-mint-text-1-dark);
        --vp-mint-text-2: var(--vp-mint-text-2-dark);
        --vp-mint-text-3: var(--vp-mint-text-3-dark);
      }
      
      body {
        font-family: 'Nunito', sans-serif;
      }
      
      .vp-doc a, .vp-doc a > code, .VPNavBarMenuLink.active, .VPNavBarMenuLink:hover, .edit-link-button .vp-link, .vp-doc .custom-block a {
        color: var(--vp-mint-text-1);
        font-weight: 600;
        text-decoration: none;
        border-bottom: 2px solid #82e9de;
      }
      
      .VPButton.brand {
        box-shadow: 0 4px 6px rgba(130, 233, 222, 0.25);
      }
      
      .dark .VPButton.brand {
        box-shadow: 0 4px 10px rgba(130, 233, 222, 0.15);
      }
      
      code {
        background-color: rgba(130, 233, 222, 0.2) !important;
      }
      
      .dark code {
        background-color: rgba(130, 233, 222, 0.1) !important;
      }
    `
  },
  synthwave: {
    primary: '#fd3777', 
    variables: { 
      '--vp-c-brand': '#fd3777',
      '--vp-c-brand-light': '#fd5f93',
      '--vp-c-brand-lighter': '#fd86ae',
      '--vp-c-brand-dark': '#e91e63',
      '--vp-c-brand-darker': '#c2185b',
      '--vp-c-bg-alt': '#150934',
      '--vp-c-bg': '#1f0d47',
      '--vp-c-bg-soft': '#2c145f',
      '--vp-c-bg-mute': '#3c1b85',
      '--vp-c-text-1': '#ffffff',
      '--vp-c-text-2': '#e3e3ff',
      '--vp-c-text-3': '#c7c7ff'
    },
    customCSS: `
      :root {
        --synthwave-gradient: linear-gradient(to right, #fc3b7d, #7303c0, #03a9f4);
      }
      
      .vp-doc a, .vp-doc a > code, .VPNavBarMenuLink.active, .VPNavBarMenuLink:hover, .edit-link-button .vp-link, .vp-doc .custom-block a {
        background: var(--synthwave-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 8px rgba(253, 55, 119, 0.4);
      }
      
      .VPButton.brand {
        background: var(--synthwave-gradient);
        border: none;
        box-shadow: 0 0 10px rgba(253, 55, 119, 0.5), 0 0 20px rgba(253, 55, 119, 0.3);
      }
      
      h1, h2, h3 {
        position: relative;
      }
      
      h1::after, h2::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 1px;
        background: var(--synthwave-gradient);
      }
    `
  },
  sakura: {
    primary: '#ff7eb6',
    variables: {
      '--vp-c-brand': '#ff7eb6',
      '--vp-c-brand-light': '#ffa3c9',
      '--vp-c-brand-lighter': '#ffc8dc',
      '--vp-c-brand-dark': '#ff599d',
      '--vp-c-brand-darker': '#ff3384'
    },
    customCSS: `
      :root {
        --sakura-gradient: linear-gradient(45deg, #ff7eb6, #ff9ebd);
        --vp-c-bg-alt: #fff5f8;
        --vp-c-bg: #fff9fb;
        --vp-c-bg-soft: #ffeef3;
        --vp-c-bg-mute: #ffe4ec;
        --vp-c-text-1: #2c0014;
        --vp-c-text-2: #4d0025;
        --vp-c-text-3: #6e0035;
      }
      .dark {
        --sakura-gradient: linear-gradient(45deg, #ff7eb6, #ff5c9d);
        --vp-c-bg-alt: #2c0014;
        --vp-c-bg: #3d001c;
        --vp-c-bg-soft: #4e0024;
        --vp-c-bg-mute: #5f002c;
        --vp-c-text-1: #ffd9e9;
        --vp-c-text-2: #ffb3d1;
        --vp-c-text-3: #ff8cba;
      }
      .vp-doc a, .vp-doc a > code, .VPNavBarMenuLink.active, .VPNavBarMenuLink:hover {
        background: var(--sakura-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .VPButton.brand {
        background: var(--sakura-gradient);
        border: none;
        box-shadow: 0 4px 10px rgba(255, 126, 182, 0.3);
      }
      .dark .VPButton.brand {
        box-shadow: 0 4px 10px rgba(255, 126, 182, 0.15);
      }
    `
  },
  forest: {
    primary: '#2ecc71',
    variables: {
      '--vp-c-brand': '#2ecc71',
      '--vp-c-brand-light': '#45d983',
      '--vp-c-brand-lighter': '#5ce695',
      '--vp-c-brand-dark': '#27ae60',
      '--vp-c-brand-darker': '#219150'
    },
    customCSS: `
      :root {
        --forest-gradient: linear-gradient(45deg, #2ecc71, #27ae60);
        --vp-c-bg-alt: #f0f8f3;
        --vp-c-bg: #f5faf7;
        --vp-c-bg-soft: #e8f5ec;
        --vp-c-bg-mute: #dff2e4;
        --vp-c-text-1: #0a2f1a;
        --vp-c-text-2: #164a2c;
        --vp-c-text-3: #22653d;
      }
      .dark {
        --forest-gradient: linear-gradient(45deg, #2ecc71, #219150);
        --vp-c-bg-alt: #0a2f1a;
        --vp-c-bg: #0d3920;
        --vp-c-bg-soft: #104426;
        --vp-c-bg-mute: #134f2c;
        --vp-c-text-1: #c8f0d5;
        --vp-c-text-2: #9ee3b4;
        --vp-c-text-3: #74d693;
      }
      .vp-doc a, .vp-doc a > code {
        background: var(--forest-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .VPButton.brand {
        background: var(--forest-gradient);
        border: none;
        box-shadow: 0 4px 10px rgba(46, 204, 113, 0.3);
      }
      .dark .VPButton.brand {
        box-shadow: 0 4px 10px rgba(46, 204, 113, 0.15);
      }
    `
  },
  autumn: {
    primary: '#e67e22',
    variables: {
      '--vp-c-brand': '#e67e22',
      '--vp-c-brand-light': '#f39c12',
      '--vp-c-brand-lighter': '#f1c40f',
      '--vp-c-brand-dark': '#d35400',
      '--vp-c-brand-darker': '#c0392b'
    },
    customCSS: `
      :root {
        --autumn-gradient: linear-gradient(45deg, #e67e22, #f39c12, #f1c40f);
        --vp-c-bg-alt: #fdf6f0;
        --vp-c-bg: #fef8f3;
        --vp-c-bg-soft: #fceee2;
        --vp-c-bg-mute: #fae5d3;
        --vp-c-text-1: #2c1810;
        --vp-c-text-2: #4d2a1c;
        --vp-c-text-3: #6e3c28;
      }
      .dark {
        --autumn-gradient: linear-gradient(45deg, #e67e22, #d35400, #c0392b);
        --vp-c-bg-alt: #2c1810;
        --vp-c-bg: #3d2115;
        --vp-c-bg-soft: #4e2a1a;
        --vp-c-bg-mute: #5f331f;
        --vp-c-text-1: #ffe0cc;
        --vp-c-text-2: #ffc299;
        --vp-c-text-3: #ffa366;
      }
      .vp-doc a, .vp-doc a > code {
        background: var(--autumn-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .VPButton.brand {
        background: var(--autumn-gradient);
        border: none;
        box-shadow: 0 4px 10px rgba(230, 126, 34, 0.3);
      }
      .dark .VPButton.brand {
        box-shadow: 0 4px 10px rgba(230, 126, 34, 0.15);
      }
    `
  },
  glacier: {
    primary: '#3498db',
    variables: {
      '--vp-c-brand': '#3498db',
      '--vp-c-brand-light': '#5faee3',
      '--vp-c-brand-lighter': '#89c4eb',
      '--vp-c-brand-dark': '#2980b9',
      '--vp-c-brand-darker': '#206694'
    },
    customCSS: `
      :root {
        --glacier-gradient: linear-gradient(45deg, #3498db, #2980b9);
        --vp-c-bg-alt: #f0f6fb;
        --vp-c-bg: #f5f9fc;
        --vp-c-bg-soft: #e8f2f9;
        --vp-c-bg-mute: #dfedf7;
        --vp-c-text-1: #0a192f;
        --vp-c-text-2: #16324d;
        --vp-c-text-3: #224b6e;
      }
      .dark {
        --glacier-gradient: linear-gradient(45deg, #3498db, #206694);
        --vp-c-bg-alt: #0a192f;
        --vp-c-bg: #0d2440;
        --vp-c-bg-soft: #102f51;
        --vp-c-bg-mute: #133a62;
        --vp-c-text-1: #cce4f7;
        --vp-c-text-2: #99c9ef;
        --vp-c-text-3: #66afe7;
      }
      .vp-doc a, .vp-doc a > code {
        background: var(--glacier-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .VPButton.brand {
        background: var(--glacier-gradient);
        border: none;
        box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
      }
      .dark .VPButton.brand {
        box-shadow: 0 4px 10px rgba(52, 152, 219, 0.15);
      }
    `
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
    nord: '北欧风格主题',
    matrix: '矩阵黑客主题',
    retrowave: '复古波浪主题',
    coffee: '咖啡风格主题',
    mint: '薄荷清新主题',
    synthwave: '合成波风格主题',
    sakura: '樱花粉主题',
    forest: '森林绿主题',
    autumn: '秋季橙主题',
    glacier: '冰川蓝主题'
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
  min-width: 300px;
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
  grid-template-columns: repeat(5, 1fr);
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

.matrix-swatch {
  background: #000 radial-gradient(#00ff41 15%, transparent 16%) center / 10px 10px;
  border: 2px solid #00ff41;
  box-shadow: 0 0 8px rgba(0, 255, 65, 0.8);
}

.retrowave-swatch {
  background: linear-gradient(45deg, #ff2afc, #00f0ff);
  border: 2px solid #ff00ee;
  box-shadow: 0 0 8px rgba(255, 42, 252, 0.8);
}

.coffee-swatch {
  background: linear-gradient(45deg, #c0a080, #8c6c4c);
  border: 2px solid #e6d2bc;
}

.mint-swatch {
  background: linear-gradient(45deg, #82e9de, #4dbbb0);
  border: 2px solid #f0fcfa;
}

.synthwave-swatch {
  background: linear-gradient(45deg, #fc3b7d, #7303c0, #03a9f4);
  border: 2px solid #fd3777;
  box-shadow: 0 0 8px rgba(253, 55, 119, 0.8);
}

.sakura-swatch {
  background: linear-gradient(45deg, #ff7eb6, #ff9ebd);
  border: 2px solid #fff;
  box-shadow: 0 0 8px rgba(255, 126, 182, 0.8);
}

.forest-swatch {
  background: linear-gradient(45deg, #2ecc71, #27ae60);
  border: 2px solid #fff;
  box-shadow: 0 0 8px rgba(46, 204, 113, 0.8);
}

.autumn-swatch {
  background: linear-gradient(45deg, #e67e22, #f39c12, #f1c40f);
  border: 2px solid #fff;
  box-shadow: 0 0 8px rgba(230, 126, 34, 0.8);
}

.glacier-swatch {
  background: linear-gradient(45deg, #3498db, #2980b9);
  border: 2px solid #fff;
  box-shadow: 0 0 8px rgba(52, 152, 219, 0.8);
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