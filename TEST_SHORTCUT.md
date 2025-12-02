# 🔧 测试 Command+K 快捷键

## 问题诊断

如果按 `Command+K` 没有反应，请按以下步骤检查：

### 步骤1：检查 Agent 是否初始化

在控制台（`Command + Option + J`）运行：

```javascript
// 检查 Agent
console.log('MSBA Agent:', window.msbaAgent);
console.log('MSBAAgent class:', typeof MSBAAgent);
```

如果返回 `undefined`，说明 Agent 没有初始化。

### 步骤2：手动初始化

在控制台运行：

```javascript
// 手动初始化
if (typeof MSBAAgent !== 'undefined') {
    window.msbaAgent = new MSBAAgent();
    console.log('✅ Agent initialized');
} else {
    console.log('❌ MSBAAgent class not found - extension scripts not loaded');
}
```

### 步骤3：测试快捷键监听

在控制台运行：

```javascript
// 测试快捷键
document.addEventListener('keydown', function(e) {
    console.log('Key pressed:', {
        key: e.key,
        metaKey: e.metaKey,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey
    });
}, true);

// 然后按 Command+K，查看控制台输出
```

### 步骤4：手动触发 toggle

在控制台运行：

```javascript
// 手动触发
if (window.msbaAgent) {
    window.msbaAgent.toggleSidebar();
} else {
    console.log('Agent not initialized');
}
```

### 步骤5：检查快捷键冲突

1. 访问 `chrome://extensions/shortcuts`
2. 查看是否有其他扩展使用 `Command+K`
3. 如果有冲突，修改其中一个

## 快速修复

如果以上都不行，在控制台运行这个完整修复脚本：

```javascript
// 完整修复脚本
(function() {
    // 1. 确保 Agent 初始化
    if (typeof MSBAAgent !== 'undefined' && !window.msbaAgent) {
        window.msbaAgent = new MSBAAgent();
        console.log('✅ Agent initialized');
    }
    
    // 2. 添加全局快捷键监听
    document.addEventListener('keydown', function(e) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const modifierKey = isMac ? e.metaKey : e.ctrlKey;
        
        if (modifierKey && e.key.toLowerCase() === 'k') {
            if (window.msbaAgent) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎓 Command+K - Toggling MSBA sidebar');
                window.msbaAgent.toggleSidebar();
            }
        }
    }, true);
    
    console.log('✅ Shortcut handler installed');
})();
```

然后按 `Command+K` 测试。

