# Minecraft 1.21.5 NeoForge 自定义光标模组渲染分析

## 1. 简介

CustomCursor模组是一个允许玩家自定义Minecraft鼠标光标的模组，适用于Minecraft 1.21.5 NeoForge平台。这个模组使用了Minecraft官方的管线渲染系统（RenderPipeline）来实现高效的光标渲染。本文将深入分析该模组的渲染机制和实现方式。

## 2. RenderPipeline概述

在Minecraft 1.21.5中，Mojang引入了全新的RenderPipeline系统，这是一种现代化的渲染管线，用于替代旧版的渲染系统。RenderPipeline提供了更高效的渲染方式，更好的性能和更简洁的API。

### 2.1 RenderPipeline的特点

- 提供了声明式的渲染管线构建方式
- 支持顶点着色器和片段着色器
- 集成了混合模式、深度测试等渲染状态
- 支持顶点格式和渲染模式的定义

## 3. 自定义光标模组的核心渲染实现

### 3.1 渲染管线定义
在`NeoForgeRenderPipelines.java`中，模组定义了专用于光标渲染的管线：

```java
public static final RenderPipeline.Snippet CURSOR_SNIPPET = RenderPipeline.builder(RenderPipelines.MATRICES_COLOR_SNIPPET)
        .withVertexShader("core/position_tex_color")
        .withFragmentShader("core/position_tex_color")
        .withSampler("Sampler0")
        .withBlend(BlendFunction.TRANSLUCENT)
        .withVertexFormat(DefaultVertexFormat.POSITION_TEX_COLOR, VertexFormat.Mode.QUADS)
        .withDepthTestFunction(DepthTestFunction.NO_DEPTH_TEST)
        .buildSnippet();

public static final RenderPipeline CURSOR = RenderPipelines.register(
        RenderPipeline.builder(CURSOR_SNIPPET)
                .withLocation(ResourceLocation.fromNamespaceAndPath("customcursormod", "pipeline/cursor"))
                .build());
```

这段代码创建了一个名为`CURSOR`的渲染管线，具有以下特性：

1. 基于Minecraft的矩阵和颜色片段
2. 使用position_tex_color顶点和片段着色器
3. 采用半透明混合模式（TRANSLUCENT）
4. 使用POSITION_TEX_COLOR顶点格式和QUADS渲染模式
5. 禁用深度测试，确保光标总是绘制在最上层

### 3.2 渲染类型定义

在`NeoForgeRenderTypes.java`中，模组定义了两种渲染类型：

```java
public static final RenderType CURSOR = RenderType.create(
        "cursor",
        2048,
        NeoForgeRenderPipelines.CURSOR,
        RenderType.CompositeState.builder()
                .createCompositeState(false)
);

public static final Function<ResourceLocation, RenderType> CURSOR_TEXTURED = Util.memoize(
        resourceLocation -> RenderType.create(
                "cursor",
                2048,
                NeoForgeRenderPipelines.CURSOR,
                RenderType.CompositeState.builder()
                        .setTextureState(new RenderStateShard.TextureStateShard(resourceLocation, TriState.FALSE, false))
                        .createCompositeState(false)
        )
);
这定义了两种渲染类型：
1. `CURSOR` - 基本光标渲染类型
2. `CURSOR_TEXTURED` - 带纹理的光标渲染类型（使用memoize缓存不同纹理的RenderType）

### 3.3 渲染实现

在`NeoForgeGuiUtils.java`中，模组实现了实际的渲染逻辑：

```java
@Override
public void drawScaledCustomSizeModalRect(int x, int y, float u, float v, int uWidth, int vHeight, int width,
                                         int height, float tileWidth, float tileHeight, int color, boolean useAlpha) {
    float scaleX = 1.0F / tileWidth;
    float scaleY = 1.0F / tileHeight;
    int red = (color >> 16) & 0xFF;
    int green = (color >> 8) & 0xFF;
    int blue = color & 0xFF;
    int alpha = useAlpha ? (color >> 24) : 0xff;

    MultiBufferSource.BufferSource bufferSource = Minecraft.getInstance().renderBuffers().bufferSource();
    VertexConsumer vertexBuffer = bufferSource.getBuffer(NeoForgeRenderTypes.CURSOR);

    vertexBuffer.addVertex((float) x, (float) (y + height), 0.0F)
            .setUv(u * scaleX, (v + (float) vHeight) * scaleY)
            .setColor(red, green, blue, alpha);

    vertexBuffer.addVertex((float) (x + width), (float) (y + height), 0.0F)
            .setUv((u + (float) uWidth) * scaleX, (v + (float) vHeight) * scaleY)
            .setColor(red, green, blue, alpha);

    vertexBuffer.addVertex((float) (x + width), (float) y, 0.0F)
            .setUv((u + (float) uWidth) * scaleX, v * scaleY)
            .setColor(red, green, blue, alpha);

    vertexBuffer.addVertex((float) x, (float) y, 0.0F)
            .setUv(u * scaleX, v * scaleY)
            .setColor(red, green, blue, alpha);
}
```

这个方法使用VertexConsumer API和定义的渲染类型绘制光标，核心步骤为：

1. 获取缓冲区源和顶点缓冲区
2. 为每个顶点设置位置、UV坐标和颜色
3. 使用四边形（QUADS）模式绘制光标
```
### 3.4 光标渲染流程

