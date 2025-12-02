# 🔄 完全重新加载扩展 - 解决黄色警告

## 问题
黄色警告说明 Chrome 找不到 content_scripts 中的文件。

## 解决步骤（按顺序执行）

### 步骤1：完全移除扩展

1. 打开 `chrome://extensions/`
2. 找到 "UCLA MSBA AI Assistant"
3. 点击 **"Remove"**（移除）按钮
4. 确认移除

### 步骤2：确认文件夹路径

在 Finder 中打开：
```
/Users/kyle/Downloads/Kyle-s-AI-Agent-main/msba-agent
```

确认能看到这些文件：
- ✅ `manifest.json`
- ✅ `msba-knowledge-base.js`
- ✅ `msba-langchain-adapter.js`
- ✅ `msba-react-components.jsx`
- ✅ `msba-agent.js`
- ✅ `popup.html`
- ✅ `popup.js`
- ✅ `background.js`

### 步骤3：重新加载扩展

1. 在 `chrome://extensions/` 页面
2. 确保"开发者模式"已启用（右上角开关是蓝色）
3. 点击 **"Load unpacked"**（加载已解压的扩展程序）
4. **重要**：选择 `msba-agent` 文件夹
   - 路径：`/Users/kyle/Downloads/Kyle-s-AI-Agent-main/msba-agent`
   - **不要**选择 `Kyle-s-AI-Agent-main` 文件夹
5. 点击"选择"

### 步骤4：验证加载成功

加载后应该看到：
- ✅ 扩展名称：UCLA MSBA AI Assistant
- ✅ 版本：1.0.0
- ✅ 状态：已启用（开关是蓝色）
- ✅ **没有黄色警告**
- ✅ **没有红色错误**

### 步骤5：测试

1. 打开任意网页（例如 MSBA 官网）
2. 按 `Command + K`（Mac）
3. 应该会打开 MSBA AI Assistant 侧边栏

## 如果还有黄色警告

### 检查1：文件是否存在

在终端运行：

```bash
cd /Users/kyle/Downloads/Kyle-s-AI-Agent-main/msba-agent
ls -la msba-*.js msba-*.jsx
```

应该看到所有文件。

### 检查2：文件内容

在终端运行：

```bash
cd /Users/kyle/Downloads/Kyle-s-AI-Agent-main/msba-agent
head -3 msba-knowledge-base.js
head -3 msba-langchain-adapter.js
head -3 msba-react-components.jsx
head -3 msba-agent.js
```

每个文件都应该显示内容（不是空的）。

### 检查3：文件权限

在终端运行：

```bash
cd /Users/kyle/Downloads/Kyle-s-AI-Agent-main/msba-agent
chmod 644 *.js *.jsx manifest.json
```

然后重新加载扩展。

---

**关键点**：
1. ✅ 完全移除旧扩展
2. ✅ 选择正确的 `msba-agent` 文件夹（不是父文件夹）
3. ✅ 确认所有文件都存在

请按照这些步骤操作，然后告诉我结果！

