/**
 * UCLA MSBA AI Assistant - React Components
 * UCLA Anderson brand colors: #003DA5 (blue) and #FFD100 (yellow)
 */

// React-like component system (lightweight, no external dependencies)
const ReactLike = {
    createElement: function(tag, props, ...children) {
        const element = document.createElement(tag);
        
        if (props) {
            Object.keys(props).forEach(key => {
                if (key === 'className') {
                    element.className = props[key];
                } else if (key === 'onClick') {
                    element.addEventListener('click', props[key]);
                } else if (key.startsWith('on')) {
                    const eventName = key.substring(2).toLowerCase();
                    element.addEventListener(eventName, props[key]);
                } else {
                    element.setAttribute(key, props[key]);
                }
            });
        }
        
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child) {
                element.appendChild(child);
            }
        });
        
        return element;
    }
};

/**
 * MSBA Sidebar Component
 */
function MSBASidebar({ adapter, onClose }) {
    // 返回侧边栏内容（不包含容器，容器在 createSidebar 中创建）
    const fragment = document.createDocumentFragment();
    
    // Header with UCLA Anderson Logo
    const headerLogo = ReactLike.createElement('div', { className: 'msba-header-logo' },
        ReactLike.createElement('span', { className: 'msba-header-logo-ucla' }, 'UCLA'),
        ReactLike.createElement('span', { className: 'msba-header-logo-anderson' }, 'Anderson'),
        ReactLike.createElement('span', { className: 'msba-header-logo-school' }, 'MSBA Assistant')
    );
    
    const header = ReactLike.createElement('div', { className: 'msba-header' },
        ReactLike.createElement('h3', null, headerLogo),
        ReactLike.createElement('button', { 
            id: 'msba-close',
            onClick: onClose,
            'aria-label': 'Close'
        }, '×')
    );
    
    // Message list
    const messageList = ReactLike.createElement('div', {
        id: 'msba-messages',
        className: 'msba-message-list'
    });
    
    // Input area
    const inputArea = ReactLike.createElement('div', { className: 'msba-input-area' },
        ReactLike.createElement('textarea', {
            id: 'msba-input',
            placeholder: 'Ask about MSBA prerequisites, fees, admissions...',
            rows: 3
        }),
        ReactLike.createElement('button', {
            id: 'msba-send',
            className: 'msba-send-btn'
        }, 'Send')
    );
    
    // Thinking indicator with spinner
    const thinkingSpinner = ReactLike.createElement('div', { className: 'msba-thinking-spinner' });
    const thinkingText = ReactLike.createElement('span', { className: 'msba-thinking-text' }, 'Thinking...');
    const thinkingIndicator = ReactLike.createElement('div', {
        id: 'msba-thinking',
        className: 'msba-thinking',
        style: 'display: none;'
    }, thinkingSpinner, thinkingText);
    
    fragment.appendChild(header);
    fragment.appendChild(messageList);
    fragment.appendChild(thinkingIndicator);
    fragment.appendChild(inputArea);
    
    return fragment;
}

/**
 * Message Component
 */
function MSBAMessage({ role, content, timestamp }) {
    const messageDiv = ReactLike.createElement('div', {
        className: `msba-message msba-message-${role}`
    });
    
    const contentDiv = ReactLike.createElement('div', { className: 'msba-message-content' });
    
    if (role === 'user') {
        contentDiv.textContent = content;
    } else {
        // Format assistant response
        const formattedContent = formatAssistantMessage(content);
        contentDiv.innerHTML = formattedContent;
    }
    
    messageDiv.appendChild(contentDiv);
    
    return messageDiv;
}

/**
 * Format assistant message with links and formatting
 * Links are displayed as modern button-style elements
 * Ensures each URL appears only once per answer
 */
