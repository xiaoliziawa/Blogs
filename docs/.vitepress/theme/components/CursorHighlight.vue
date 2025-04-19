<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue'

const highlightElement = ref(null)
const overlayContainer = ref(null)
let isInitialized = false
const HIGHLIGHT_SIZE = 80
const HIGHLIGHT_COLOR = 'rgba(255, 255, 0, 0.15)'
const HIGHLIGHT_BORDER = 'rgba(255, 255, 0, 0.1)'
let animationFrameId = null
let lastMousePosition = { x: 0, y: 0 }
let isInSpecialArea = false
let giscusObserver = null

function checkBrowserCompatibility() {
  if (typeof document === 'undefined') return false
  return true
}

function createOverlayContainer() {
  if (overlayContainer.value) return
  
  const container = document.createElement('div')
  container.className = 'cursor-highlight-container'
  container.style.position = 'fixed'
  container.style.top = '0'
  container.style.left = '0'
  container.style.width = '100%'
  container.style.height = '100%'
  container.style.pointerEvents = 'none'
  container.style.zIndex = '100000'
  document.body.appendChild(container)
  overlayContainer.value = container
}

function createHighlightElement() {
  if (highlightElement.value) return
  
  const el = document.createElement('div')
  el.className = 'cursor-circle-highlight'
  el.style.position = 'absolute'
  el.style.pointerEvents = 'none'
  el.style.backgroundColor = HIGHLIGHT_COLOR
  el.style.borderRadius = '50%'
  el.style.width = `${HIGHLIGHT_SIZE}px`
  el.style.height = `${HIGHLIGHT_SIZE}px`
  el.style.left = '0px'
  el.style.top = '0px'
  el.style.marginLeft = `-${HIGHLIGHT_SIZE/2}px`
  el.style.marginTop = `-${HIGHLIGHT_SIZE/2}px`
  el.style.boxShadow = `0 0 0 1px ${HIGHLIGHT_BORDER}`
  el.style.opacity = '0'
  el.style.willChange = 'left, top'
  el.style.backfaceVisibility = 'hidden'
  el.style.webkitBackfaceVisibility = 'hidden'
  
  if (overlayContainer.value) {
    overlayContainer.value.appendChild(el)
    highlightElement.value = el
  }
}

function updateHighlightPosition(x, y) {
  if (!highlightElement.value || isInSpecialArea) return
  
  lastMousePosition = { x, y }
  
  highlightElement.value.style.left = `${x}px`
  highlightElement.value.style.top = `${y}px`
  
  if (highlightElement.value.style.opacity === '0') {
    highlightElement.value.style.opacity = '1'
  }
}

function hideHighlight() {
  if (highlightElement.value) {
    highlightElement.value.style.opacity = '0'
  }
}

function showHighlight() {
  if (highlightElement.value) {
    highlightElement.value.style.opacity = '1'
  }
}

function isInsideGiscus(element) {
  let current = element
  while (current && current !== document.body) {
    if (current.classList.contains('giscus')) {
      return true
    }
    current = current.parentElement
  }
  return false
}

function handleMouseMove(e) {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  
  animationFrameId = requestAnimationFrame(() => {
    if (!isInitialized || !highlightElement.value) return
    
    const { clientX, clientY, target } = e
    const insideGiscus = isInsideGiscus(target)
    
    if (insideGiscus) {
      if (!isInSpecialArea) {
        isInSpecialArea = true
        hideHighlight()
      }
    } else {
      if (isInSpecialArea) {
        isInSpecialArea = false
        updateHighlightPosition(clientX, clientY)
        showHighlight()
      } else {
        updateHighlightPosition(clientX, clientY)
      }
    }
  })
}

function handleMouseLeaveDocument() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  isInSpecialArea = false
  hideHighlight()
}

function setupGiscusListener() {
  const giscusContainer = document.querySelector('.giscus')
  if (giscusContainer) {
    const giscusFrame = giscusContainer.querySelector('iframe')
    if (giscusFrame) {
      giscusContainer.addEventListener('mouseenter', handleEnterGiscus, { capture: true })
      giscusContainer.addEventListener('mouseleave', handleLeaveGiscus, { capture: true })
      return true
    }
  }
  return false
}

function handleEnterGiscus() {
  if (!isInSpecialArea) {
    isInSpecialArea = true
    hideHighlight()
  }
}

function handleLeaveGiscus() {
  // 离开giscus区域时，允许mousemove事件恢复高亮
  // 不需要立即显示，mousemove会处理
  // isInSpecialArea 会在下一次 document mousemove 时更新
}

onMounted(() => {
  const isCompatible = checkBrowserCompatibility()
  if (!isCompatible) return
  
  createOverlayContainer()
  createHighlightElement()
  
  nextTick(() => {
    setTimeout(() => {
      isInitialized = true
      
      document.addEventListener('mousemove', handleMouseMove, { passive: true, capture: true })
      document.documentElement.addEventListener('mouseleave', handleMouseLeaveDocument)
      
      if (!setupGiscusListener()) {
        giscusObserver = new MutationObserver((mutations) => {
          let giscusFound = false;
          for (const mutation of mutations) {
            if (mutation.addedNodes) {
              for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  const container = node.matches('.giscus') ? node : node.querySelector('.giscus');
                  if (container) {
                    if (setupGiscusListener()) {
                      giscusObserver.disconnect();
                      giscusFound = true;
                      break;
                    }
                  }
                }
              }
            }
            if (giscusFound) break;
          }
        });

        giscusObserver.observe(document.body, { childList: true, subtree: true });
      }
    }, 300)
  })
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove, { capture: true })
  document.documentElement.removeEventListener('mouseleave', handleMouseLeaveDocument)
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  
  const giscusContainer = document.querySelector('.giscus')
  if (giscusContainer) {
    giscusContainer.removeEventListener('mouseenter', handleEnterGiscus, { capture: true })
    giscusContainer.removeEventListener('mouseleave', handleLeaveGiscus, { capture: true })
  }

  if (giscusObserver) {
    giscusObserver.disconnect()
    giscusObserver = null
  }
  
  if (highlightElement.value && overlayContainer.value) {
    overlayContainer.value.removeChild(highlightElement.value)
    highlightElement.value = null
  }
  
  if (overlayContainer.value && document.body.contains(overlayContainer.value)) {
    document.body.removeChild(overlayContainer.value)
    overlayContainer.value = null
  }
  
  isInitialized = false
})
</script>

<template>
</template>

<style>
.vp-doc p:hover,
.vp-doc h1:hover,
.vp-doc h2:hover,
.vp-doc h3:hover,
.vp-doc h4:hover,
.vp-doc h5:hover,
.vp-doc h6:hover,
.vp-doc li:hover,
.vp-doc td:hover,
.vp-doc th:hover,
.vp-doc pre:hover,
.vp-doc code:hover,
.vp-doc blockquote:hover {
  background-color: transparent !important;
}

.cursor-circle-highlight {
  pointer-events: none !important;
  z-index: 100000 !important;
  position: absolute !important;
  border-radius: 50% !important;
  transition: opacity 0.15s linear !important;
}

.cursor-highlight-container {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  pointer-events: none !important;
  z-index: 100000 !important;
  contain: strict !important;
}
</style>