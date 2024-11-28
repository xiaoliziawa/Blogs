# Modding {style="font-size: 32px; color: blue"}

## 文档 {.custom-title style="font-size: 24px"}

### 自定义标题 {#custom-id .special-heading style="font-size: 20px; color: red"}


👆同样使用`markdown-it-attrs`插件来控制标题样式👆

::: warning
这是警告
:::

::: danger
这是危险
:::

::: details
这是详情
:::

::: info
这是信息
:::

# 大标题 {font-size="28px"}
## 中标题 {font-size="24px"}
### 小标题 {font-size="20px"}

### 代码块 {.code-title style="font-size: 18px; font-weight: bold"}

::: code-group
```python[1]
print("Hello, World!")
```

```python[2]
print("NMSL!")
```
:::

>使用`<img>`标签插入图片

<img src="/cards-img/home.png" alt="Python Version">

> 使用`markdown`语法插入图片 {style="color: green; font-size: 16px"}
> 
> 使用`markdown-it-attrs`插件来控制图片样式 {.note style="font-style: italic"}

![home](/page-icon.png){size="50px"}
![home](/page-icon.png){width="100px" height="80px"}

### 代码示例

```js
function example() {
  const colors = ['purple', 'green', 'orange'];
  return colors.map(color => {
    console.log(`Dracula loves ${color}!`);
    return color.toUpperCase();
  });
}
```

```py
class DraculaTheme:
    def __init__(self):
        self.colors = {
            'background': '#282a36',
            'foreground': '#f8f8f2',
            'selection': '#44475a',
            'comment': '#6272a4'
        }
    
    def get_color(self, name):
        return self.colors.get(name, None)
```