function formatAssistantMessage(content) {
    let formatted = content;
    
    // Track used URLs to prevent duplicates
    const usedUrls = new Set();
    
    // First, clean up any broken HTML fragments that might be showing
    formatted = formatted.replace(/msba-link-button">/g, '');
    formatted = formatted.replace(/target="_blank">/g, '');
    formatted = formatted.replace(/Visit Page →/g, '');
    formatted = formatted.replace(/Page →/g, '');
    
    // Map of all MSBA URLs with their display text
    const msbaUrlMap = {
        'https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics-msba': 'Visit Official MSBA Page',
        'https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions': 'MSBA Admissions',
        'https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions/prerequisites': 'MSBA Prerequisites',
        'https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions/faq': 'MSBA FAQ',
        'https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions/events': 'MSBA Events',
        'https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admit-central/program-calendar-and-fees': 'MSBA Tuition & Financing',
        'https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/academics': 'MSBA Academics',
        'https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/career-impact': 'MSBA Career',
        'https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/career-impact/student-outcomes-placement': 'MSBA Outcomes',
        'https://apply.grad.ucla.edu/portal/landing': 'MSBA Application'
    };
    
    // Helper function to create link button (only if URL not already used)
    function createLinkButton(url, displayText) {
        // Normalize URL (remove trailing slash, etc.)
        const normalizedUrl = url.replace(/\/$/, '');
        if (usedUrls.has(normalizedUrl)) {
            return ''; // Skip if URL already used
        }
        usedUrls.add(normalizedUrl);
        return `<div class="msba-link-button"><a href="${url}" target="_blank">${displayText} →</a></div>`;
    }
    
    // Step 0: Convert YouTube video embeds first (before regular links)
    formatted = formatted.replace(
        /\[Video:\s*([^\]]+)\]\(youtube:([^)]+)\)/gi,
        (match, title, videoId) => {
            // Create YouTube embed with title on top
            return `<div class="msba-video-container">
                <div class="msba-video-title-top">${title}</div>
                <div class="msba-video-wrapper">
                    <iframe 
                        src="https://www.youtube.com/embed/${videoId}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        class="msba-video-iframe">
                    </iframe>
                </div>
            </div>`;
        }
    );
    
    // Step 1: Convert markdown links [text](url) to button-style links
    formatted = formatted.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        (match, text, url) => {
            // Skip if it's a YouTube link (already processed)
            if (url.startsWith('youtube:')) {
                return match;
            }
            const displayText = msbaUrlMap[url] || text;
            return createLinkButton(url, displayText);
        }
    );
    
    // Step 2: Convert plain URLs to button-style links
    Object.keys(msbaUrlMap).forEach(url => {
        const displayText = msbaUrlMap[url];
        const urlRegex = new RegExp(`(^|[^"']|>|\\s)(${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})([\\s.,;!?]|$)`, 'gi');
        formatted = formatted.replace(urlRegex, (match, before, urlMatch, after) => {
            const beforeMatch = formatted.substring(0, formatted.indexOf(match));
            if (!beforeMatch.includes('<a href') || beforeMatch.lastIndexOf('<a href') < beforeMatch.lastIndexOf('</a>')) {
                const button = createLinkButton(urlMatch, displayText);
                return button ? `${before}${button}${after}` : match;
            }
            return match;
        });
    });
    
    // Step 3: Handle remaining URLs
    formatted = formatted.replace(
        /(https?:\/\/[^\s<>"']+)(?![^<]*<\/a>)/g,
        (match) => {
            if (match.includes('msba-link-button')) return match;
            if (match.includes('anderson.ucla.edu') || match.includes('apply.grad.ucla.edu')) {
                const displayText = msbaUrlMap[match] || 'Visit Page';
                return createLinkButton(match, displayText) || match;
            }
            return match;
        }
    );
    
    // Step 4: Replace common page mentions with button-style links
    const pageMentions = {
        'MSBA Tuition & Financing page': {
            url: 'https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admit-central/program-calendar-and-fees',
            text: 'MSBA Tuition & Financing'
        },
        'MSBA Program Costs page': {
            url: 'https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admit-central/program-calendar-and-fees',
            text: 'MSBA Tuition & Financing'
        },
        'Tuition & Financing': {
            url: 'https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admit-central/program-calendar-and-fees',
            text: 'MSBA Tuition & Financing'
        },
        'MSBA Prerequisites page': {
            url: 'https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions/prerequisites',
            text: 'MSBA Prerequisites'
        },
        'MSBA Admissions page': {
            url: 'https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions',
            text: 'MSBA Admissions'
        },
        'MSBA Admissions': {
            url: 'https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions',
            text: 'MSBA Admissions'
        },
        'official MSBA website': {
            url: 'https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics-msba',
            text: 'Visit Official MSBA Page'
        },
        'official website': {
            url: 'https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics-msba',
            text: 'Visit Official MSBA Page'
        },
        'application': {
            url: 'https://apply.grad.ucla.edu/portal/landing',
            text: 'MSBA Application'
        },
        'apply': {
            url: 'https://apply.grad.ucla.edu/portal/landing',
            text: 'MSBA Application'
        }
    };
    
    // Replace page mentions with button links (avoid replacing if already in a link)
    Object.keys(pageMentions).forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b(?![^<]*<\/a>)`, 'gi');
        formatted = formatted.replace(regex, (match) => {
            const linkInfo = pageMentions[keyword];
            return createLinkButton(linkInfo.url, linkInfo.text) || match;
        });
    });
    
    // Step 5: Highlight key terms (but not if they're already in links)
    formatted = formatted.replace(
        /<strong>([^<]+)<\/strong>/g,
        '$1' // Remove existing strong tags first
    );
    
    formatted = formatted.replace(
        /(MSBA|prerequisites|fees|admissions|program|career|financial|tuition|financing)(?![^<]*<\/a>)(?![^<]*msba-link-button)/gi,
        '<strong>$1</strong>'
    );
    
    return formatted;
}

// Export components
if (typeof window !== 'undefined') {
    window.ReactLike = ReactLike;
    window.MSBASidebar = MSBASidebar;
    window.MSBAMessage = MSBAMessage;
}

