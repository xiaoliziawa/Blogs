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
  if (!highlightElement.value) return
  
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

function isSpecialArea(element) {
  if (!element) return false
  
  let current = element
  while (current && current !== document.body) {
    if (current.classList.contains('github-chart') || 
        current.classList.contains('echarts') ||
        current.tagName === 'CANVAS') {
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
    const specialArea = isSpecialArea(target)
    isInSpecialArea = specialArea
    updateHighlightPosition(clientX, clientY)
  })
}

function handleSpecialAreaMouseMove() {
  if (!isInitialized || !isInSpecialArea) return
  
  const mouseX = typeof window.mouseX !== 'undefined' ? window.mouseX : 
               (typeof window.event !== 'undefined' && window.event.clientX ? window.event.clientX : lastMousePosition.x)
  
  const mouseY = typeof window.mouseY !== 'undefined' ? window.mouseY : 
               (typeof window.event !== 'undefined' && window.event.clientY ? window.event.clientY : lastMousePosition.y)
  
  if (mouseX !== lastMousePosition.x || mouseY !== lastMousePosition.y) {
    updateHighlightPosition(mouseX, mouseY)
  }
}

function handleMouseLeave() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  isInSpecialArea = false
  hideHighlight()
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
      document.addEventListener('mouseleave', handleMouseLeave)
      
      if (typeof document.querySelector('.github-chart') !== 'undefined') {
        const chartElements = document.querySelectorAll('.github-chart')
        chartElements.forEach(chart => {
          chart.addEventListener('mouseover', () => { isInSpecialArea = true })
          chart.addEventListener('mouseout', () => { isInSpecialArea = false })
        })
      }
      
      const specialAreaInterval = setInterval(() => {
        handleSpecialAreaMouseMove()
      }, 16)
      
      onUnmounted(() => {
        clearInterval(specialAreaInterval)
      })
      
      if (typeof document.defaultView.mouseX !== 'undefined' && typeof document.defaultView.mouseY !== 'undefined') {
        updateHighlightPosition(document.defaultView.mouseX, document.defaultView.mouseY)
      }
    }, 300)
  })
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove, { capture: true })
  document.removeEventListener('mouseleave', handleMouseLeave)
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
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