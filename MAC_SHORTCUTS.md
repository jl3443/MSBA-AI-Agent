# 🍎 Mac 快捷键设置指南

## MSBA AI Assistant 快捷键

### 默认快捷键
- **Mac**: `Command (⌘) + Shift (⇧) + B`
- **Windows/Linux**: `Ctrl + Shift + B`

## 如何设置/修改快捷键

### 方法1：通过 Chrome 设置（推荐）

1. 打开 Chrome
2. 访问：`chrome://extensions/shortcuts`
3. 找到 "UCLA MSBA AI Assistant"
4. 找到 "Toggle MSBA AI Assistant"
5. 点击铅笔图标 ✏️
6. 按下你想要的快捷键组合
   - 例如：`Command + Shift + M` 或 `Command + K`
7. 点击"确定"保存

### 方法2：使用 Command+K（如果你想要）

如果你想使用 `Command+K` 打开 MSBA Agent（而不是旧的 Kyle's Agent）：

1. 先禁用旧 Agent 的 `Command+K` 快捷键
   - 在 `chrome://extensions/shortcuts` 中找到旧的 Agent
   - 删除或修改它的快捷键

2. 设置 MSBA Agent 使用 `Command+K`
   - 找到 "UCLA MSBA AI Assistant"
   - 设置 "Toggle MSBA AI Assistant" 为 `Command+K`

## 测试快捷键

1. 打开任意网页
2. 按 `Command+Shift+B`（或你设置的快捷键）
3. 应该会打开/关闭 MSBA AI Assistant 侧边栏

## 如果快捷键不工作

### 检查1：快捷键是否冲突

1. 访问 `chrome://extensions/shortcuts`
2. 查看是否有其他扩展使用相同的快捷键
3. 如果有冲突，修改其中一个

### 检查2：在控制台测试

打开控制台（F12），运行：

```javascript
// 测试键盘事件
document.addEventListener('keydown', (e) => {
    console.log('Key pressed:', {
        key: e.key,
        metaKey: e.metaKey,  // Command on Mac
        ctrlKey: e.ctrlKey,  // Ctrl on Windows
        shiftKey: e.shiftKey
    });
});
```

然后按 `Command+Shift+B`，查看控制台输出。

### 检查3：手动触发

在控制台运行：

```javascript
// 手动触发 toggle
if (window.msbaAgent) {
    window.msbaAgent.toggleSidebar();
} else {
    console.log('Agent not initialized');
    window.msbaAgent = new MSBAAgent();
    setTimeout(() => window.msbaAgent.toggleSidebar(), 500);
}
```

## 推荐的快捷键组合

- `Command+Shift+B` - 当前默认（B for Business Analytics）
- `Command+Shift+M` - M for MSBA
- `Command+K` - 如果你想让 MSBA Agent 使用这个（需要先禁用旧 Agent）

---

**注意**：Mac 上的 Command 键在 JavaScript 中是 `e.metaKey`，不是 `e.ctrlKey`。

