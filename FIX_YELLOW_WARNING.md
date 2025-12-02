# 🔧 修复黄色警告（Content Scripts）

## 问题
Chrome 显示黄色警告，说明找不到 content_scripts 中列出的文件。

## 解决方案

### 方法1：完全重新加载扩展（推荐）

1. **移除扩展**
   - `chrome://extensions/` → 找到 "UCLA MSBA AI Assistant"
   - 点击 "Remove"（移除）
   - 确认移除

2. **重新加载扩展**
   - 点击 "Load unpacked"（加载已解压的扩展程序）
   - **重要**：选择这个文件夹：
     ```
     /Users/kyle/Downloads/Kyle-s-AI-Agent-main/msba-agent
     ```
   - 确认加载

3. **验证**
   - 扩展应该显示为"已启用"（蓝色开关）
   - **不应该**再有黄色警告
   - 如果有，继续下一步

### 方法2：检查文件路径

确认你选择的文件夹包含这些文件：
- ✅ `manifest.json`
- ✅ `msba-knowledge-base.js`
- ✅ `msba-langchain-adapter.js`
- ✅ `msba-react-components.jsx`
- ✅ `msba-agent.js`
- ✅ `popup.html`
- ✅ `popup.js`
- ✅ `background.js`

### 方法3：检查文件权限

在终端运行：

```bash
cd /Users/kyle/Downloads/Kyle-s-AI-Agent-main/msba-agent
ls -la *.js *.jsx
```

所有文件应该显示 `-rw-r--r--`（可读权限）。

### 方法4：验证文件内容

确认文件不是空的：

```bash
cd /Users/kyle/Downloads/Kyle-s-AI-Agent-main/msba-agent
wc -l *.js *.jsx
```

应该显示每个文件都有内容（行数 > 0）。

## 如果还是不行

### 检查1：扩展详情页面的错误

1. `chrome://extensions/` → 找到 "UCLA MSBA AI Assistant"
2. 点击 "Details"（详细信息）
3. 查看是否有错误信息
4. 点击 "Inspect views" → "service worker"
5. 查看控制台错误

### 检查2：手动验证文件

在 Finder 中：
1. 打开文件夹：`/Users/kyle/Downloads/Kyle-s-AI-Agent-main/msba-agent`
2. 确认能看到所有 `.js` 和 `.jsx` 文件
3. 双击 `manifest.json`，确认能正常打开

### 检查3：重新创建扩展

如果以上都不行：
1. 备份 `msba-agent` 文件夹
2. 创建一个新的空文件夹
3. 复制所有文件到新文件夹
4. 重新加载新文件夹

---

**最可能的原因**：扩展加载的文件夹路径不对，或者文件权限问题。

**推荐操作**：完全移除扩展，然后重新加载 `msba-agent` 文件夹。

