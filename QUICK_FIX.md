# 🔧 快速修复 - MSBAAgent is not defined

## 问题
按钮已创建，但点击时出现错误：`MSBAAgent is not defined`

## 原因
扩展脚本还没有加载完成，或者脚本加载顺序有问题。

## 解决方案

### 方法1：等待脚本加载后再创建按钮

在控制台运行这个代码（会等待脚本加载）：

```javascript
// 等待 MSBAAgent 加载
function waitForMSBAAgent() {
    if (typeof MSBAAgent !== 'undefined') {
        console.log('✅ MSBAAgent 已加载');
        createButton();
    } else {
        console.log('⏳ 等待 MSBAAgent 加载...');
        setTimeout(waitForMSBAAgent, 500);
    }
}

function createButton() {
    // 移除已存在的按钮
    const old = document.getElementById('msba-toggle-btn');
    if (old) old.remove();
    
    const btn = document.createElement('button');
    btn.id = 'msba-toggle-btn';
    btn.innerHTML = '🎓';
    btn.style.cssText = 'position:fixed;right:20px;bottom:20px;width:60px;height:60px;background:#003DA5;color:white;border:none;border-radius:50%;font-size:24px;cursor:pointer;z-index:999999;box-shadow:0 4px 12px rgba(0,61,165,0.3);display:flex;align-items:center;justify-content:center;';
    
    btn.onclick = function() {
        if (window.msbaAgent) {
            window.msbaAgent.toggleSidebar();
        } else if (typeof MSBAAgent !== 'undefined') {
            window.msbaAgent = new MSBAAgent();
            setTimeout(function() {
                window.msbaAgent.toggleSidebar();
            }, 500);
        } else {
            alert('MSBA Agent 脚本还未加载。请刷新页面重试。');
        }
    };
    
    document.body.appendChild(btn);
    console.log('✅ 按钮已创建！');
}

// 开始等待
waitForMSBAAgent();
```

### 方法2：刷新页面让脚本加载

1. **刷新页面**（按 `Command + R` 或 `F5`）
2. 等待页面完全加载（3-5秒）
3. 在控制台运行上面的代码

### 方法3：检查脚本是否加载

在控制台运行：

```javascript
// 检查脚本是否加载
console.log('MSBAAgent:', typeof MSBAAgent);
console.log('MSBALangChainAdapter:', typeof MSBALangChainAdapter);
console.log('MSBAKnowledgeBase:', typeof MSBAKnowledgeBase);
console.log('window.msbaAgent:', window.msbaAgent);
```

如果都返回 `undefined`，说明脚本还没加载。

### 方法4：手动加载脚本（如果扩展有问题）

如果扩展脚本一直不加载，可能是扩展配置问题。检查：

1. `chrome://extensions/` - 确认扩展已启用
2. 检查是否有错误（红色错误信息）
3. 重新加载扩展

---

**推荐操作顺序：**
1. 刷新页面（`Command + R`）
2. 等待5秒
3. 运行"方法1"的代码
4. 点击右下角的 🎓 按钮

