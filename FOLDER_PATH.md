# 📁 MSBA Agent 文件夹路径

## 完整路径

```
/Users/kyle/Downloads/Kyle-s-AI-Agent-main/msba-agent
```

## 在 Finder 中打开

1. 打开 Finder
2. 按 `Command + Shift + G`（前往文件夹）
3. 输入：`/Users/kyle/Downloads/Kyle-s-AI-Agent-main/msba-agent`
4. 按回车

## 在终端中打开

```bash
cd /Users/kyle/Downloads/Kyle-s-AI-Agent-main/msba-agent
open .
```

## 检查文件

确保以下文件都存在：

- ✅ `manifest.json` - 扩展配置文件
- ✅ `popup.html` - 设置弹窗
- ✅ `popup.js` - 设置逻辑
- ✅ `background.js` - 后台服务
- ✅ `msba-agent.js` - 主 Agent 文件
- ✅ `msba-langchain-adapter.js` - LangChain 适配器
- ✅ `msba-knowledge-base.js` - 知识库
- ✅ `msba-react-components.jsx` - React 组件

## 在 Chrome 中加载

1. 打开 `chrome://extensions/`
2. 启用"开发者模式"（右上角）
3. 点击"Load unpacked"（加载已解压的扩展程序）
4. **选择这个文件夹**：`/Users/kyle/Downloads/Kyle-s-AI-Agent-main/msba-agent`

## 验证加载

加载后应该看到：
- 扩展名称：**UCLA MSBA AI Assistant**
- 版本：**1.0.0**
- 描述：AI-powered assistant for UCLA Anderson MSBA program...

## 如果加载错误

检查：
1. 是否选择了正确的 `msba-agent` 文件夹（不是 `Kyle-s-AI-Agent-main`）
2. `manifest.json` 文件是否存在
3. 是否有错误信息（红色文字）

