//START - OUTSINC/assets/js/chat.js

/* =====================================================
   LONDONS OUTSINCE Chat System
   - Live chat bubble with presence detection
   - Chat interface and operator status
   - Accessibility and keyboard support
   ===================================================== */

(function() {
    'use strict';

    const app = window.LondonsOutsince;

    // Chat component
    app.components.chat = () => {
        const chatBubble = app.utils.$('#chatBubble');
        const chatStatus = app.utils.$('#chatStatus');
        
        if (!chatBubble) return;

        let chatWindow = null;
        let isOperatorLive = false;
        let lastOperatorSeen = new Date();

        // Chat status management
        const updateChatStatus = () => {
            const now = new Date();
            const timeSinceLastSeen = now - lastOperatorSeen;
            const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

            if (isOperatorLive) {
                chatStatus.textContent = 'Live now';
                chatStatus.className = 'chat-status live';
            } else if (timeSinceLastSeen < twoHours) {
                chatStatus.textContent = 'Recently';
                chatStatus.className = 'chat-status recent';
            } else {
                chatStatus.textContent = 'Leave a message';
                chatStatus.className = 'chat-status offline';
            }
        };

        // Simulate operator presence (replace with real API)
        const simulateOperatorPresence = () => {
            // Random chance of operator being live
            isOperatorLive = Math.random() > 0.7;
            
            if (!isOperatorLive) {
                // Random last seen time within last 4 hours
                const randomHours = Math.random() * 4;
                lastOperatorSeen = new Date(Date.now() - (randomHours * 60 * 60 * 1000));
            }
            
            updateChatStatus();
        };

        // Create chat window
        const createChatWindow = () => {
            const chatWindow = document.createElement('div');
            chatWindow.className = 'chat-window';
            chatWindow.innerHTML = `
                <div class="chat-header">
                    <h3>Chat with Support</h3>
                    <div class="chat-controls">
                        <button class="chat-minimize" aria-label="Minimize chat">−</button>
                        <button class="chat-close" aria-label="Close chat">×</button>
                    </div>
                </div>
                <div class="chat-body">
                    <div class="chat-messages" id="chatMessages">
                        <div class="message system">
                            <div class="message-content">
                                <p>Hello! ${isOperatorLive ? "I'm here to help you right away." : "I'll get back to you as soon as possible."}</p>
                                <p>How can I assist you today?</p>
                            </div>
                            <div class="message-time">${new Date().toLocaleTimeString()}</div>
                        </div>
                    </div>
                    <div class="chat-input-area">
                        <div class="typing-indicator" id="typingIndicator" style="display: none;">
                            <span>Support is typing...</span>
                        </div>
                        <form class="chat-form" id="chatForm">
                            <input type="text" id="chatInput" placeholder="Type your message..." required>
                            <button type="submit" aria-label="Send message">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22,2 15,22 11,13 2,9"></polygon>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            `;

            // Style the chat window
            chatWindow.style.cssText = `
                position: fixed;
                bottom: 100px;
                right: 20px;
                width: 350px;
                height: 450px;
                background: var(--surface);
                border: 1px solid var(--line);
                border-radius: var(--radius);
                box-shadow: var(--shadow);
                z-index: 1001;
                display: flex;
                flex-direction: column;
                font-family: inherit;
                animation: slideInUp 0.3s ease;
            `;

            return chatWindow;
        };

        // Add chat window styles
        const addChatStyles = () => {
            if (document.querySelector('#chat-styles')) return;

            const styles = document.createElement('style');
            styles.id = 'chat-styles';
            styles.textContent = `
                @keyframes slideInUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                @keyframes slideOutDown {
                    from { transform: translateY(0); opacity: 1; }
                    to { transform: translateY(100%); opacity: 0; }
                }

                .chat-window .chat-header {
                    padding: 16px;
                    border-bottom: 1px solid var(--line);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: var(--surface-2);
                    border-radius: var(--radius) var(--radius) 0 0;
                }

                .chat-window .chat-header h3 {
                    margin: 0;
                    font-size: 16px;
                    color: var(--ink);
                }

                .chat-controls {
                    display: flex;
                    gap: 8px;
                }

                .chat-controls button {
                    background: none;
                    border: 1px solid var(--line);
                    color: var(--muted);
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .chat-controls button:hover {
                    background: var(--line);
                    color: var(--ink);
                }

                .chat-body {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .chat-messages {
                    flex: 1;
                    padding: 16px;
                    overflow-y: auto;
                    scroll-behavior: smooth;
                }

                .message {
                    margin-bottom: 16px;
                    display: flex;
                    flex-direction: column;
                }

                .message.user {
                    align-items: flex-end;
                }

                .message.system,
                .message.support {
                    align-items: flex-start;
                }

                .message-content {
                    max-width: 80%;
                    padding: 12px;
                    border-radius: 12px;
                    word-wrap: break-word;
                }

                .message.user .message-content {
                    background: var(--cta);
                    color: white;
                }

                .message.system .message-content,
                .message.support .message-content {
                    background: var(--surface-2);
                    color: var(--ink);
                    border: 1px solid var(--line);
                }

                .message-content p {
                    margin: 0 0 8px 0;
                }

                .message-content p:last-child {
                    margin-bottom: 0;
                }

                .message-time {
                    font-size: 12px;
                    color: var(--muted);
                    margin-top: 4px;
                    padding: 0 4px;
                }

                .typing-indicator {
                    padding: 8px 16px;
                    font-size: 12px;
                    color: var(--muted);
                    font-style: italic;
                }

                .chat-form {
                    display: flex;
                    padding: 16px;
                    border-top: 1px solid var(--line);
                    gap: 8px;
                }

                .chat-form input {
                    flex: 1;
                    padding: 12px;
                    border: 1px solid var(--line);
                    border-radius: 8px;
                    background: var(--bg);
                    color: var(--ink);
                    font-size: 14px;
                }

                .chat-form input:focus {
                    outline: none;
                    border-color: var(--glow);
                    box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.25);
                }

                .chat-form button {
                    padding: 12px;
                    background: var(--cta);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .chat-form button:hover {
                    background: #e53e3e;
                }

                .chat-form button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .chat-status.live {
                    background: var(--positive);
                    color: white;
                }

                .chat-status.recent {
                    background: var(--warn);
                    color: #000;
                }

                .chat-status.offline {
                    background: var(--muted);
                    color: white;
                }

                @media (max-width: 480px) {
                    .chat-window {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        right: 0 !important;
                        bottom: 0 !important;
                        width: 100% !important;
                        height: 100% !important;
                        border-radius: 0 !important;
                    }
                }
            `;
            
            document.head.appendChild(styles);
        };

        // Open chat window
        const openChat = () => {
            if (chatWindow) return; // Already open

            addChatStyles();
            chatWindow = createChatWindow();
            document.body.appendChild(chatWindow);

            // Focus the input
            const chatInput = chatWindow.querySelector('#chatInput');
            chatInput.focus();

            // Setup event listeners
            setupChatEventListeners();
        };

        // Close chat window
        const closeChat = () => {
            if (!chatWindow) return;

            chatWindow.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => {
                if (chatWindow && chatWindow.parentNode) {
                    chatWindow.parentNode.removeChild(chatWindow);
                }
                chatWindow = null;
                chatBubble.focus(); // Return focus to bubble
            }, 300);
        };

        // Minimize chat window
        const minimizeChat = () => {
            if (!chatWindow) return;
            
            chatWindow.style.display = 'none';
            // Could implement a minimized state here
        };

        // Setup chat event listeners
        const setupChatEventListeners = () => {
            if (!chatWindow) return;

            const closeBtn = chatWindow.querySelector('.chat-close');
            const minimizeBtn = chatWindow.querySelector('.chat-minimize');
            const chatForm = chatWindow.querySelector('#chatForm');
            const chatInput = chatWindow.querySelector('#chatInput');
            const messagesContainer = chatWindow.querySelector('#chatMessages');

            app.utils.on(closeBtn, 'click', closeChat);
            app.utils.on(minimizeBtn, 'click', minimizeChat);

            app.utils.on(chatForm, 'submit', (e) => {
                e.preventDefault();
                sendMessage(chatInput.value.trim());
                chatInput.value = '';
            });

            // Escape key to close
            app.utils.on(chatWindow, 'keydown', (e) => {
                if (e.key === 'Escape') {
                    closeChat();
                }
            });
        };

        // Send message
        const sendMessage = (text) => {
            if (!text || !chatWindow) return;

            const messagesContainer = chatWindow.querySelector('#chatMessages');
            const typingIndicator = chatWindow.querySelector('#typingIndicator');

            // Add user message
            const userMessage = document.createElement('div');
            userMessage.className = 'message user';
            userMessage.innerHTML = `
                <div class="message-content">
                    <p>${text}</p>
                </div>
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            `;
            messagesContainer.appendChild(userMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Simulate response
            if (isOperatorLive) {
                // Show typing indicator
                app.utils.show(typingIndicator);
                
                setTimeout(() => {
                    app.utils.hide(typingIndicator);
                    
                    const responses = [
                        "Thank you for reaching out. Let me help you with that.",
                        "I understand your concern. Can you provide more details?",
                        "That's a great question. Here's what I can tell you...",
                        "I'm here to help. Let me connect you with the right resource.",
                        "Thanks for using our service. How else can I assist you?"
                    ];
                    
                    const response = responses[Math.floor(Math.random() * responses.length)];
                    
                    const supportMessage = document.createElement('div');
                    supportMessage.className = 'message support';
                    supportMessage.innerHTML = `
                        <div class="message-content">
                            <p>${response}</p>
                        </div>
                        <div class="message-time">${new Date().toLocaleTimeString()}</div>
                    `;
                    messagesContainer.appendChild(supportMessage);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }, Math.random() * 2000 + 1000); // 1-3 second delay
            } else {
                // Add auto-response for offline
                setTimeout(() => {
                    const offlineMessage = document.createElement('div');
                    offlineMessage.className = 'message system';
                    offlineMessage.innerHTML = `
                        <div class="message-content">
                            <p>Thanks for your message! We're currently offline, but we'll get back to you as soon as possible.</p>
                            <p>For urgent matters, please call our crisis line or visit the emergency resources section.</p>
                        </div>
                        <div class="message-time">${new Date().toLocaleTimeString()}</div>
                    `;
                    messagesContainer.appendChild(offlineMessage);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }, 1000);
            }
        };

        // Main chat bubble click handler
        app.utils.on(chatBubble, 'click', openChat);

        // Keyboard support for chat bubble
        app.utils.on(chatBubble, 'keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openChat();
            }
        });

        // Make chat bubble focusable
        chatBubble.setAttribute('tabindex', '0');
        chatBubble.setAttribute('role', 'button');
        chatBubble.setAttribute('aria-label', 'Open chat support');

        // Initialize operator presence
        simulateOperatorPresence();
        
        // Update status every 30 seconds
        setInterval(updateChatStatus, 30000);
        
        // Simulate operator status changes every 5 minutes
        setInterval(simulateOperatorPresence, 300000);

        console.log('Chat system initialized');
    };

    // Auto-initialize chat component
    const initChat = () => {
        app.components.chat();
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChat);
    } else {
        initChat();
    }

})();

//END - OUTSINC/assets/js/chat.js