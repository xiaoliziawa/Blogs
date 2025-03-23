<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const highlightElement = ref(null)
let isInitialized = false
let lastHighlightedText = null
const DEBOUNCE_TIME = 30

function createHighlightElement() {
  if (highlightElement.value) return
  
  const el = document.createElement('div')
  el.className = 'cursor-text-line-highlight'
  el.style.position = 'absolute'
  el.style.pointerEvents = 'none'
  el.style.backgroundColor = 'rgba(255, 255, 0, 0.15)'
  el.style.borderRadius = '8px'
  el.style.boxShadow = '0 0 0 1px rgba(255, 255, 0, 0.1)'
  el.style.transition = 'all 0.3s ease'
  el.style.zIndex = '0'
  el.style.display = 'none'
  document.body.appendChild(el)
  highlightElement.value = el
}

function getTextNodeAtPosition(x, y) {
  const range = document.caretRangeFromPoint(x, y)
  if (!range) return null
  
  const node = range.startContainer
  
  if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
    return { node, range }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT)
    const textNode = walker.nextNode()
    if (textNode && textNode.textContent.trim()) {
      const newRange = document.createRange()
      newRange.selectNode(textNode)
      return { node: textNode, range: newRange }
    }
  }
  
  return null
}

function highlightTextLine(x, y) {
  if (!highlightElement.value || !isInitialized) return
  

  const docElement = document.querySelector('.vp-doc')
  if (!docElement || !docElement.contains(document.elementFromPoint(x, y))) {
    highlightElement.value.style.display = 'none'
    lastHighlightedText = null
    return
  }
  
  
  const textInfo = getTextNodeAtPosition(x, y)
  if (!textInfo) {
    highlightElement.value.style.display = 'none'
    lastHighlightedText = null
    return
  }
  
  const { node, range } = textInfo
  
  if (lastHighlightedText === node) {
    return
  }
  
  lastHighlightedText = node
  
  try {
    const rects = range.getClientRects()
    if (!rects || rects.length === 0) {
      highlightElement.value.style.display = 'none'
      return
    }
    
    let targetRect = null
    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i]
      if (rect.top <= y && y <= rect.bottom) {
        targetRect = rect
        break
      }
    }
    
    if (!targetRect) {
      targetRect = rects[0]
    }
    
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    
    const height = Math.max(targetRect.height, 24)
    
    highlightElement.value.style.display = 'block'
    highlightElement.value.style.left = `${targetRect.left + scrollX - 4}px`        
    highlightElement.value.style.top = `${targetRect.top + scrollY - 2}px`
    highlightElement.value.style.width = `${targetRect.width + 8}px`
    highlightElement.value.style.height = `${height + 4}px`
  } catch (e) {
    highlightElement.value.style.display = 'none'
  }
}

function debounce(func, wait) {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

const debouncedHighlight = debounce(highlightTextLine, DEBOUNCE_TIME)

function handleMouseMove(e) {
  debouncedHighlight(e.clientX, e.clientY)
}

onMounted(() => {
  createHighlightElement()
  setTimeout(() => {
    isInitialized = true
    document.addEventListener('mousemove', handleMouseMove)
  }, 300)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  if (highlightElement.value) {
    document.body.removeChild(highlightElement.value)
    highlightElement.value = null
  }
})
</script>

<template>
  <div style="display: none;"></div>
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
.vp-doc th:hover {
  background-color: transparent !important;
}
</style> 