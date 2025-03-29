<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue'

const highlightElement = ref(null)
const overlayContainer = ref(null)
let isInitialized = false
let lastHighlightedElement = null
const DEBOUNCE_TIME = 30

function checkBrowserCompatibility() {
  if (typeof document === 'undefined') return false
  
  const hasGetElementsAtPoint = 'elementsFromPoint' in document || 'msElementsFromPoint' in document
  const hasGetBoundingClientRect = Element.prototype.getBoundingClientRect
  
  return hasGetElementsAtPoint && hasGetBoundingClientRect
}

function createOverlayContainer() {
  if (overlayContainer.value) return
  
  try {
    const container = document.createElement('div')
    container.className = 'cursor-highlight-container'
    container.style.position = 'absolute'
    container.style.top = '0'
    container.style.left = '0'
    container.style.width = '100%'
    container.style.height = '100%'
    container.style.pointerEvents = 'none'
    container.style.zIndex = '100'
    document.body.appendChild(container)
    overlayContainer.value = container
  } catch (error) {
  }
}

function createHighlightElement() {
  if (highlightElement.value) return
  
  try {
    const el = document.createElement('div')
    el.className = 'cursor-text-highlight'
    el.style.position = 'absolute'
    el.style.pointerEvents = 'none'
    el.style.backgroundColor = 'rgba(255, 255, 0, 0.15)'
    el.style.borderRadius = '6px'
    el.style.boxShadow = '0 0 0 1px rgba(255, 255, 0, 0.1)'
    el.style.transition = 'all 0.25s cubic-bezier(0.215, 0.61, 0.355, 1)'
    el.style.display = 'none'
    
    if (overlayContainer.value) {
      overlayContainer.value.appendChild(el)
      highlightElement.value = el
    }
  } catch (error) {
  }
}

function getHighlightableElementAtPoint(x, y) {
  try {
    const elements = document.elementsFromPoint 
      ? document.elementsFromPoint(x, y) 
      : document.msElementsFromPoint(x, y)
    
    if (!elements || elements.length === 0) return null
    
    const docElement = document.querySelector('.vp-doc')
    if (!docElement) return null
    
    const highlightableSelectors = [
      'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'li', 'blockquote', 'td', 'th', 'pre', 'code',
      '.vp-doc > div', '.custom-block > p'
    ].join(',')
    
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      
      if (element === overlayContainer.value || 
          element === highlightElement.value ||
          element.classList.contains('cursor-text-highlight')) {
        continue
      }
      
      if (docElement.contains(element) && element.matches(highlightableSelectors)) {
        return element
      }
      
      if (docElement.contains(element) && 
          element.childNodes && 
          Array.from(element.childNodes).some(node => 
            node.nodeType === Node.TEXT_NODE && 
            node.textContent && 
            node.textContent.trim()
          )) {
        return element
      }
    }
  } catch (error) {
  }
  
  return null
}

function calculateElementBounds(element) {
  try {
    if (!element) return null
    
    const rect = element.getBoundingClientRect()
    if (!rect) return null
    
    const padding = 4
    
    const scrollX = window.scrollX || window.pageXOffset || 0
    const scrollY = window.scrollY || window.pageYOffset || 0
    
    return {
      left: rect.left + scrollX - padding,
      top: rect.top + scrollY - padding,
      width: rect.width + (padding * 2),
      height: rect.height + (padding * 2)
    }
  } catch (error) {
    return null
  }
}

function applyHighlightToElement(element) {
  if (!element || !highlightElement.value) return
  
  try {
    if (lastHighlightedElement === element) return
    
    const bounds = calculateElementBounds(element)
    if (!bounds) {
      hideHighlight()
      return
    }
    
    highlightElement.value.style.display = 'block'
    highlightElement.value.style.left = `${bounds.left}px`
    highlightElement.value.style.top = `${bounds.top}px`
    highlightElement.value.style.width = `${bounds.width}px`
    highlightElement.value.style.height = `${bounds.height}px`
    
    lastHighlightedElement = element
  } catch (error) {
    hideHighlight()
  }
}

function hideHighlight() {
  if (highlightElement.value) {
    highlightElement.value.style.display = 'none'
  }
  lastHighlightedElement = null
}

function handleMouseMove(e) {
  if (!isInitialized || !highlightElement.value) return
  
  try {
    const element = getHighlightableElementAtPoint(e.clientX, e.clientY)
    
    if (element) {
      applyHighlightToElement(element)
    } else {
      hideHighlight()
    }
  } catch (error) {
    hideHighlight()
  }
}

function debounce(func, wait) {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

const debouncedHighlight = debounce(handleMouseMove, DEBOUNCE_TIME)

onMounted(() => {
  const isCompatible = checkBrowserCompatibility()
  if (!isCompatible) return
  
  try {
    createOverlayContainer()
    createHighlightElement()
    
    nextTick(() => {
      setTimeout(() => {
        isInitialized = true
        document.addEventListener('mousemove', debouncedHighlight)
      }, 300)
    })
  } catch (error) {
  }
})

onUnmounted(() => {
  try {
    document.removeEventListener('mousemove', debouncedHighlight)
    
    if (highlightElement.value && overlayContainer.value) {
      overlayContainer.value.removeChild(highlightElement.value)
      highlightElement.value = null
    }
    
    if (overlayContainer.value && document.body.contains(overlayContainer.value)) {
      document.body.removeChild(overlayContainer.value)
      overlayContainer.value = null
    }
    
    isInitialized = false
    lastHighlightedElement = null
  } catch (error) {
  }
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

.cursor-text-highlight {
  pointer-events: none !important;
  z-index: 9 !important;
  position: absolute !important;
  background-color: rgba(255, 255, 0, 0.15) !important;
  box-shadow: 0 0 0 1px rgba(255, 255, 0, 0.1) !important;
  border-radius: 6px !important;
  transition: all 0.25s cubic-bezier(0.215, 0.61, 0.355, 1) !important;
}

.cursor-highlight-container {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  pointer-events: none !important;
  z-index: 100 !important;
  contain: strict !important;
}
</style>