// Pinsry Professional Support Center - JavaScript

class PinsrySupport {
    constructor() {
        this.chatWidget = null;
        this.chatMessages = null;
        this.chatInput = null;
        this.isTyping = false;
        this.conversationHistory = [];
        
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupFAQ();
        this.optimizeImageLoading();
        this.addWelcomeMessage();
    }

    setupElements() {
        this.chatWidget = document.getElementById('chatWidget');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.chatOverlay = document.getElementById('chatOverlay');
    }

    setupEventListeners() {
        // Chat trigger buttons
        document.getElementById('chatTrigger')?.addEventListener('click', () => this.openChat());
        document.getElementById('openChatBtn')?.addEventListener('click', () => this.openChat());
        document.getElementById('openChatBtn2')?.addEventListener('click', () => this.openChat());
        
        // Chat close
        document.getElementById('chatClose')?.addEventListener('click', () => this.closeChat());
        
        // Chat overlay
        this.chatOverlay?.addEventListener('click', () => this.closeChat());
        
        // Chat input
        this.chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Chat send button
        document.getElementById('chatSend')?.addEventListener('click', () => this.sendMessage());
        
        // Help cards
        document.querySelectorAll('.help-card').forEach(card => {
            card.addEventListener('click', () => {
                const topic = card.getAttribute('data-topic');
                if (topic) {
                    this.openChat();
                    setTimeout(() => {
                        this.chatInput.value = topic;
                        this.sendMessage();
                    }, 500);
                }
            });
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                this.updateActiveNav(link);
            });
        });

        // Scroll spy for navigation
        window.addEventListener('scroll', () => this.updateNavOnScroll());
        
        // Mobile menu
        document.getElementById('mobileMenuToggle')?.addEventListener('click', () => {
            // Add mobile menu functionality if needed
        });
    }

    setupFAQ() {
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.closest('.faq-item');
                const isActive = faqItem.classList.contains('active');
                
                // Close all FAQ items
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Toggle current item
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });
    }

    optimizeImageLoading() {
        // Preload critical images
        const criticalImages = [
            'https://i.postimg.cc/fWCLqsL7/9920.png'
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });

        // Handle image loading with better error handling
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
            
            img.addEventListener('error', () => {
                // Fallback for failed images
                img.style.opacity = '0.5';
                img.alt = 'Image failed to load';
            });
        });
    }

    openChat() {
        this.chatWidget?.classList.add('active');
        this.chatOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus input after animation
        setTimeout(() => {
            this.chatInput?.focus();
        }, 300);
    }

    closeChat() {
        this.chatWidget?.classList.remove('active');
        this.chatOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    addWelcomeMessage() {
        if (!this.chatMessages) return;
        
        const welcomeMessage = {
            type: 'bot',
            content: "Hi there! 👋 I'm the Pinsry Assistant. I'm here to help you with anything about our story-sharing platform. Feel free to ask me about creating stories, bookmarks, following authors, or any other questions you might have!"
        };
        
        this.displayMessage(welcomeMessage);
    }

    async sendMessage() {
        const message = this.chatInput?.value.trim();
        if (!message || this.isTyping) return;

        // Add user message
        this.displayMessage({ type: 'user', content: message });
        this.chatInput.value = '';

        // Add to conversation history
        this.conversationHistory.push({ role: 'user', content: message });

        // Show typing indicator
        this.showTyping();

        // Get AI response
        try {
            const response = await this.getAIResponse(message);
            this.hideTyping();
            this.displayMessage({ type: 'bot', content: response });
            this.conversationHistory.push({ role: 'assistant', content: response });
        } catch (error) {
            this.hideTyping();
            this.displayMessage({ 
                type: 'bot', 
                content: "I apologize, but I'm having trouble responding right now. Please try asking your question again, or contact our support team directly at support@pinsry.com." 
            });
        }
    }

    async getAIResponse(message) {
        // Simulate AI thinking time
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        // Simple pattern matching for responses
        const response = this.matchResponse(message.toLowerCase());
        return response || this.getDefaultResponse();
    }

    matchResponse(message) {
        // Greeting patterns
        if (/^(hi|hello|hey|good\s+(morning|afternoon|evening))$/i.test(message.trim())) {
            const greetings = [
                "Hello! 😊 Welcome to Pinsry Support. How can I help you today?",
                "Hi there! 👋 I'm here to help with any questions about Pinsry. What would you like to know?",
                "Hey! 🌟 Great to see you here. Feel free to ask me anything about our platform!"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }

        // Creator/developer questions
        if (/who\s+(created|made|developed|built|designed)\s+(this\s+app|pinsry)/i.test(message) || 
            /creator|developer|maker/i.test(message)) {
            return "Pinsry was created by **Luohino**! 🚀 Luohino is the visionary developer behind this amazing story-sharing platform. They've put their heart and soul into creating a space where writers and readers can connect through beautiful stories.";
        }

        // Story creation
        if (/how.*create.*story|write.*story|publish.*story|new.*story/i.test(message)) {
            return "Creating a story in Pinsry is super easy! 📝 Here's how:\n\n1. **Tap the '+' button** in the bottom navigation bar\n2. **Choose 'Create Story'** from the options\n3. **Add your title and content** - you can format text and add images\n4. **Preview your story** to make sure it looks perfect\n5. **Tap 'Publish'** to share with the Pinsry community!\n\nYour story will appear in feeds and be discoverable by other users. Happy writing! ✨";
        }

        // Bookmarks
        if (/bookmark|save.*story|read.*later|favorite/i.test(message)) {
            return "Bookmarking stories is a breeze! 🔖 Here's how:\n\n1. **Find the bookmark icon** (🔖) on any story card\n2. **Tap the bookmark icon** to save the story\n3. **Access your bookmarks** via the 'Bookmarks' section in navigation\n4. **All saved stories** are organized for easy access\n\nYou can bookmark unlimited stories and they'll sync across all your devices! 📚";
        }

        // Following users
        if (/follow.*user|follow.*author|connect.*author/i.test(message)) {
            return "Following your favorite authors is great for staying updated! 👥 Here's how:\n\n1. **Visit an author's profile** by tapping their name or picture\n2. **Tap the 'Follow' button** on their profile\n3. **See their new stories** in your personalized feed\n4. **Manage your follows** in your profile settings\n\nFollowing helps you discover amazing content from writers you love! 🌟";
        }

        // Notifications
        if (/notification|alert|update|bell/i.test(message)) {
            return "Stay connected with Pinsry notifications! 🔔 Here's what you need to know:\n\n**Where to find them:**\n• Tap the bell icon at the top of your feed\n• All notifications in one organized place\n\n**What you'll be notified about:**\n• New stories from followed authors\n• Likes and comments on your stories\n• New followers\n• Story recommendations\n\n**Customize notifications:**\n• Go to Settings → Notifications\n• Turn specific alert types on/off\n\nNever miss the stories that matter to you! 📱";
        }

        // Offline reading
        if (/offline|no.*internet|without.*connection|download.*story/i.test(message)) {
            return "Absolutely! Pinsry supports offline reading! 📱✈️\n\n**How it works:**\n• Stories are automatically cached when online\n• Downloaded stories stay available offline\n• Reading progress syncs when you reconnect\n\n**Manual downloads:**\n1. **Open any story** you want offline\n2. **Tap the download icon** in story options\n3. **Story saves** to your device\n\n**Manage offline content:**\n• Settings → Offline Reading\n• See storage usage\n• Remove unneeded downloads\n\nPerfect for commutes, flights, or poor signal areas! 🚇";
        }

        // Account/settings
        if (/account|settings|profile|manage|preferences/i.test(message)) {
            return "Managing your Pinsry account is easy! ⚙️ Here's what you can do:\n\n**Profile Settings:**\n• Update your bio and profile picture\n• Manage your display name\n• Set privacy preferences\n\n**Account Settings:**\n• Change email and password\n• Notification preferences\n• Privacy and security options\n\n**Content Settings:**\n• Manage your published stories\n• View reading history\n• Export your data\n\n**Access Settings:**\n• Tap your profile icon\n• Select 'Settings' from the menu\n• Choose the category you want to modify\n\nNeed help with something specific? Just ask! 🙂";
        }

        // Help with app features
        if (/how.*use|help.*with|feature|function/i.test(message)) {
            return "I'd love to help you with Pinsry! 🌟 Here are some popular topics:\n\n**📝 Story Creation** - Writing and publishing\n**🔖 Bookmarks** - Saving stories for later\n**👥 Following** - Connecting with authors\n**🔔 Notifications** - Staying updated\n**📱 Offline Reading** - Stories without internet\n**⚙️ Account Settings** - Managing your profile\n\nJust ask me about any of these topics, or feel free to ask something more specific! What would you like to know about?";
        }

        // App problems/bugs
        if (/problem|issue|bug|error|not.*working|broken/i.test(message)) {
            return "Sorry to hear you're experiencing issues! 😔 Let me help:\n\n**Quick fixes:**\n• Try closing and reopening the app\n• Check for app updates in your app store\n• Ensure you have a stable internet connection\n• Restart your device if problems persist\n\n**Still having trouble?**\n• Email us at **support@pinsry.com**\n• Include details about the issue\n• Mention your device type and app version\n\nOur support team responds quickly and will get you back to enjoying stories! 💪";
        }

        // Thanks/positive feedback
        if (/thank|thanks|appreciate|great|awesome|love/i.test(message)) {
            return "You're very welcome! 😊 It makes me happy to help. Pinsry is all about bringing people together through amazing stories, and I'm here whenever you need assistance.\n\nIs there anything else you'd like to know about the platform? I'm always here to help! 🌟";
        }

        return null;
    }

    getDefaultResponse() {
        const defaultResponses = [
            "I'd be happy to help! Could you tell me more about what you're looking for? You can ask me about creating stories, bookmarks, following authors, notifications, or any other Pinsry features.",
            "That's a great question! I can help with topics like story creation, bookmarks, following users, account settings, and more. What specific aspect of Pinsry would you like to know about?",
            "I'm here to help with all things Pinsry! Whether you need help with writing stories, managing your account, or using app features, just let me know what you'd like to learn about.",
            "Feel free to ask me about any Pinsry features! I can guide you through creating stories, using bookmarks, following authors, managing notifications, or anything else you need help with."
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    displayMessage(message) {
        if (!this.chatMessages) return;

        const messageEl = document.createElement('div');
        messageEl.className = `message ${message.type}`;

        const avatarEl = document.createElement('div');
        avatarEl.className = 'message-avatar';
        
        if (message.type === 'bot') {
            const avatarImg = document.createElement('img');
            avatarImg.src = 'logo.png';
            avatarImg.alt = 'Pinsry Assistant';
            avatarImg.style.width = '100%';
            avatarImg.style.height = '100%';
            avatarImg.style.borderRadius = '50%';
            avatarEl.appendChild(avatarImg);
        } else {
            avatarEl.textContent = 'You';
            avatarEl.style.fontSize = '0.75rem';
        }

        const bubbleEl = document.createElement('div');
        bubbleEl.className = 'message-bubble';
        
        // Convert **text** to bold and preserve line breaks
        let content = message.content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
        
        bubbleEl.innerHTML = content;

        messageEl.appendChild(avatarEl);
        messageEl.appendChild(bubbleEl);

        this.chatMessages.appendChild(messageEl);
        this.scrollChatToBottom();
    }

    showTyping() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const typingEl = document.createElement('div');
        typingEl.className = 'message bot';
        typingEl.id = 'typing-indicator';

        const avatarEl = document.createElement('div');
        avatarEl.className = 'message-avatar';
        const avatarImg = document.createElement('img');
        avatarImg.src = 'logo.png';
        avatarImg.alt = 'Pinsry Assistant';
        avatarImg.style.width = '100%';
        avatarImg.style.height = '100%';
        avatarImg.style.borderRadius = '50%';
        avatarEl.appendChild(avatarImg);

        const typingBubble = document.createElement('div');
        typingBubble.className = 'typing-indicator';
        typingBubble.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;

        typingEl.appendChild(avatarEl);
        typingEl.appendChild(typingBubble);
        
        this.chatMessages.appendChild(typingEl);
        this.scrollChatToBottom();
    }

    hideTyping() {
        this.isTyping = false;
        const typingEl = document.getElementById('typing-indicator');
        if (typingEl) {
            typingEl.remove();
        }
    }

    scrollChatToBottom() {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    updateActiveNav(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    updateNavOnScroll() {
        const sections = ['home', 'help', 'faq', 'contact'];
        const scrollPos = window.scrollY + 100;

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (section && navLink) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    this.updateActiveNav(navLink);
                }
            }
        });
    }
}

// Global scroll function for buttons
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PinsrySupport();
});

// Handle page visibility for chat focus
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page became visible, can refresh data if needed
    }
});
