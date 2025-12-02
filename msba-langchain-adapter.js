/**
 * UCLA MSBA AI Agent - LangChain Adapter with ReAct Framework
 * Based on recommendations: LangGraph/CrewAI patterns, Vector DB + Relational Storage, ReAct framework
 */

/**
 * LangChain Adapter for MSBA Agent
 * Implements ReAct (Reasoning + Acting) framework for planning and execution
 */
class MSBALangChainAdapter {
    constructor(apiKey, model = 'deepseek-reasoner') {
        this.apiKey = apiKey;
        this.model = model;
        this.memory = new MSBAMemorySystem(); // Vector DB + Relational Storage
        this.tools = new MSBAToolRegistry();
        this.chains = new MSBAChainRegistry();
        
        // Register MSBA-specific tools
        this.registerMSBATools();
        
        // Register chains (ReAct-based)
        this.registerMSBAChains();
    }

    /**
     * Register MSBA-specific tools
     */
    registerMSBATools() {
        // Prerequisites lookup tool
        this.tools.register('prerequisites_lookup', {
            name: 'prerequisites_lookup',
            description: 'Look up MSBA program prerequisites and requirements',
            execute: async (query) => {
                return await this.memory.searchKnowledge('prerequisites', query);
            }
        });

        // Fees and financing tool
        this.tools.register('fees_lookup', {
            name: 'fees_lookup',
            description: 'Look up MSBA program fees, tuition, and financing options',
            execute: async (query) => {
                return await this.memory.searchKnowledge('fees', query);
            }
        });

        // Admissions information tool
        this.tools.register('admissions_lookup', {
            name: 'admissions_lookup',
            description: 'Look up MSBA admissions requirements, deadlines, and process',
            execute: async (query) => {
                return await this.memory.searchKnowledge('admissions', query);
            }
        });

        // Program structure tool
        this.tools.register('program_lookup', {
            name: 'program_lookup',
            description: 'Look up MSBA program structure, curriculum, and academics',
            execute: async (query) => {
                return await this.memory.searchKnowledge('program', query);
            }
        });

        // Career outcomes tool
        this.tools.register('career_lookup', {
            name: 'career_lookup',
            description: 'Look up MSBA career outcomes, placement, and alumni success',
            execute: async (query) => {
                return await this.memory.searchKnowledge('career', query);
            }
        });

        // FAQ search tool
        this.tools.register('faq_search', {
            name: 'faq_search',
            description: 'Search MSBA frequently asked questions',
            execute: async (query) => {
                return await this.memory.searchKnowledge('faq', query);
            }
        });

        // Events lookup tool
        this.tools.register('events_lookup', {
            name: 'events_lookup',
            description: 'Look up MSBA admissions events, information sessions, and webinars',
            execute: async (query) => {
                return await this.memory.searchKnowledge('events', query);
            }
        });

        // Videos lookup tool
        this.tools.register('videos_lookup', {
            name: 'videos_lookup',
            description: 'Look up MSBA program videos, student life videos, and informational videos',
            execute: async (query) => {
                return await this.memory.searchKnowledge('videos', query);
            }
        });
    }

    /**
     * Register MSBA-specific chains using ReAct framework
     */
    registerMSBAChains() {
        // ReAct Chain - Reasoning + Acting for MSBA queries
        this.chains.register('react', new MSBAReActChain(this));
        
        // Conversation Chain - Friendly dialogue
        this.chains.register('conversation', new MSBAConversationChain(this));
        
        // Router Chain - Intent detection and routing
        this.chains.register('router', new MSBARouterChain(this));
    }

    /**
     * Main entry point - Route user query using ReAct framework
     */
    async route(userQuery) {
        // Use router to determine intent
        const router = this.chains.get('router');
        const intent = await router.detectIntent(userQuery);
        
        // Use ReAct chain for MSBA-specific queries
        if (intent.type === 'msba_query') {
            return await this.chains.get('react').run(userQuery);
        }
        
        // Use conversation chain for general chat
        return await this.chains.get('conversation').run(userQuery);
    }

    /**
     * Call LLM API
     */
    async callLLM(messages, options = {}) {
        const isDeepSeek = this.model.startsWith('deepseek');
        const apiUrl = isDeepSeek 
            ? 'https://api.deepseek.com/v1/chat/completions'
            : 'https://api.openai.com/v1/chat/completions';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    temperature: options.temperature || 0.5, // Lower temperature for more focused, concise answers
                    max_tokens: options.max_tokens || 500 // Reduced from 2000 to 500 for shorter responses
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('LLM API call failed:', error);
            throw error;
        }
    }
}

