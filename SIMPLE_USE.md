# 🎯 简单使用指南

## 正常使用（应该自动工作）

扩展加载后，应该**自动**：

1. ✅ 在右下角显示 🎓 按钮
2. ✅ 响应 `Command+Shift+B` 快捷键
3. ✅ 点击按钮或快捷键打开/关闭 Assistant

## 如果按钮不自动出现

### 一次性设置（只需做一次）

1. **重新加载扩展**
   - 打开 `chrome://extensions/`
   - 找到 "UCLA MSBA AI Assistant"
   - 点击刷新按钮 🔄

2. **刷新网页**
   - 按 `Command + R` 刷新页面
   - 等待几秒钟
   - 查看右下角是否出现 🎓 按钮

3. **如果还是没有，运行一次这个脚本**（在控制台）

```javascript
// 一次性修复脚本 - 只需运行一次
if (typeof MSBAAgent !== 'undefined' && !window.msbaAgent) {
    window.msbaAgent = new MSBAAgent();
    console.log('✅ Agent 已初始化');
}
```

## 日常使用（非常简单）

### 方法1：点击按钮（最简单）
- 打开任意网页
- 点击右下角的 🎓 按钮
- 完成！

### 方法2：快捷键
- 打开任意网页
- 按 `Command + Shift + B`
- 完成！

## 如果每次都需要手动创建按钮

这说明扩展脚本没有正确加载。请：

1. **检查扩展是否启用**
   - `chrome://extensions/` → 确认 "UCLA MSBA AI Assistant" 是"已启用"状态

2. **检查是否有错误**
   - 在扩展卡片上查看是否有红色错误信息
   - 点击"详细信息"查看错误

3. **重新安装扩展**
   - 移除扩展
   - 重新加载 `msba-agent` 文件夹

## 理想状态

正常情况下，你应该：
- ✅ 打开网页 → 自动看到 🎓 按钮
- ✅ 点击按钮 → 打开 Assistant
- ✅ 不需要任何手动操作

如果每次都需要手动操作，说明扩展配置有问题，需要修复。

---

**问题诊断：**

在控制台运行这个，告诉我结果：

```javascript
console.log('扩展状态:', {
    MSBAAgent: typeof MSBAAgent,
    msbaAgent: typeof window.msbaAgent,
    button: document.getElementById('msba-toggle-btn') ? '存在' : '不存在'
});
```

