# 🐛 调试脚本未加载问题

## 问题
控制台显示 `typeof MSBAAgent` 返回 `undefined`，说明扩展脚本没有加载。

## 检查步骤

### 1. 检查扩展是否启用
- `chrome://extensions/` → 确认 "UCLA MSBA AI Assistant" 开关是**蓝色**（已启用）

### 2. 检查脚本文件是否存在
在控制台运行（测试脚本是否能被访问）：

```javascript
// 检查扩展脚本是否注入
console.log('检查扩展脚本...');
console.log('MSBAAgent:', typeof MSBAAgent);
console.log('MSBAKnowledgeBase:', typeof MSBAKnowledgeBase);
console.log('MSBALangChainAdapter:', typeof MSBALangChainAdapter);
console.log('ReactLike:', typeof ReactLike);
```

### 3. 检查扩展错误
1. 打开 `chrome://extensions/`
2. 找到 "UCLA MSBA AI Assistant"
3. 点击 "Errors" 按钮（如果有）
4. 查看错误信息

### 4. 检查 Content Scripts
1. 打开 `chrome://extensions/`
2. 找到 "UCLA MSBA AI Assistant"
3. 点击 "Details"（详细信息）
4. 查看 "Inspect views" → "service worker"
5. 查看是否有错误

### 5. 手动测试脚本加载
在控制台运行：

```javascript
// 检查脚本文件路径
chrome.runtime.getURL('msba-agent.js');
```

### 6. 重新加载扩展
1. 在 `chrome://extensions/` 页面
2. 点击扩展的**刷新按钮**（不是移除）
3. 刷新网页（`Command + R`）
4. 等待 3-5 秒
5. 在控制台检查：`typeof MSBAAgent`

## 快速修复脚本

如果脚本还是没有加载，在控制台运行这个来手动加载：

```javascript
// 手动加载脚本（如果扩展脚本失败）
(async function() {
    const scripts = [
        'msba-knowledge-base.js',
        'msba-langchain-adapter.js', 
        'msba-react-components.jsx',
        'msba-agent.js'
    ];
    
    for (const script of scripts) {
        try {
            const url = chrome.runtime.getURL(script);
            const response = await fetch(url);
            const code = await response.text();
            eval(code);
            console.log('✅ 加载:', script);
        } catch (error) {
            console.error('❌ 加载失败:', script, error);
        }
    }
    
    // 初始化
    if (typeof MSBAAgent !== 'undefined') {
        window.msbaAgent = new MSBAAgent();
        console.log('✅ Agent 已初始化');
    }
})();
```

## 常见问题

### 问题1：脚本文件路径错误
- 检查 `manifest.json` 中的 `content_scripts` 路径是否正确
- 确保文件在 `msba-agent` 文件夹中

### 问题2：脚本有语法错误
- 检查浏览器控制台是否有红色错误
- 检查扩展的 "Errors" 页面

### 问题3：扩展未启用
- 确认扩展开关是**蓝色**（已启用）

### 问题4：页面刷新后脚本丢失
- 这是正常的，content scripts 每次页面加载都会重新注入
- 确保扩展已启用