/**
 * ReAct Chain - Reasoning + Acting framework
 * Based on: ReAct: Synergizing Reasoning and Acting in Language Models
 */
class MSBAReActChain {
    constructor(adapter) {
        this.adapter = adapter;
        this.maxIterations = 5;
    }

    async run(userQuery) {
        let thought = '';
        let action = '';
        let observation = '';
        let finalAnswer = '';
        
        const systemPrompt = this.getReActSystemPrompt();
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userQuery }
        ];

        // ReAct loop: Think -> Act -> Observe -> Think...
        for (let i = 0; i < this.maxIterations; i++) {
            // Step 1: Think (Reasoning)
            const thinkPrompt = this.buildThinkPrompt(userQuery, thought, action, observation);
            messages.push({ role: 'user', content: thinkPrompt });
            
            const reasoning = await this.adapter.callLLM(messages, { 
                max_tokens: 300, // Shorter reasoning steps
                temperature: 0.5 
            });
            
            // Parse reasoning output
            const parsed = this.parseReActOutput(reasoning);
            thought = parsed.thought || thought;
            action = parsed.action || '';
            
            // Step 2: Act (if action needed)
            if (action && action !== 'FINISH') {
                observation = await this.executeAction(action, parsed.actionInput || '');
                
                // Add observation to context
                messages.push({ 
                    role: 'assistant', 
                    content: `Thought: ${thought}\nAction: ${action}\nAction Input: ${parsed.actionInput || ''}` 
                });
                messages.push({ role: 'user', content: `Observation: ${observation}` });
            } else {
                // Step 3: Final Answer
                finalAnswer = parsed.answer || reasoning;
                
                // Enhance answer with links/videos if tool results contain URLs or videos
                if (observation && typeof observation === 'string') {
                    try {
                        const toolResults = JSON.parse(observation);
                        if (Array.isArray(toolResults) && toolResults.length > 0) {
                            const firstResult = toolResults[0];
                            
                            // Handle videos
                            if (firstResult.videos && Array.isArray(firstResult.videos)) {
                                for (const video of firstResult.videos) {
                                    if (video.youtubeId && !finalAnswer.includes(video.youtubeId)) {
                                        finalAnswer += `\n\n[Video: ${video.title}](youtube:${video.youtubeId})`;
                                    }
                                }
                            }
                            
                            // Handle URLs
                            if (firstResult.fullUrl) {
                                const linkText = firstResult.source || 'Learn more';
                                if (!finalAnswer.includes(firstResult.fullUrl) && !finalAnswer.includes(linkText)) {
                                    finalAnswer += `\n\n[${linkText}](${firstResult.fullUrl})`;
                                }
                            }
                        }
                    } catch (e) {
                        // Not JSON, ignore
                    }
                }
                
                break;
            }
        }

        // Ensure answer has links for common topics
        finalAnswer = this.enhanceAnswerWithLinks(finalAnswer, userQuery);

        // Save to memory
        await this.adapter.memory.addConversation(userQuery, finalAnswer);

        return finalAnswer;
    }

    /**
     * Enhance answer with relevant links and videos based on query topic
     * Keep it minimal - only add if link/video is missing
     */
    enhanceAnswerWithLinks(answer, query) {
        const lowerQuery = query.toLowerCase();
        const lowerAnswer = answer.toLowerCase();
        
        // Video-related queries - add video embeds
        if (lowerQuery.includes('video') || lowerQuery.includes('watch') || lowerQuery.includes('show me')) {
            if (!lowerAnswer.includes('youtube:') && !lowerAnswer.includes('msba-video-container')) {
                // Add main program overview video
                answer += `\n\n[Video: This Is What The Master of Science in Business Analytics Is All About](youtube:1hoFiu7BP08)`;
                // Add student life video if user asks about student experience
                if (lowerQuery.includes('student') || lowerQuery.includes('life') || lowerQuery.includes('day')) {
                    answer += `\n\n[Video: A Day in the Life of MSBA](youtube:xsALV8FO9JE)`;
                } else {
                    // Add student life video for general video queries
                    answer += `\n\n[Video: A Day in the Life of MSBA](youtube:xsALV8FO9JE)`;
                }
            }
        }
        
        // Only add link if not already present (to avoid making answer longer)
        if ((lowerQuery.includes('financial') || lowerQuery.includes('fee') || lowerQuery.includes('tuition') || lowerQuery.includes('cost'))) {
            if (!lowerAnswer.includes('anderson.ucla.edu') && !lowerAnswer.includes('msba-link-button')) {
                answer += ` [MSBA Tuition & Financing](https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admit-central/program-calendar-and-fees)`;
            }
        }
        
        if ((lowerQuery.includes('prerequisite') || lowerQuery.includes('requirement'))) {
            if (!lowerAnswer.includes('anderson.ucla.edu') && !lowerAnswer.includes('msba-link-button')) {
                answer += ` [MSBA Prerequisites](https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions/prerequisites)`;
            }
        }
        
        if ((lowerQuery.includes('admission') || lowerQuery.includes('apply') || lowerQuery.includes('application'))) {
            if (!lowerAnswer.includes('anderson.ucla.edu') && !lowerAnswer.includes('msba-link-button')) {
                answer += ` [MSBA Admissions](https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions)`;
            }
        }
        
        return answer;
    }

    getReActSystemPrompt() {
        return `You are the UCLA MSBA AI Assistant. Keep answers SHORT (2-3 sentences max).

Available tools:
- prerequisites_lookup: Look up prerequisites
- fees_lookup: Look up tuition/financing
- admissions_lookup: Look up admissions info
- program_lookup: Look up program structure
- career_lookup: Look up career outcomes
- faq_search: Search FAQs
- events_lookup: Look up events
- videos_lookup: Look up program videos

ReAct Process:
1. Thought: Brief reasoning
2. Action: Tool name or FINISH
3. Action Input: Tool input
4. Answer: SHORT answer (2-3 sentences) with 1-2 links when FINISH

CRITICAL: Keep final answers CONCISE. Include links:
- Fees: [MSBA Tuition & Financing](https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admit-central/program-calendar-and-fees)
- Prerequisites: [MSBA Prerequisites](https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions/prerequisites)
- Admissions: [MSBA Admissions](https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions)
- Application: [MSBA Application](https://apply.grad.ucla.edu/portal/landing)
- Program: [MSBA Program](https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics-msba)
- FAQ: [MSBA FAQ](https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions/faq)
- Events: [MSBA Events](https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions/events)
- Academics: [MSBA Academics](https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/academics)
- Career: [MSBA Career](https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/career-impact)
- Outcomes: [MSBA Outcomes](https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/career-impact/student-outcomes-placement)

Be brief and direct.`;
    }

    buildThinkPrompt(query, previousThought, previousAction, previousObservation) {
        let prompt = `Question: ${query}\n\n`;
        
        if (previousThought) {
            prompt += `Previous Thought: ${previousThought}\n`;
        }
        if (previousAction) {
            prompt += `Previous Action: ${previousAction}\n`;
        }
        if (previousObservation) {
            prompt += `Previous Observation: ${previousObservation}\n`;
        }
        
        prompt += `\nNow, think step by step and decide what to do next.`;
        
        return prompt;
    }

    parseReActOutput(output) {
        const thoughtMatch = output.match(/Thought:\s*(.+?)(?:\n|$)/i);
        const actionMatch = output.match(/Action:\s*(\w+)/i);
        const actionInputMatch = output.match(/Action Input:\s*(.+?)(?:\n|$)/i);
        const answerMatch = output.match(/Answer:\s*(.+?)(?:\n|$)/i);

        return {
            thought: thoughtMatch ? thoughtMatch[1].trim() : '',
            action: actionMatch ? actionMatch[1].trim() : 'FINISH',
            actionInput: actionInputMatch ? actionInputMatch[1].trim() : '',
            answer: answerMatch ? answerMatch[1].trim() : output
        };
    }

    async executeAction(action, actionInput) {
        const tool = this.adapter.tools.get(action);
        if (tool) {
            try {
                const result = await tool.execute(actionInput);
                // Format result to include URLs for better linking
                if (Array.isArray(result) && result.length > 0) {
                    const formattedResults = result.map(item => {
                        if (item.fullUrl || item.url) {
                            const fullUrl = item.fullUrl || `https://anderson.ucla.edu${item.url}`;
                            return {
                                ...item,
                                fullUrl: fullUrl,
                                linkText: item.source || 'Learn more'
                            };
                        }
                        return item;
                    });
                    return JSON.stringify(formattedResults);
                }
                return JSON.stringify(result);
            } catch (error) {
                return `Error executing ${action}: ${error.message}`;
            }
        }
        return `Unknown action: ${action}`;
    }
}

