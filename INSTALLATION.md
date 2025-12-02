# 🚀 Installation Guide - UCLA MSBA AI Assistant

## ✅ Quick Fix Applied

The icon requirement has been **temporarily removed** from `manifest.json`. The extension should now load successfully without icon files.

## 📦 Installation Steps

### 1. Load Extension

1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the `msba-agent` folder
6. ✅ Extension should load successfully!

### 2. Configure API Key

1. Click the extension icon in Chrome toolbar (may show default icon)
2. Enter your API key:
   - **DeepSeek**: [platform.deepseek.com](https://platform.deepseek.com)
   - **OpenAI**: [platform.openai.com](https://platform.openai.com)
3. Select model (recommended: DeepSeek-V3.1 Thinking Mode)
4. Click **Save Settings**

### 3. Start Using

- Click the 🎓 button on any webpage (bottom right)
- Or press `Ctrl+Shift+M` (Windows) / `Cmd+Shift+M` (Mac)
- Ask questions about MSBA program!

## 🎨 Adding Icons (Optional)

If you want custom icons:

### Method 1: HTML Generator (Easiest)

1. Open `create-icons.html` in your browser
2. Click **"Download All Icons"**
3. Save the 3 PNG files to `msba-agent` folder
4. Add this to `manifest.json`:

```json
"icons": {
  "16": "icon16.png",
  "48": "icon48.png",
  "128": "icon128.png"
},
"action": {
  "default_popup": "popup.html",
  "default_title": "UCLA MSBA AI Assistant",
  "default_icon": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  }
}
```

5. Reload the extension

### Method 2: Python Script

```bash
pip install Pillow
python3 generate-icons.py
```

Then add icons back to manifest.json as shown above.

## 🐛 Troubleshooting

**Extension still won't load?**
- Check browser console for errors (F12)
- Verify all files are in the `msba-agent` folder
- Make sure `manifest.json` is valid JSON

**API key not working?**
- Verify key starts with "sk-"
- Check API key is valid at provider website
- Ensure you have API credits/quota

**Assistant not responding?**
- Check API key is saved correctly
- Verify network connection
- Check browser console (F12) for errors

## ✅ Verification

After installation, you should see:
- Extension icon in Chrome toolbar
- Settings popup when clicking icon
- 🎓 button appears on webpages
- Assistant sidebar opens when clicking button

---

**Need help?** See [README.md](./README.md) for full documentation.

