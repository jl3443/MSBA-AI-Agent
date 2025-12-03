# UCLA MSBA AI Assistant

> AI-powered Chrome extension for UCLA Anderson MSBA program

## Overview

The UCLA MSBA AI Assistant is an intelligent Chrome extension that provides accurate, real-time answers about the Master of Science in Business Analytics program. Built with LangChain and ReAct framework, it delivers concise responses with direct links to official MSBA pages.

## Features

- **ReAct Framework**: Intelligent reasoning and action-based query processing
- **MSBA Knowledge Base**: Comprehensive information about prerequisites, fees, admissions, academics, and career outcomes
- **Video Support**: Embedded YouTube videos for program overview and student life
- **Chat History**: Persistent conversation history across sessions
- **UCLA Branding**: Official UCLA Anderson colors and styling
- **Smart Links**: Automatic link deduplication and button-style formatting

## Quick Start

### Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the `msba-agent` folder

### Configuration

1. Click the extension icon in Chrome toolbar
2. Enter your API key:
   - **DeepSeek**: Get your API key from [DeepSeek](https://platform.deepseek.com/)
   - **OpenAI**: Use your OpenAI API key
3. Select your preferred model
4. Click "Save Settings"
5. Refresh any open MSBA pages

### Usage

- **Open Assistant**: Press `Command+K` (Mac) or `Ctrl+K` (Windows)
- **Ask Questions**: Type questions about MSBA program, prerequisites, fees, admissions, etc.
- **View Videos**: Ask "show me videos about msba" to see embedded videos
- **Close**: Press `Command+K` again or click the × button

## Architecture

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Browser Extension Layer"
        A[Chrome Extension] --> B[MSBA Agent<br/>Main Entry Point]
        B --> C[Settings Manager<br/>Chrome Storage Sync]
        B --> D[UI Sidebar<br/>React Components]
        B --> E[Event Listeners<br/>Keyboard Shortcuts]
    end

    subgraph "Core Agent Layer"
        B --> F[MSBA LangChain Adapter]
        F --> G[Memory System<br/>Vector DB + Relational Storage]
        F --> H[Tool Registry<br/>8 MSBA Tools]
        F --> I[Chain Registry<br/>ReAct + Router + Conversation]
    end

    subgraph "Knowledge Base Layer"
        G --> J[MSBA Knowledge Base<br/>Structured Data]
        J --> K[Prerequisites]
        J --> L[Fees & Financing]
        J --> M[Admissions]
        J --> N[Program Info]
        J --> O[Career Outcomes]
        J --> P[FAQs]
        J --> Q[Events]
        J --> R[Videos]
    end

    subgraph "ReAct Framework Layer"
        I --> S[Router Chain<br/>Intent Detection]
        S --> T{Query Type?}
        T -->|MSBA Query| U[ReAct Chain<br/>Reasoning + Acting]
        T -->|General Chat| V[Conversation Chain<br/>Friendly Dialogue]
        
        U --> W[Think Step]
        W --> X[Action Step]
        X --> Y[Tool Execution]
        Y --> Z[Observation]
        Z --> AA{Need More Info?}
        AA -->|Yes| W
        AA -->|No| AB[Final Answer]
    end

    subgraph "Tool Execution Layer"
        H --> AC[prerequisites_lookup]
        H --> AD[fees_lookup]
        H --> AE[admissions_lookup]
        H --> AF[program_lookup]
        H --> AG[career_lookup]
        H --> AH[faq_search]
        H --> AI[events_lookup]
        H --> AJ[videos_lookup]
        
        Y --> AC
        Y --> AD
        Y --> AE
        Y --> AF
        Y --> AG
        Y --> AH
        Y --> AI
        Y --> AJ
    end

    subgraph "LLM API Layer"
        U --> AK[DeepSeek API<br/>or OpenAI API]
        V --> AK
        AK --> AL[Response Generation]
        AL --> AB
    end

    subgraph "Response Enhancement Layer"
        AB --> AM[Link Enhancement<br/>Auto-add URLs]
        AM --> AN[Video Embedding<br/>YouTube Integration]
        AN --> AO[Message Formatting<br/>Markdown + Links]
        AO --> D
    end

    subgraph "Storage Layer"
        G --> AP[Chrome Storage Local<br/>Chat History]
        C --> AQ[Chrome Storage Sync<br/>API Keys & Settings]
    end

    style B fill:#0055CC,stroke:#FFD100,stroke-width:3px,color:#fff
    style F fill:#4A90E2,stroke:#003DA5,stroke-width:2px,color:#fff
    style U fill:#FFD100,stroke:#0055CC,stroke-width:2px
    style J fill:#FFF9E6,stroke:#FFD100,stroke-width:2px
    style AK fill:#1A1A1A,stroke:#0055CC,stroke-width:2px,color:#fff
```

### Core Components

- **`msba-agent.js`**: Main entry point, UI management
- **`msba-langchain-adapter.js`**: ReAct framework implementation
- **`msba-knowledge-base.js`**: MSBA program knowledge and URLs
- **`msba-react-components.js`**: UI components and message formatting

### Framework

- **ReAct Chain**: Reasoning + Acting for complex queries
- **Router Chain**: Intent detection and routing
- **Conversation Chain**: Friendly dialogue handling
- **Memory System**: Hybrid Vector DB + Relational storage with Chrome Storage persistence

### Architecture Layers

1. **Browser Extension Layer**: Chrome extension, settings, UI sidebar, event listeners
2. **Core Agent Layer**: LangChain adapter, memory system, tool registry, chain registry
3. **Knowledge Base Layer**: 8 categories of structured MSBA knowledge
4. **ReAct Framework Layer**: Router, ReAct chain (Think-Act-Observe loop), Conversation chain
5. **Tool Execution Layer**: 8 specialized tools for knowledge lookup
6. **LLM API Layer**: DeepSeek or OpenAI API integration
7. **Response Enhancement Layer**: Link addition, video embedding, markdown formatting
8. **Storage Layer**: Chrome Storage (Local for history, Sync for settings)

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## MSBA URLs

All official MSBA pages are included:
- Program Homepage
- Admissions
- Prerequisites
- FAQ
- Events
- Tuition & Financing
- Academics
- Career Impact
- Student Outcomes
- Application Portal

## Videos

Embedded videos include:
- Program Overview
- Student Life
- Career & Networking

## Development

### File Structure

```
msba-agent/
├── manifest.json              # Chrome extension manifest
├── msba-agent.js              # Main entry point
├── msba-langchain-adapter.js  # ReAct framework
├── msba-knowledge-base.js     # Knowledge base
├── msba-react-components.js   # UI components
├── background.js              # Service worker
├── popup.html/js              # Settings popup
└── README.md                  # This file
```

### Key Technologies

- **LangChain/ReAct**: Reasoning and action framework
- **Chrome Extension API**: Storage, messaging, content scripts
- **DeepSeek/OpenAI API**: LLM integration

## Troubleshooting

**Extension won't load**: Check `manifest.json` for errors in Chrome Extensions page

**Shortcut not working**: Ensure extension is enabled and reload the page

**No responses**: Verify API key is configured in extension popup

**Videos not showing**: Check browser console for iframe errors

## License

This project is for educational and research purposes related to UCLA Anderson MSBA program.

## Credits

Built based on the [MSBA AI Chatbot Impact Analysis Report](https://github.com/your-repo), implementing best practices for AI-optimized content delivery.