/**
 * Conversation Chain - Friendly dialogue
 */
class MSBAConversationChain {
    constructor(adapter) {
        this.adapter = adapter;
    }

    async run(userQuery) {
        const systemPrompt = `You are a concise and helpful AI assistant for the UCLA Anderson MSBA program.

CRITICAL INSTRUCTIONS:
- Keep answers SHORT and DIRECT (2-3 sentences maximum)
- Answer only what's asked, no extra details
- ALWAYS include 1-2 relevant clickable links using markdown format [Link Text](URL)
- For each answer, only repeat the same URL once.
- When user asks about videos, ALWAYS include video embeds using format: [Video: Title](youtube:VIDEO_ID)
- Videos will be displayed directly in the chatbox, so include them in your response

All valid MSBA URLs:
- MSBA Program: https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics-msba
- MSBA Admissions: https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions
- MSBA Prerequisites: https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions/prerequisites
- MSBA FAQ: https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions/faq
- MSBA Events: https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions/events
- MSBA Tuition & Financing: https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admit-central/program-calendar-and-fees
- MSBA Academics: https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/academics
- MSBA Career: https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/career-impact
- MSBA Outcomes: https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/career-impact/student-outcomes-placement
- MSBA Application: https://apply.grad.ucla.edu/portal/landing

MSBA Videos (use format [Video: Title](youtube:VIDEO_ID)):
- Program Overview: [Video: This Is What The Master of Science in Business Analytics Is All About](youtube:1hoFiu7BP08)
- Student Life: [Video: A Day in the Life of MSBA](youtube:xsALV8FO9JE)
- Career & Networking: [Video: Building Personal and Professional Networks](youtube:UCLA_MSBA_NETWORK)
- Admissions Info: [Video: MSBA Admissions Overview](youtube:UCLA_MSBA_ADMISSIONS)

Be brief, helpful, and include links or videos when relevant.`;

        const history = this.adapter.memory.getRecentHistory(3); // Reduced from 5 to 3 for shorter context
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: userQuery }
        ];

        const response = await this.adapter.callLLM(messages, {
            max_tokens: 500, // Explicitly limit response length
            temperature: 0.5 // Lower temperature for more focused answers
        });
        await this.adapter.memory.addConversation(userQuery, response);

        return response;
    }
}

