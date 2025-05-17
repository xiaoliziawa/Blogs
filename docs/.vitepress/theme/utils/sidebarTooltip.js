export function initSidebarTooltip() {
  if (typeof window === 'undefined') return
  
  window.addEventListener('DOMContentLoaded', () => {
    handleSidebar()
  })
  
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    handleSidebar()
  }
  
  return (router) => {
    if (router) {
      router.onAfterRouteChanged = () => {
        setTimeout(() => {
          handleSidebar()
        }, 100)
      }
    }
  }
}

function handleSidebar() {
  processLongTexts()
  
  setTimeout(processLongTexts, 300)
  setTimeout(processLongTexts, 1000)
  
  setupMutationObserver()
}

function setupMutationObserver() {
  if (window._sidebarObserver) {
    window._sidebarObserver.disconnect()
  }
  
  window._sidebarObserver = new MutationObserver((mutations) => {
    processLongTexts()
    setupCustomTooltip()
  })
  
  const sidebar = document.querySelector('.VPSidebar')
  if (sidebar) {
    window._sidebarObserver.observe(sidebar, { 
      childList: true, 
      subtree: true 
    })
  }
}

function processLongTexts() {
  document.querySelectorAll('.VPSidebarItem .text').forEach(el => {
    if (el.hasAttribute('title')) {
      el.removeAttribute('title')
    }
    
    if (!el.style.maxWidth) {
      el.style.maxWidth = el.parentNode.classList.contains('level-3') || 
                          el.parentNode.classList.contains('level-4') 
                          ? '150px' : '200px'
    }
    
    void el.offsetWidth
    
    if (el.scrollWidth > el.clientWidth + 5) {
      el.setAttribute('data-tooltip', el.textContent.trim())
      el.classList.add('text-overflow')
    } else {
      if (el.hasAttribute('data-tooltip')) {
        el.removeAttribute('data-tooltip')
      }
      el.classList.remove('text-overflow')
    }
  })
  
  setupCustomTooltip()
}

function setupCustomTooltip() {
  let tooltip = document.getElementById('custom-sidebar-tooltip')
  
  if (!tooltip) {
    tooltip = document.createElement('div')
    tooltip.id = 'custom-sidebar-tooltip'
    tooltip.className = 'custom-tooltip primary'
    document.body.appendChild(tooltip)
  }
  
  document.querySelectorAll('.VPSidebarItem .item').forEach(el => {
    const textEl = el.querySelector('.text')
    if (textEl) {
      el.removeEventListener('mouseenter', el._tooltipHandler)
      el.removeEventListener('mouseleave', el._hideTooltipHandler)
    }
  })
  
  document.querySelectorAll('.VPSidebarItem .item').forEach(el => {
    const textEl = el.querySelector('.text')
    if (textEl && textEl.hasAttribute('data-tooltip')) {
      el._tooltipHandler = function(e) {
        showTooltipHandler.call(textEl, e)
      }
      el._hideTooltipHandler = hideTooltipHandler
      
      el.addEventListener('mouseenter', el._tooltipHandler)
      el.addEventListener('mouseleave', el._hideTooltipHandler)
    }
  })
}

function showTooltipHandler(e) {
  const text = this.getAttribute('data-tooltip')
  if (!text) return
  
  const tooltip = document.getElementById('custom-sidebar-tooltip')
  tooltip.textContent = text
  tooltip.classList.add('show')
  
  const rect = this.getBoundingClientRect()
  const tooltipLeft = rect.left
  let tooltipTop = rect.top - 8
  
  tooltip.style.left = `${tooltipLeft}px`
  tooltip.style.top = `-1000px`
  tooltip.style.opacity = '0'
  tooltip.style.display = 'block'
  
  const tooltipHeight = tooltip.offsetHeight
  
  if (rect.top - tooltipHeight - 10 < 0) {
    tooltipTop = rect.bottom + 8
    tooltip.classList.add('arrow-top')
  } else {
    tooltipTop = rect.top - tooltipHeight - 8
    tooltip.classList.remove('arrow-top')
  }
  
  tooltip.style.left = `${tooltipLeft}px`
  tooltip.style.top = `${tooltipTop}px`
  tooltip.style.opacity = ''
  tooltip.style.display = ''
}

function hideTooltipHandler() {
  const tooltip = document.getElementById('custom-sidebar-tooltip')
  if (tooltip) {
    tooltip.classList.remove('show')
  }
} 