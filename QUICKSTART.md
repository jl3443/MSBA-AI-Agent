# 🚀 Quick Start Guide - UCLA MSBA AI Assistant

## Installation (5 minutes)

### 1. Load Extension

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `msba-agent` folder
5. ✅ Done!

### 2. Configure API Key

1. Click the 🎓 icon in Chrome toolbar
2. Enter your API key (DeepSeek or OpenAI)
3. Select model (recommended: DeepSeek-V3.1 Thinking Mode)
4. Click **Save Settings**

### 3. Start Using

- Click the 🎓 button on any webpage (bottom right)
- Or press `Ctrl+Shift+M` (Windows) / `Cmd+Shift+M` (Mac)
- Ask questions about MSBA program!

## Example Questions

Try these to test the agent:

```
"What are the MSBA prerequisites?"
"How much does the program cost?"
"What is the program duration?"
"Tell me about career outcomes"
"What are the admission requirements?"
```

## Troubleshooting

**Extension not showing?**
- Check Developer mode is enabled
- Reload the extension
- Check Chrome console for errors

**API key not working?**
- Verify key starts with "sk-"
- Check API key is valid at platform.deepseek.com or platform.openai.com
- Ensure you have API credits/quota

**Assistant not responding?**
- Check API key is saved correctly
- Verify network connection
- Check browser console for errors

## Architecture Overview

```
User Query
    ↓
Router Chain (Intent Detection)
    ↓
ReAct Chain (Reasoning + Acting)
    ↓
Tool Execution (Knowledge Search)
    ↓
Vector DB + Relational Storage
    ↓
Response Generation
    ↓
User (with CTA to website)
```

## Next Steps

- Read [README.md](./README.md) for detailed documentation
- Check [MSBA Impact Analysis Report](../GOOGLE%20DATA/MSBA_AI_Chatbot_Impact_Analysis_Full_Report_EN.md) for background
- Customize knowledge base in `msba-knowledge-base.js`
- Add new tools in `msba-langchain-adapter.js`

---

**Need Help?** Check the full [README.md](./README.md) or review the impact analysis report.

