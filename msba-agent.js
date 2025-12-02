/**
 * UCLA MSBA AI Agent - Main Entry Point
 * Integrates LangChain adapter, React components, and knowledge base
 */

class MSBAAgent {
    constructor() {
        this.adapter = null;
        this.sidebar = null;
        this.isInitialized = false;
        this.isVisible = false;
        this.init();
    }

    async init() {
        console.log('🎓 UCLA MSBA AI Agent initializing...');

        // Load API settings
        await this.loadSettings();

        // Initialize knowledge base (always initialize, even without API key)
        if (!window.msbaKnowledgeBase) {
            window.msbaKnowledgeBase = new MSBAKnowledgeBase();
        }

        // Create UI (always create UI, even without API key)
        this.createSidebar();

        // Setup event listeners
        this.setupEventListeners();

        // Initialize LangChain adapter (only if API key exists)
        if (this.apiKey) {
            try {
                this.adapter = new MSBALangChainAdapter(this.apiKey, this.model);
                console.log('✅ MSBA LangChain adapter initialized');
            } catch (error) {
                console.error('❌ Failed to initialize adapter:', error);
            }
        } else {
            console.warn('⚠️ API key not configured. UI is ready, but please configure API key in extension popup.');
        }

        // Listen for settings updates and toggle commands
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.type === 'SETTINGS_UPDATED') {
                this.loadSettings().then(() => {
                    if (this.apiKey) {
                        this.adapter = new MSBALangChainAdapter(this.apiKey, this.model);
                    }
                });
            }
            if (message.type === 'TOGGLE_SIDEBAR') {
                this.toggleSidebar();
            }
        });

        this.isInitialized = true;
        console.log('✅ UCLA MSBA AI Agent initialized');
    }

    async loadSettings() {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['msbaApiKey', 'msbaModel'], (result) => {
                this.apiKey = result.msbaApiKey;
                this.model = result.msbaModel || 'deepseek-reasoner';
                resolve();
            });
        });
    }

    createSidebar() {
        // Check if sidebar already exists（和原版一样）
        if (document.getElementById('msba-ai-sidebar')) {
            return;
        }

        // Add styles
        this.addStyles();

        // Create sidebar directly（简化，参考原版）
        const sidebar = document.createElement('div');
        sidebar.id = 'msba-ai-sidebar';
        sidebar.className = 'msba-sidebar msba-hidden'; // 初始隐藏，和原版一样
        
        // 使用 React-like 组件创建内容
        const sidebarContent = MSBASidebar({
            adapter: this.adapter,
            onClose: () => this.toggleSidebar()
        });
        
        // 将内容添加到侧边栏
        if (sidebarContent) {
            if (sidebarContent.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                // 如果是 DocumentFragment，需要将其子节点添加
                while (sidebarContent.firstChild) {
                    sidebar.appendChild(sidebarContent.firstChild);
                }
            } else {
                sidebar.appendChild(sidebarContent);
            }
        }

        // 插入页面（和原版一样）
        document.body.appendChild(sidebar);
        
        console.log('✅ MSBA 侧边栏UI已创建');
    }

    addStyles() {
        if (document.getElementById('msba-styles')) return;

        const style = document.createElement('style');
        style.id = 'msba-styles';
        style.textContent = `
            /* UCLA Anderson Brand Colors */
            :root {
                /* UCLA Anderson Colors - Lighter blue, yellow, minimal black */
                --ucla-blue: #0055CC; /* Lighter blue than #003DA5 */
                --ucla-blue-light: #4A90E2; /* Even lighter blue */
                --ucla-blue-dark: #003DA5; /* Original blue for accents */
                --ucla-yellow: #FFD100;
                --ucla-yellow-light: #FFF9E6;
                --ucla-black: #1A1A1A; /* Minimal black, softer than pure black */
                --ucla-gray: #666666;
            }

            /* Sidebar（和原版 Kyle's Agent 一样的结构） */
            #msba-ai-sidebar {
                position: fixed;
                right: 0;
                top: 0;
                width: 420px;
                height: 100vh;
                background: #ffffff;
                border-left: 3px solid var(--ucla-yellow);
                box-shadow: -4px 0 12px rgba(0, 85, 204, 0.2);
                display: flex;
                flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                z-index: 999999;
                transition: transform 0.3s ease;
            }

            #msba-ai-sidebar.msba-hidden {
                transform: translateX(100%);
            }

            /* Header */
            .msba-header {
                padding: 20px;
                background: linear-gradient(135deg, var(--ucla-blue) 0%, var(--ucla-blue-light) 100%);
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                border-bottom: 3px solid var(--ucla-yellow);
            }

            .msba-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .msba-header-logo {
                display: inline-flex;
                align-items: center;
                gap: 0;
                background: white;
                padding: 4px 8px;
                border-radius: 4px;
            }

            .msba-header-logo-ucla {
                background: var(--ucla-blue-dark);
                color: white;
                padding: 4px 8px;
                font-weight: 700;
                font-size: 14px;
                border-radius: 3px 0 0 3px;
            }

            .msba-header-logo-anderson {
                color: var(--ucla-black);
                padding: 4px 8px;
                font-weight: 700;
                font-size: 14px;
                border-radius: 0 3px 3px 0;
            }

            .msba-header-logo-school {
                color: var(--ucla-gray);
                padding: 4px 8px 4px 0;
                font-weight: 400;
                font-size: 11px;
            }

            #msba-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                font-size: 24px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
            }

            #msba-close:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            /* Message List */
            .msba-message-list {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: #fafafa;
            }

            .msba-message {
                margin-bottom: 16px;
                display: flex;
                flex-direction: column;
            }

            .msba-message-user {
                align-items: flex-end;
            }

            .msba-message-assistant {
                align-items: flex-start;
            }

            .msba-message-content {
                max-width: 80%;
                padding: 12px 16px;
                border-radius: 12px;
                line-height: 1.5;
                font-size: 14px;
            }

            .msba-message-user .msba-message-content {
                background: var(--ucla-blue);
                color: white;
                border-bottom-right-radius: 4px;
                box-shadow: 0 2px 4px rgba(0, 85, 204, 0.2);
            }

            .msba-message-assistant .msba-message-content {
                background: white;
                color: var(--ucla-black);
                border: 1px solid #e0e0e0;
                border: 1px solid #e0e0e0;
                border-bottom-left-radius: 4px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }

            .msba-message-content strong {
                color: var(--ucla-blue);
                font-weight: 600;
            }

            /* Modern button-style links - Clean and elegant */
            .msba-link-button {
                display: inline-flex;
                margin: 6px 6px 6px 0;
                background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                border: 1.5px solid var(--ucla-blue);
                border-radius: 6px;
                box-shadow: 0 1px 3px rgba(0, 85, 204, 0.12);
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
            }

            .msba-link-button:hover {
                box-shadow: 0 4px 12px rgba(0, 85, 204, 0.2);
                border-color: var(--ucla-yellow);
                background: linear-gradient(135deg, var(--ucla-yellow-light) 0%, #ffffff 100%);
                transform: translateY(-1px);
            }

            .msba-link-button a {
                display: flex;
                align-items: center;
                padding: 8px 16px;
                color: var(--ucla-blue-dark);
                text-decoration: none;
                font-weight: 600;
                font-size: 13px;
                line-height: 1.5;
                letter-spacing: 0.01em;
            }

            .msba-link-button a:hover {
                color: var(--ucla-blue-dark);
                text-decoration: none;
            }

            /* Arrow styling - arrow is already in the text, just style it */
            .msba-link-button a {
                position: relative;
            }

            /* Video Container Styles - Compact Format */
            .msba-video-container {
                margin: 16px 0;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                max-width: 480px; /* Limit video width */
            }

            .msba-video-title-top {
                padding: 12px 16px 10px 16px;
                color: var(--ucla-black);
                font-size: 14px;
                font-weight: 600;
                line-height: 1.4;
                background: white;
                border-bottom: 1px solid #e0e0e0;
            }

            .msba-video-wrapper {
                position: relative;
                padding-bottom: 56.25%; /* 16:9 aspect ratio */
                height: 0;
                overflow: hidden;
                background: #000;
            }

            .msba-video-iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
            }

            /* Remove old CTA style */
            .msba-cta {
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid #e0e0e0;
            }

            .msba-cta a {
                color: var(--ucla-blue);
                text-decoration: none;
                font-weight: 600;
                font-size: 13px;
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }

            .msba-cta a:hover {
                text-decoration: underline;
            }

            /* Thinking Indicator - UCLA Style Loading */
            .msba-thinking {
                padding: 16px 20px;
                background: var(--ucla-yellow-light);
                border-top: 2px solid var(--ucla-yellow);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
            }

            .msba-thinking-spinner {
                width: 20px;
                height: 20px;
                border: 3px solid var(--ucla-yellow-light);
                border-top: 3px solid var(--ucla-blue);
                border-radius: 50%;
                animation: msba-spin 0.8s linear infinite;
            }

            @keyframes msba-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .msba-thinking-text {
                color: var(--ucla-blue-dark);
                font-size: 13px;
                font-weight: 500;
                letter-spacing: 0.5px;
            }

            /* Input Area */
            .msba-input-area {
                padding: 16px 20px;
                background: var(--ucla-yellow-light);
                border-top: 2px solid var(--ucla-yellow);
            }

            #msba-input {
                width: 100%;
                padding: 12px;
                border: 2px solid var(--ucla-blue);
                border-radius: 8px;
                font-size: 14px;
                font-family: inherit;
                resize: none;
                margin-bottom: 12px;
                transition: border-color 0.2s;
                background: white;
                color: var(--ucla-black);
            }

            #msba-input:focus {
                outline: none;
                border-color: var(--ucla-yellow);
                box-shadow: 0 0 0 3px rgba(255, 209, 0, 0.2);
            }

            .msba-send-btn {
                width: 100%;
                padding: 12px;
                background: var(--ucla-blue);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                box-shadow: 0 2px 4px rgba(0, 85, 204, 0.3);
            }

            .msba-send-btn:hover {
                background: var(--ucla-blue-light);
                transform: translateY(-1px);
                box-shadow: 0 3px 6px rgba(0, 85, 204, 0.4);
            }

            .msba-send-btn:disabled {
                background: var(--ucla-gray);
                cursor: not-allowed;
                transform: none;
            }


            /* Scrollbar Styling */
            .msba-message-list::-webkit-scrollbar {
                width: 6px;
            }

            .msba-message-list::-webkit-scrollbar-track {
                background: #f1f1f1;
            }

            .msba-message-list::-webkit-scrollbar-thumb {
                background: var(--ucla-blue);
                border-radius: 3px;
            }

            .msba-message-list::-webkit-scrollbar-thumb:hover {
                background: var(--ucla-blue-light);
            }
        `;

        document.head.appendChild(style);
    }

    async setupEventListeners() {
        // Load and display chat history first
        await this.loadChatHistory();
        
        // Send button
        const sendBtn = document.getElementById('msba-send');
        const input = document.getElementById('msba-input');
        const closeBtn = document.getElementById('msba-close');
        const messageList = document.getElementById('msba-messages');

        if (sendBtn && input) {
            sendBtn.addEventListener('click', () => this.handleSend());
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSend();
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.toggleSidebar());
        }

        // 快捷键 Command+K / Ctrl+K（和原版 Kyle's Agent 一样）
        const self = this; // 保存 this 引用
        document.addEventListener('keydown', function(e) {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modifierKey = isMac ? e.metaKey : e.ctrlKey;

            if (modifierKey && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎓 Command+K pressed, toggling sidebar...');
                if (window.msbaAgent) {
                    window.msbaAgent.toggleSidebar();
                } else if (self) {
                    self.toggleSidebar();
                } else {
                    console.warn('MSBA Agent not found');
                }
            }
        }, true); // 使用 capture phase
    }
    
    /**
     * Load chat history from memory and display it
     */
    async loadChatHistory() {
        try {
            await this.adapter.memory.loadChatHistory();
            const history = this.adapter.memory.getRecentHistory(50);
            
            const messagesContainer = document.getElementById('msba-messages');
            if (!messagesContainer) {
                console.warn('MSBA Agent: Messages container not found');
                return;
            }
            
            // Clear existing messages
            messagesContainer.innerHTML = '';
            
            // Display all history messages
            for (const msg of history) {
                if (msg.role === 'user' || msg.role === 'assistant') {
                    const messageElement = MSBAMessage({
                        role: msg.role,
                        content: msg.content,
                        timestamp: msg.timestamp || Date.now()
                    });
                    messagesContainer.appendChild(messageElement);
                }
            }
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            console.log(`✅ Loaded ${history.length} messages from chat history`);
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }


    async toggleSidebar() {
        // 简化版：直接参考原版 Kyle's Agent 的逻辑
        const sidebar = document.getElementById('msba-ai-sidebar');
        if (!sidebar) {
            // 如果不存在，创建它
            this.createSidebar();
            // 等待创建完成后再次调用
            setTimeout(() => this.toggleSidebar(), 100);
            return;
        }

        // 简单的 toggle，和原版一样
        const wasHidden = sidebar.classList.contains('msba-hidden');
        sidebar.classList.toggle('msba-hidden');

        // 如果显示，加载聊天历史并聚焦输入框（和原版一样）
        if (!sidebar.classList.contains('msba-hidden') && wasHidden) {
            // Load chat history when opening
            await this.loadChatHistory();
            
            const input = document.getElementById('msba-input');
            if (input) {
                setTimeout(() => input.focus(), 100);
            }
        }
    }

    async handleSend() {
        const input = document.getElementById('msba-input');
        const sendBtn = document.getElementById('msba-send');
        const messageList = document.getElementById('msba-messages');
        const thinkingIndicator = document.getElementById('msba-thinking');

        if (!input || !input.value.trim()) return;

        // Check if API key is configured
        if (!this.apiKey || !this.adapter) {
            this.addMessage('assistant', '⚠️ Please configure your API key first!\n\n1. Click the extension icon in Chrome toolbar\n2. Enter your API key (DeepSeek or OpenAI)\n3. Click "Save Settings"\n4. Refresh this page\n\nThen you can ask questions about MSBA program!');
            input.value = '';
            return;
        }

        const userMessage = input.value.trim();
        input.value = '';
        sendBtn.disabled = true;

        // Add user message
        this.addMessage('user', userMessage);

        // Show thinking indicator
        if (thinkingIndicator) {
            thinkingIndicator.style.display = 'flex';
        }

        try {
            // Use ReAct framework to route and process
            const response = await this.adapter.route(userMessage);
            
            // Add assistant response
            this.addMessage('assistant', response);
        } catch (error) {
            console.error('Error processing message:', error);
            this.addMessage('assistant', 'Sorry, I encountered an error. Please check your API key settings or try again.');
        } finally {
            sendBtn.disabled = false;
            if (thinkingIndicator) {
                thinkingIndicator.style.display = 'none';
            }
        }
    }

    addMessage(role, content) {
        const messageList = document.getElementById('msba-messages');
        if (!messageList) return;

        const messageElement = MSBAMessage({
            role: role,
            content: content,
            timestamp: Date.now()
        });

        messageList.appendChild(messageElement);
        messageList.scrollTop = messageList.scrollHeight;
    }
}

// 初始化（和原版 Kyle's Agent 完全一样的方式）
if (typeof window.msbaAgent === 'undefined') {
    window.msbaAgent = new MSBAAgent();
    console.log('✅ UCLA MSBA AI Agent 已加载');
}

