# 🐛 调试指南

## 如果看不到浮动按钮或快捷键不工作

### 步骤1：检查扩展是否加载

1. 打开 `chrome://extensions/`
2. 找到 "UCLA MSBA AI Assistant"
3. 确认状态是"已启用"（不是"已停用"）
4. 如果已停用，点击开关启用它

### 步骤2：检查浏览器控制台

1. 打开任意网页（例如 MSBA 官网）
2. 按 `F12` 打开开发者工具
3. 点击 "Console" 标签
4. 查看是否有以下信息：
   - `🎓 UCLA MSBA AI Agent initializing...`
   - `✅ MSBA Agent initialized`
   - 或者任何红色错误信息

### 步骤3：手动测试

在控制台（Console）中输入以下命令：

```javascript
// 检查 Agent 是否存在
window.msbaAgent

// 如果存在，手动打开侧边栏
window.msbaAgent.toggleSidebar()

// 检查浮动按钮是否存在
document.getElementById('msba-toggle-btn')

// 手动创建 Agent（如果不存在）
if (!window.msbaAgent) {
    window.msbaAgent = new MSBAAgent();
}
```

### 步骤4：检查 API Key

1. 点击 Chrome 工具栏中的扩展图标
2. 确认是否已输入 API Key
3. 如果没有，输入 API Key 并保存
4. 刷新网页（F5）

### 步骤5：强制重新加载

1. 在 `chrome://extensions/` 页面
2. 点击扩展的"重新加载"按钮（刷新图标）
3. 刷新网页（F5）
4. 检查控制台是否有初始化信息

## 常见错误

### 错误：`MSBALangChainAdapter is not defined`
- **原因**：脚本加载顺序问题
- **解决**：检查 manifest.json 中的脚本顺序是否正确

### 错误：`Cannot read property 'toggleSidebar' of undefined`
- **原因**：Agent 未初始化
- **解决**：在控制台运行 `window.msbaAgent = new MSBAAgent()`

### 看不到浮动按钮
- **原因**：UI 未创建或被其他元素遮挡
- **解决**：检查控制台，手动创建按钮：
  ```javascript
  const btn = document.createElement('button');
  btn.id = 'msba-toggle-btn';
  btn.innerHTML = '🎓';
  btn.style.cssText = 'position:fixed;right:20px;bottom:20px;width:60px;height:60px;background:#003DA5;color:white;border:none;border-radius:50%;font-size:24px;cursor:pointer;z-index:999999;';
  btn.onclick = () => window.msbaAgent?.toggleSidebar();
  document.body.appendChild(btn);
  ```

## 快速修复脚本

在控制台运行这个脚本来强制初始化：

```javascript
// 强制初始化 MSBA Agent
(function() {
    // 确保知识库加载
    if (typeof MSBAKnowledgeBase !== 'undefined' && !window.msbaKnowledgeBase) {
        window.msbaKnowledgeBase = new MSBAKnowledgeBase();
    }
    
    // 确保 Agent 初始化
    if (typeof MSBAAgent !== 'undefined' && !window.msbaAgent) {
        window.msbaAgent = new MSBAAgent();
    }
    
    // 创建浮动按钮（如果不存在）
    if (!document.getElementById('msba-toggle-btn')) {
        const btn = document.createElement('button');
        btn.id = 'msba-toggle-btn';
        btn.innerHTML = '🎓';
        btn.style.cssText = 'position:fixed;right:20px;bottom:20px;width:60px;height:60px;background:#003DA5;color:white;border:none;border-radius:50%;font-size:24px;cursor:pointer;z-index:999999;box-shadow:0 4px 12px rgba(0,61,165,0.3);';
        btn.title = 'Toggle MSBA AI Assistant';
        btn.onclick = () => {
            if (window.msbaAgent) {
                window.msbaAgent.toggleSidebar();
            } else {
                alert('MSBA Agent not initialized. Please refresh the page.');
            }
        };
        document.body.appendChild(btn);
        console.log('✅ Floating button created');
    }
    
    console.log('✅ MSBA Agent debug script completed');
})();
```

---

**如果以上都不行，请提供：**
1. 浏览器控制台的完整错误信息
2. 运行 `window.msbaAgent` 的输出
3. 运行 `document.getElementById('msba-toggle-btn')` 的输出

