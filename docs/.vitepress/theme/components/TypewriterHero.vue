<template>
  <div class="VPHero">
    <div class="container">
      <div class="main">
        <h1 class="name typing-container" data-typing="false">
          <span class="typing-text"></span>
        </h1>
        <div class="text typing-container" data-typing="false">
          <span class="typing-text"></span>
        </div>
        <p class="tagline typing-container" data-typing="false">
          <span class="typing-text"></span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const texts = {
  title: "PrizOwO's Blog",
  welcome: "Welcome !",
  tagline: "收录各种网站、Code！"
}

async function typeText(element, text) {
  const textElement = element.querySelector('.typing-text')
  for (let i = 0; i < text.length; i++) {
    textElement.textContent = text.substring(0, i + 1)
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}

async function deleteText(element) {
  element.dataset.typing = 'true'
  const textElement = element.querySelector('.typing-text')
  const text = textElement.textContent
  for (let i = text.length; i > 0; i--) {
    textElement.textContent = text.substring(0, i - 1)
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}

async function startTyping() {
  const title = document.querySelector('.VPHero .name')
  const welcome = document.querySelector('.VPHero .text')
  const tagline = document.querySelector('.VPHero .tagline')
  
  if (!title || !welcome || !tagline) return
  
  // 初始化打字容器
  title.innerHTML = '<span class="typing-text"></span>'
  welcome.innerHTML = '<span class="typing-text"></span>'
  tagline.innerHTML = '<span class="typing-text"></span>'
  
  while (true) {
    // 打字阶段
    title.dataset.typing = 'true'
    await typeText(title, texts.title)
    title.dataset.typing = 'false'
    
    welcome.dataset.typing = 'true'
    await typeText(welcome, texts.welcome)
    welcome.dataset.typing = 'false'
    
    tagline.dataset.typing = 'true'
    await typeText(tagline, texts.tagline)
    
    // 打印完成后等待8秒
    await new Promise(resolve => setTimeout(resolve, 8000))
    
    // 删除阶段
    await deleteText(tagline)
    tagline.dataset.typing = 'false'
    await deleteText(welcome)
    welcome.dataset.typing = 'false'
    await deleteText(title)
    
    title.dataset.typing = 'true'
    
    // 删除完成后等待3秒
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    title.dataset.typing = 'false'
  }
}

onMounted(() => {
  setTimeout(() => {
    startTyping()
  }, 100)
})
</script>

<style>
.typing-container {
  position: relative;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
}

.typing-text {
  display: inline-block;
  background-image: linear-gradient(
    120deg,
    #ff6b6b 0%,
    #7e57c2 25%,
    #4a90e2 50%,
    #66bb6a 75%,
    #ffa726 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 8s linear infinite;
  background-size: 200% auto;
  line-height: inherit;
}

[data-typing="true"] .typing-text::after {
  content: '';
  display: inline-block;
  width: 3px;
  height: 1em;
  background: linear-gradient(
    120deg,
    #ff6b6b 0%,
    #7e57c2 25%,
    #4a90e2 50%,
    #66bb6a 75%,
    #ffa726 100%
  );
  margin-left: 2px;
  vertical-align: baseline;
  animation: cursor-blink 1s infinite step-end,
             gradient 8s linear infinite;
  background-size: 200% auto;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style> 