/**
 * Router Chain - Intent detection
 */
class MSBARouterChain {
    constructor(adapter) {
        this.adapter = adapter;
        this.msbaKeywords = [
            'prerequisite', 'requirement', 'fee', 'tuition', 'cost', 'financing',
            'admission', 'apply', 'application', 'deadline', 'gpa', 'gre', 'gmat',
            'curriculum', 'course', 'program', 'academic', 'career', 'placement',
            'outcome', 'salary', 'job', 'msba', 'business analytics'
        ];
    }

    async detectIntent(query) {
        const lowerQuery = query.toLowerCase();
        const hasMSBAKeyword = this.msbaKeywords.some(keyword => lowerQuery.includes(keyword));
        
        if (hasMSBAKeyword) {
            return { type: 'msba_query', confidence: 0.9 };
        }
        
        return { type: 'conversation', confidence: 0.7 };
    }
}

/**
 * MSBA Memory System - Vector Database + Relational Storage
 * Based on recommendation: Hybrid architecture with Vector DB + Relational Storage
 * Includes persistent chat history using Chrome Storage
 */
class MSBAMemorySystem {
    constructor() {
        this.vectorStore = new Map(); // Simplified Vector DB (in production, use Pinecone/Weaviate)
        this.relationalStore = new Map(); // Relational storage for structured data
        this.conversationHistory = [];
        this.maxHistory = 50; // Increased for better context
        this.storageKey = 'msba_conversation_history';
        
        // Initialize with MSBA knowledge base
        this.initializeKnowledgeBase();
        
        // Load persistent chat history
        this.loadChatHistory();
    }
    
    /**
     * Load chat history from Chrome Storage
     */
    async loadChatHistory() {
        return new Promise((resolve) => {
            chrome.storage.local.get([this.storageKey], (result) => {
                if (result[this.storageKey] && Array.isArray(result[this.storageKey])) {
                    this.conversationHistory = result[this.storageKey];
                    console.log(`✅ Loaded ${this.conversationHistory.length} messages from history`);
                }
                resolve();
            });
        });
    }
    
    /**
     * Save chat history to Chrome Storage
     */
    async saveChatHistory() {
        return new Promise((resolve) => {
            chrome.storage.local.set({
                [this.storageKey]: this.conversationHistory.slice(-this.maxHistory)
            }, () => {
                resolve();
            });
        });
    }