在`NeoForgeCursorMod.java`的`onDrawScreen`方法中，实现了完整的光标渲染流程：

```java
@SubscribeEvent
public void onDrawScreen(ScreenEvent.Render.Post ev) {
    MultiBufferSource.BufferSource bufferSource = Minecraft.getInstance().renderBuffers().bufferSource();
    bufferSource.getBuffer(NeoForgeRenderTypes.CURSOR);

    // 确定当前光标类型
    Screen gui = ev.getScreen();
    CursorType newCursorType = CursorType.POINTER;
    if (mod.getConfig().dynamicCursor) {
        // ...动态光标类型检测逻辑...
    }
    mod.changeCursor(newCursorType);

    // 渲染点击动画
    if (mod.getConfig().clickAnimation) {
        Iterator<CursorClick> iterator = mod.getCursorClicks().iterator();
        while (iterator.hasNext()) {
            CursorClick cursorClick = iterator.next();
            int posX = (int) cursorClick.getPosX();
            int posY = (int) cursorClick.getPosY();
            GpuTexture texture = Minecraft.getInstance().getTextureManager().getTexture(ResourceLocation.fromNamespaceAndPath("customcursormod", "textures/gui/click_" + cursorClick.getImage() + ".png")).getTexture();

            RenderSystem.setShaderTexture(0, texture);

            NeoForgeGuiUtils.getForge().drawScaledCustomSizeModalRect(posX - 8, posY - 8, 0, 0, 16, 16, 16, 16, 16, 16,
                    0xffffffff, true);

            cursorClick.descreaseTime(ev.getPartialTick());
            if (cursorClick.getTime() <= 0) {
                iterator.remove();
            }
        }
    }
}
```

## 4. 光标配置和资源管理

模组使用`CursorConfig`类来管理光标的资源和属性：

```java
public class CursorConfig {
    // ...
    private void readImage() {
        try {
            BufferedImage originalImage = ImageIO.read(getResource());
            if (originalImage == null) return;
            
            // 缩放图像处理
            int originalWidth = originalImage.getWidth();
            int originalHeight = originalImage.getHeight();
            
            float scale = (float)size / (float)originalWidth;
            int scaledWidth = size;
            int scaledHeight = (int)(originalHeight * scale);
            
            // 创建缩放后的图像
            BufferedImage scaledImage = new BufferedImage(scaledWidth, scaledHeight, BufferedImage.TYPE_INT_ARGB);
            // ...图像处理代码...
            
            // 设置GLFW图像
            buffer.flip();
            glfwImage.pixels(buffer);
            glfwImage.width(scaledWidth);
            glfwImage.height(scaledHeight);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    public long getCursor() {
        if (cursor == MemoryUtil.NULL)
            allocate();
        return cursor;
    }
    
    private void allocate() {
        readImage();
        if (cursor != MemoryUtil.NULL)
            freeCursor();
        cursor = GLFW.glfwCreateCursor(glfwImage, getxHotSpot(), getyHotSpot());
    }
}
CursorConfig负责：
1. 加载和缩放光标图像
2. 将图像转换为GLFW可用的格式
3. 创建和管理GLFW光标
4. 处理热点位置

## 5. 光标类型管理

模组定义了多种光标类型，用于不同的交互场景：

```java
public class CursorType {
    public static final CursorType POINTER = new CursorType("pointer", "cursormod.cursor.pointer",
            new CursorConfig("textures/gui/customcursor.png"));

    public static final CursorType BEAM = new CursorType("beam", "cursormod.cursor.beam",
            new CursorConfig("textures/gui/customcursor_beam.png", 16, 16));

    public static final CursorType HAND = new CursorType("hand", "cursormod.cursor.hand",
            new CursorConfig("textures/gui/customcursor_hand.png", 9, 1));

    public static final CursorType HAND_GRAB = new CursorType("hand_grab", "cursormod.cursor.hand_grab",
            new CursorConfig("textures/gui/customcursor_hand_grab.png", 14, 7));

    public static final CursorType CROSS = new CursorType("cross", "cursormod.cursor.cross",
            new CursorConfig("textures/gui/customcursor_cross.png", 16, 16));
    // ...
}
```

## 6. 整体渲染流程

整个光标渲染流程可以总结为：

1. 定义专用的渲染管线和渲染类型
   - 使用RenderPipeline.builder创建渲染管线
   - 配置适当的着色器、混合模式和顶点格式
   - 创建对应的RenderType以支持渲染操作

2. 使用事件系统挂钩Minecraft的渲染周期
   - 订阅ScreenEvent.Render.Post事件
   - 在每帧渲染结束后处理光标渲染

3. 根据界面交互动态选择合适的光标类型
   - 检测鼠标位置与UI元素的交互
   - 根据交互类型（按钮、文本框等）选择合适的光标

4. 使用GLFW API设置系统光标
   - 加载和处理光标图像
   - 通过GLFW API创建硬件光标
   - 设置热点位置和大小

5. 使用RenderPipeline进行渲染
   - 获取顶点缓冲区
   - 设置顶点数据（位置、UV坐标、颜色）
   - 应用适当的纹理和混合模式
   - 提交渲染命令

这种实现方式充分利用了Minecraft 1.21.5新的渲染管线系统，实现了高效、灵活的光标渲染，同时保证了与游戏其他渲染元素的兼容性和正确的渲染顺序。
```