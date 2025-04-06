# 插件功能展示

这个页面展示了博客中新添加的各种有趣的 VitePress 插件和组件功能。

## 可折叠代码块

使用可折叠代码块可以减少长代码占用的空间，让页面更整洁。

<CollapsibleCodeBlock title="Vue 组件示例代码" :collapsed="true">

```vue
<template>
  <div class="counter">
    <h1>{{ count }}</h1>
    <button @click="increment">点击增加</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<style scoped>
.counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 4px;
  background-color: var(--vp-c-brand);
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: var(--vp-c-brand-dark);
}
</style>
```

</CollapsibleCodeBlock>

<CollapsibleCodeBlock title="React 组件示例代码">

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>
        点击增加
      </button>
    </div>
  );
}

export default Counter;
```

</CollapsibleCodeBlock>

## 时间线组件

时间线组件可以用于展示项目历程、更新日志或个人履历等内容。

<TimeLine :items="[
  { title: 'VitePress 1.0 发布', date: '2023-06-10', content: 'VitePress 正式发布 1.0 版本，带来了许多新功能和改进。', color: '#3451b2' },
  { title: '增加更多主题功能', date: '2023-08-15', content: '新增了多种主题和个性化设置，使网站更加美观和易用。', color: '#3eaf7c' },
  { title: '改进搜索功能', date: '2023-10-05', content: '优化了站内搜索功能，支持更精准的内容查找和高亮显示。', color: '#db5a32' },
  { title: '引入新插件系统', date: '2024-01-20', content: '推出了全新的插件系统，便于扩展更多功能和集成第三方服务。', color: '#8957e5' },
  { title: '移动端适配升级', date: '2024-03-30', content: '全面优化了移动端的用户体验，响应更快、显示更佳。', color: '#3eaf7c' }
]" />

## 增强型图像查看器

增强型图像查看器支持拖拽、缩放和调整大小，提供更好的图片浏览体验。

<EnhancedImageViewer 
  src="https://vitepress.dev/vitepress-logo-large.svg" 
  alt="VitePress Logo" 
  caption="VitePress 官方图片 - 可拖拽和调整大小" 
  :initialWidth="500"
/>

## Mermaid 流程图

Mermaid 可以直接在 Markdown 中绘制各种图表，包括流程图、时序图、甘特图等。

### 流程图示例

<MermaidChart 
  :code="'graph TD\n    A[开始] --> B{是否已安装?}\n    B -->|是| C[运行程序]\n    B -->|否| D[安装程序]\n    D --> C\n    C --> E[使用程序]\n    E --> F{遇到问题?}\n    F -->|是| G[查阅文档]\n    F -->|否| H[继续使用]\n    G --> H\n    H --> I[结束]'" 
  caption="程序使用流程图"
/>

### 时序图示例

<MermaidChart 
  :code="'sequenceDiagram\n    participant 浏览器\n    participant 服务器\n    participant 数据库\n    \n    浏览器->>服务器: 发送请求\n    activate 服务器\n    服务器->>数据库: 查询数据\n    activate 数据库\n    数据库-->>服务器: 返回数据\n    deactivate 数据库\n    服务器-->>浏览器: 发送响应\n    deactivate 服务器'"
  caption="Web 应用请求流程时序图"
/>

## ECharts 数据图表

使用 ECharts 可以创建各种交互式数据可视化图表。

### 柱状图示例

<EChartsComponent :options="{
  title: {
    text: '网站访问统计',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '访问量',
      type: 'bar',
      data: [1020, 1532, 2541, 3240, 4238, 5624],
      itemStyle: {
        color: function(params) {
          const colorList = ['#3451b2', '#3eaf7c', '#db5a32', '#8957e5', '#f4984e', '#42b983'];
          return colorList[params.dataIndex];
        }
      }
    }
  ]
}" height="400px" />

### 饼图示例

<EChartsComponent :options="{
  title: {
    text: '技术栈占比',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['Vue', 'React', 'Angular', 'Svelte', '其他']
  },
  series: [
    {
      name: '使用占比',
      type: 'pie',
      radius: '60%',
      center: ['50%', '60%'],
      data: [
        { value: 40, name: 'Vue', itemStyle: { color: '#3eaf7c' } },
        { value: 30, name: 'React', itemStyle: { color: '#61dafb' } },
        { value: 15, name: 'Angular', itemStyle: { color: '#dd0031' } },
        { value: 10, name: 'Svelte', itemStyle: { color: '#ff3e00' } },
        { value: 5, name: '其他', itemStyle: { color: '#8957e5' } }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}" height="500px" />

## 功能盒子组件

功能盒子组件可以用于在文档中突出显示重要信息、提示或警告。

<FeatureBox type="info" title="信息提示">
这是一个信息提示框，用于展示一般性的说明信息。
</FeatureBox>

<FeatureBox type="tip" title="小技巧">
这是一个小技巧提示框，用于分享有用的技巧和建议。
</FeatureBox>

<FeatureBox type="warning" title="注意事项">
这是一个警告提示框，用于提醒用户需要注意的事项或潜在问题。
</FeatureBox>

<FeatureBox type="danger" title="危险操作">
这是一个危险提示框，用于警告用户危险或破坏性的操作。
</FeatureBox>

<FeatureBox type="success" title="成功信息">
这是一个成功提示框，用于通知用户操作已成功完成。
</FeatureBox>

<FeatureBox type="note" title="笔记">
这是一个笔记提示框，适合用于记录额外的信息或个人见解。
</FeatureBox>

## 展示页面仅供参考。