    /**
     * Initialize MSBA knowledge base from impact analysis report
     */
    initializeKnowledgeBase() {
        // Prerequisites knowledge
        this.addKnowledge('prerequisites', {
            text: 'MSBA Prerequisites: Mathematics (Calculus, Linear Algebra, Statistics), Programming (Python or R), Work experience not required but recommended 1-2 years',
            metadata: { source: 'MSBA Admissions Page', url: '/degrees/master-of-science-in-business-analytics/admissions/prerequisites' }
        });

        // Fees knowledge
        this.addKnowledge('fees', {
            text: 'MSBA Program Fees: Total program cost approximately $70,000+ (varies by year). Financial aid and scholarships available. Program duration: 15 months.',
            metadata: { source: 'MSBA Fees & Financing Page', url: '/degrees/master-of-science-in-business-analytics/admit-central/program-calendar-and-fees' }
        });

        // Admissions knowledge
        this.addKnowledge('admissions', {
            text: 'MSBA Admissions: Holistic review process. Requirements include transcripts, test scores (GRE/GMAT), letters of recommendation, personal statement, resume. Application deadlines vary by round.',
            metadata: { source: 'MSBA Admissions Page', url: '/degrees/master-of-science-in-business-analytics/admissions' }
        });

        // Program structure knowledge
        this.addKnowledge('program', {
            text: 'MSBA Program: 15-month full-time program. Core courses in data science, business analytics, machine learning. Capstone project with industry partners. STEM-designated program.',
            metadata: { source: 'MSBA Academics Page', url: '/degrees/master-of-science-in-business-analytics/academics' }
        });

        // Career outcomes knowledge
        this.addKnowledge('career', {
            text: 'MSBA Career Outcomes: Strong placement rates. Average salary $120,000+. Top employers include tech companies, consulting firms, financial institutions. Career services support throughout program.',
            metadata: { source: 'MSBA Student Outcomes Page', url: '/degrees/master-of-science-in-business-analytics/career-impact/student-outcomes-placement' }
        });
    }

    /**
     * Add knowledge to vector store (simplified embedding)
     */
    addKnowledge(category, knowledge) {
        if (!this.vectorStore.has(category)) {
            this.vectorStore.set(category, []);
        }
        this.vectorStore.get(category).push(knowledge);
    }

    /**
     * Search knowledge using vector similarity (simplified)
     */
    async searchKnowledge(category, query) {
        const categoryData = this.vectorStore.get(category) || [];
        
        // Simple keyword matching (in production, use proper vector embeddings)
        const queryLower = query.toLowerCase();
        const results = categoryData.filter(item => {
            const textLower = item.text.toLowerCase();
            return textLower.includes(queryLower) || 
                   queryLower.split(' ').some(word => textLower.includes(word));
        });

        return results.length > 0 ? results : categoryData.slice(0, 3); // Return top 3 or all
    }

    /**
     * Add conversation to history (with persistent storage)
     */
    async addConversation(userQuery, assistantResponse) {
        this.conversationHistory.push({
            role: 'user',
            content: userQuery,
            timestamp: Date.now()
        });
        this.conversationHistory.push({
            role: 'assistant',
            content: assistantResponse,
            timestamp: Date.now()
        });

        // Keep history within limit
        if (this.conversationHistory.length > this.maxHistory * 2) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxHistory * 2);
        }
        
        // Save to persistent storage
        await this.saveChatHistory();
    }
    
    /**
     * Clear chat history
     */
    async clearHistory() {
        this.conversationHistory = [];
        await this.saveChatHistory();
    }

    /**
     * Get recent conversation history
     */
    getRecentHistory(count = 10) {
        return this.conversationHistory.slice(-count * 2).map(msg => ({
            role: msg.role,
            content: msg.content
        }));
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
    }
}

/**
 * MSBA Tool Registry
 */
class MSBAToolRegistry {
    constructor() {
        this.tools = new Map();
    }

    register(name, tool) {
        this.tools.set(name, tool);
    }

    get(name) {
        return this.tools.get(name);
    }

    async execute(name, ...args) {
        const tool = this.tools.get(name);
        if (tool && tool.execute) {
            return await tool.execute(...args);
        }
        throw new Error(`Tool "${name}" not found`);
    }
}

/**
 * MSBA Chain Registry
 */
class MSBAChainRegistry {
    constructor() {
        this.chains = new Map();
    }

    register(name, chain) {
        this.chains.set(name, chain);
    }

    get(name) {
        return this.chains.get(name);
    }
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.MSBALangChainAdapter = MSBALangChainAdapter;
}

