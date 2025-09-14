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
        document.getElementById('mobileChatTrigger')?.addEventListener('click', () => this.openChat());
        
        // View Guides button
        document.getElementById('viewGuidesBtn')?.addEventListener('click', () => this.scrollToSection('guides'));
        
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

        // Desktop Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                this.updateActiveNav(link);
            });
        });

        // Mobile Navigation
        document.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                this.updateActiveMobileNav(link);
                this.closeMobileMenu();
            });
        });

        // Scroll spy for navigation
        window.addEventListener('scroll', () => this.updateNavOnScroll());
        
        // Mobile menu
        document.getElementById('mobileMenuToggle')?.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileMenuToggle = document.getElementById('mobileMenuToggle');
            
            if (mobileMenu && mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !mobileMenuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
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
            content: "Hi there! 👋 I'm your friendly Pinsry Assistant! How can I help you today? I'm here to assist you with anything about Pinsry, the amazing story-sharing platform created by **Luohino**. Feel free to ask me about creating stories, bookmarks, following authors, or any other questions you might have!"
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
        // Simple pattern matching for responses - instant response
        const response = this.matchResponse(message.toLowerCase());
        return response || this.getDefaultResponse();
    }

    matchResponse(message) {
        // Enhanced greeting patterns - more flexible and friendly
        if (/(hi|hello|hey|good\s+(morning|afternoon|evening)|greetings|sup|what's up)/i.test(message)) {
            const greetings = [
                "Hi there! 😊 I'm your friendly Pinsry Assistant! How can I help you today?",
                "Hello! 👋 Welcome to Pinsry! I'm here to help with anything you need. What's on your mind?",
                "Hey! 🌟 Great to see you! I'm excited to help you with Pinsry. What would you like to know?",
                "Hi! 😄 I'm here to make your Pinsry experience amazing! How can I assist you?",
                "Hello there! 🚀 Welcome to Pinsry Support! I'm ready to help with any questions you have!"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }

        // Creator/developer questions - Enhanced patterns for maximum detection
        if (/who\s+(created|made|developed|built|designed)\s+(this\s+app|pinsry|app)/i.test(message) || 
            /who\s+(created|made|developed|built|designed)\s+(this|the)/i.test(message) ||
            /who\s+(created|made|developed|built|designed)/i.test(message) ||
            /creator|developer|maker|luohino|founder|author\s+of|owner\s+of/i.test(message) ||
            /who\s+made|who\s+created|who\s+developed|who\s+built|who\s+designed/i.test(message) ||
            /made\s+this|created\s+this|developed\s+this|built\s+this|designed\s+this/i.test(message) ||
            /developing|creating|building|designing|contact.*developer|contact.*creator/i.test(message) ||
            /app.*developer|app.*creator|platform.*developer|platform.*creator/i.test(message) ||
            /behind\s+this|about\s+developer|about\s+creator|team\s+behind/i.test(message)) {
            return "Pinsry was created by **Luohino**! 🚀 Luohino is the visionary developer behind this amazing story-sharing platform. They've put their heart and soul into creating a space where writers and readers can connect through beautiful stories.\n\n**About Luohino:**\n• Passionate about storytelling and technology\n• Believes in the power of words to connect people\n• Created Pinsry to make story sharing accessible and beautiful\n• Continuously improving the platform based on user feedback\n\n**Pinsry's Mission:**\n• Connect writers and readers worldwide\n• Make storytelling accessible to everyone\n• Create a supportive community for authors\n• Preserve and share human stories\n\n**Connect with Luohino:**\n• Portfolio: [luohino.github.io/luohino](https://luohino.github.io/luohino/)\n• Email: luohino.pinsry@gmail.com\n\nWant to know more about Pinsry's features? Just ask! 😊";
        }

        // Story creation - Enhanced detection
        if (/(create|write|publish|new|post|story|writing|author|content|draft|compose)/i.test(message)) {
            return "Creating a story in Pinsry is super easy! 📝 Here's your complete guide:\n\n**Getting Started:**\n1. **Tap the '+' button** in the bottom navigation bar\n2. **Choose 'Create Story'** from the options\n3. **Add your title** - make it catchy and descriptive\n4. **Write your content** - pour your heart into it!\n5. **Preview your story** to make sure it looks perfect\n6. **Tap 'Publish'** to share with the Pinsry community!\n\n**Writing Features:**\n• **Rich text formatting** - Bold, italic, underline\n• **Add images** - Enhance your story with visuals\n• **Save as draft** - Work on it over time\n• **Auto-save** - Never lose your work\n• **Word count** - Track your progress\n• **Reading time** - See estimated read time\n\n**Story Types You Can Create:**\n• **Fiction** - Novels, short stories, poetry\n• **Non-fiction** - Articles, essays, memoirs\n• **Personal** - Life experiences, travel stories\n• **Educational** - How-to guides, tutorials\n• **Creative** - Poetry, scripts, experimental writing\n\n**After Publishing:**\n• Your story appears in feeds\n• Other users can discover it\n• You can edit it anytime\n• Track views and engagement\n• Share with friends\n\n**Pro Tips:**\n• Use descriptive titles\n• Add a compelling opening\n• Break up text with paragraphs\n• Use images to enhance storytelling\n• Engage with comments from readers\n\nHappy writing! ✨ Your story matters!";
        }

        // Bookmarks - Enhanced detection
        if (/(bookmark|save|favorite|favourite|read.*later|save.*for.*later|bookmark.*story|save.*story)/i.test(message)) {
            return "Bookmarking stories is a breeze! 🔖 Here's your complete guide:\n\n**How to Bookmark:**\n1. **Find the bookmark icon** (🔖) on any story card\n2. **Tap the bookmark icon** to save the story\n3. **Icon turns solid** when bookmarked\n4. **Access your bookmarks** via the 'Bookmarks' section in navigation\n\n**Bookmark Features:**\n• **Unlimited bookmarks** - Save as many as you want\n• **Sync across devices** - Access from anywhere\n• **Organize by date** - See newest bookmarks first\n• **Search bookmarks** - Find specific saved stories\n• **Reading progress** - See where you left off\n• **Quick access** - Read anytime, anywhere\n\n**Managing Bookmarks:**\n• **View all bookmarks** - Tap Bookmarks in navigation\n• **Remove bookmarks** - Tap the bookmark icon again\n• **Sort options** - By date added, reading progress, or title\n• **Filter by author** - Find stories from specific writers\n• **Mark as read** - Track your reading progress\n\n**Bookmark Benefits:**\n• **Never lose a story** - Always accessible\n• **Reading queue** - Build your personal library\n• **Offline access** - Read without internet\n• **Personal collection** - Curate your favorite content\n• **Share bookmarks** - Recommend stories to friends\n\n**Pro Tips:**\n• Bookmark stories you want to read later\n• Use bookmarks to build a reading list\n• Organize by genre or topic\n• Share your favorite bookmarks with others\n• Check bookmarks regularly for new content\n\nStart building your personal story library! 📚✨";
        }

        // Following users - Enhanced detection
        if (/(follow|following|subscribe|connect|author|writer|user|people)/i.test(message)) {
            return "Following your favorite authors is great for staying updated! 👥 Here's your complete guide:\n\n**How to Follow:**\n1. **Visit an author's profile** by tapping their name or picture\n2. **Tap the 'Follow' button** on their profile\n3. **Button changes to 'Following'** when successful\n4. **See their new stories** in your personalized feed\n\n**Following Features:**\n• **Personalized feed** - See stories from authors you follow\n• **Real-time updates** - Get notified of new stories\n• **Author profiles** - Learn about your favorite writers\n• **Story notifications** - Never miss new content\n• **Unlimited follows** - Follow as many authors as you want\n• **Easy management** - Unfollow anytime\n\n**What You'll See:**\n• **New stories** from followed authors in your feed\n• **Author activity** - When they publish new content\n• **Reading recommendations** - Based on your follows\n• **Community updates** - Stories from your network\n• **Trending content** - Popular stories from followed authors\n\n**Managing Your Follows:**\n• **View following list** - See all authors you follow\n• **Unfollow authors** - Tap 'Following' to unfollow\n• **Follow suggestions** - Discover new authors\n• **Follow limits** - No limits on how many you can follow\n• **Privacy settings** - Control who can follow you\n\n**Benefits of Following:**\n• **Curated content** - Stories tailored to your interests\n• **Support authors** - Help writers grow their audience\n• **Build community** - Connect with like-minded readers\n• **Discover trends** - See what's popular in your interests\n• **Stay updated** - Never miss new content from favorites\n\n**Pro Tips:**\n• Follow authors whose writing style you enjoy\n• Check your following list regularly\n• Engage with authors through comments\n• Share stories from authors you follow\n• Discover new authors through recommendations\n\nStart building your reading community! 🌟📚";
        }

        // Notifications - Enhanced detection
        if (/(notification|alert|update|bell|reminder|notify|ping)/i.test(message)) {
            return "Stay connected with Pinsry notifications! 🔔 Here's your complete guide:\n\n**Where to Find Notifications:**\n• **Bell icon** at the top of your feed\n• **All notifications** in one organized place\n• **Badge count** shows unread notifications\n• **Quick access** from any screen\n\n**Types of Notifications:**\n• **New stories** from authors you follow\n• **Likes and comments** on your stories\n• **New followers** - Someone followed you\n• **Story recommendations** - Personalized suggestions\n• **Reading reminders** - Continue unfinished stories\n• **Community updates** - Trending content\n• **Author activity** - Updates from favorite writers\n• **System updates** - App news and features\n\n**Notification Features:**\n• **Real-time updates** - Get notified instantly\n• **Rich content** - See story previews and author info\n• **Quick actions** - Like, comment, or read directly\n• **Mark as read** - Keep your inbox organized\n• **Notification history** - See all past notifications\n• **Smart grouping** - Similar notifications grouped together\n\n**Customizing Notifications:**\n• **Settings → Notifications** - Full control\n• **Turn on/off** specific notification types\n• **Quiet hours** - No notifications during sleep\n• **Frequency settings** - Daily digest or real-time\n• **Sound settings** - Customize notification sounds\n• **Push notifications** - Control mobile alerts\n\n**Managing Notifications:**\n• **Mark as read** - Tap individual notifications\n• **Mark all as read** - Clear all at once\n• **Delete notifications** - Remove old ones\n• **Filter by type** - See specific notification types\n• **Search notifications** - Find specific ones\n\n**Notification Benefits:**\n• **Stay engaged** - Never miss important updates\n• **Build community** - Respond to interactions\n• **Discover content** - Find new stories to read\n• **Support authors** - Engage with their work\n• **Stay informed** - Know what's happening\n\n**Pro Tips:**\n• Check notifications regularly\n• Respond to comments and likes\n• Use notifications to discover new authors\n• Customize settings to your preferences\n• Don't let notifications overwhelm you\n\nNever miss the stories that matter to you! 📱✨";
        }

        // Offline reading - Enhanced detection
        if (/(offline|download|internet|connection|wifi|data|airplane|flight|commute)/i.test(message)) {
            return "Absolutely! Pinsry supports offline reading! 📱✈️ Here's your complete guide:\n\n**How Offline Reading Works:**\n• **Automatic caching** - Stories are cached when online\n• **Smart downloads** - Based on your reading habits\n• **Sync progress** - Reading position syncs when reconnected\n• **Background updates** - Content updates when online\n\n**Manual Downloads:**\n1. **Open any story** you want offline\n2. **Tap the download icon** in story options\n3. **Story saves** to your device\n4. **Access anytime** without internet\n\n**Offline Features:**\n• **Read anywhere** - No internet required\n• **Full story access** - Complete content available\n• **Reading progress** - Track where you left off\n• **Bookmark support** - Save stories offline\n• **Search offline** - Find downloaded stories\n• **Share offline** - Share downloaded content\n\n**Managing Offline Content:**\n• **Settings → Offline Reading** - Full control\n• **Storage usage** - See how much space used\n• **Download queue** - Manage pending downloads\n• **Remove downloads** - Free up space\n• **Auto-download settings** - Control what gets cached\n• **Storage limits** - Set maximum offline storage\n\n**Offline Reading Benefits:**\n• **Commute reading** - Perfect for trains, buses, subways\n• **Flight entertainment** - Read during flights\n• **Poor signal areas** - Read anywhere, anytime\n• **Data savings** - Reduce mobile data usage\n• **Battery friendly** - No constant internet connection\n• **Privacy** - Read without being tracked\n\n**Best Practices:**\n• **Download before travel** - Prepare your reading list\n• **Manage storage** - Keep only what you need\n• **Update regularly** - Refresh content when online\n• **Use bookmarks** - Mark stories for offline reading\n• **Check settings** - Optimize for your usage\n\n**Perfect For:**\n• **Daily commutes** - Read on the go\n• **Travel** - Flights, trains, road trips\n• **Poor internet** - Rural areas, basements\n• **Data limits** - Save on mobile data\n• **Privacy** - Read without internet tracking\n• **Focus** - Distraction-free reading\n\n**Pro Tips:**\n• Download stories before long trips\n• Use bookmarks to organize offline content\n• Check storage usage regularly\n• Update content when you have good internet\n• Use offline mode to focus on reading\n\nNever let poor internet stop your reading! 🚇📚";
        }

        // Account/settings - Enhanced detection
        if (/(account|settings|profile|manage|preferences|config|setup|personal|bio|avatar)/i.test(message)) {
            return "Managing your Pinsry account is easy! ⚙️ Here's your complete guide:\n\n**Profile Settings:**\n• **Display name** - Change how your name appears\n• **Bio** - Write about yourself and interests\n• **Profile picture** - Upload a custom avatar\n• **Cover photo** - Add a background image\n• **Location** - Share where you're from\n• **Website** - Link to your personal site\n• **Social links** - Connect other platforms\n\n**Account Settings:**\n• **Email address** - Update your email\n• **Password** - Change your password\n• **Phone number** - Add for security\n• **Two-factor auth** - Extra security layer\n• **Account deletion** - Remove your account\n• **Data export** - Download your data\n\n**Privacy Settings:**\n• **Profile visibility** - Public or private\n• **Story privacy** - Who can see your stories\n• **Follow requests** - Approve followers\n• **Blocked users** - Manage blocked accounts\n• **Data sharing** - Control data usage\n• **Location sharing** - Hide your location\n\n**Notification Settings:**\n• **Push notifications** - Mobile alerts\n• **Email notifications** - Email updates\n• **Story notifications** - New story alerts\n• **Comment notifications** - Comment alerts\n• **Follow notifications** - Follower alerts\n• **Quiet hours** - No notifications during sleep\n\n**Content Settings:**\n• **Published stories** - Manage your stories\n• **Drafts** - Work on unpublished stories\n• **Reading history** - View read stories\n• **Bookmarks** - Manage saved stories\n• **Liked stories** - Stories you've liked\n• **Comments** - Your comment history\n\n**Reading Preferences:**\n• **Text size** - Adjust reading font size\n• **Theme** - Light or dark mode\n• **Reading mode** - Distraction-free reading\n• **Auto-scroll** - Automatic scrolling\n• **Reading progress** - Show progress bars\n• **Offline reading** - Download settings\n\n**Access Settings:**\n• **Tap your profile icon** - Access main menu\n• **Select 'Settings'** - Open settings\n• **Choose category** - Navigate to specific settings\n• **Save changes** - Apply your preferences\n• **Reset to default** - Restore original settings\n\n**Security Features:**\n• **Login history** - See recent logins\n• **Active sessions** - Manage logged-in devices\n• **Security alerts** - Get notified of suspicious activity\n• **Password strength** - Check password security\n• **Account recovery** - Set up recovery options\n\n**Pro Tips:**\n• Update your bio regularly\n• Use a clear profile picture\n• Set privacy preferences carefully\n• Enable two-factor authentication\n• Check notification settings\n• Keep your information updated\n\nNeed help with something specific? Just ask! 🙂";
        }

        // Reading stories - New feature detection
        if (/(read|reading|story.*read|open.*story|view.*story|story.*view)/i.test(message)) {
            return "Reading stories in Pinsry is a beautiful experience! 📖 Here's your complete guide:\n\n**Finding Stories to Read:**\n• **Personalized Feed** - Stories tailored to your interests\n• **Discover Section** - Explore new and trending content\n• **Search Function** - Find specific topics or authors\n• **Bookmarks** - Access your saved stories\n• **Following Feed** - Stories from authors you follow\n• **Recommendations** - AI-powered story suggestions\n\n**Reading Experience:**\n• **Tap any story card** to open it\n• **Swipe or scroll** to read through content\n• **Reading progress indicator** - See how much you've read\n• **Auto-save position** - Resume where you left off\n• **Smooth scrolling** - Fluid reading experience\n• **Full-screen mode** - Distraction-free reading\n\n**Reading Features:**\n• **Text customization** - Adjust size, font, and spacing\n• **Dark/Light mode** - Choose your preferred theme\n• **Reading mode** - Focus on content without distractions\n• **Bookmark while reading** - Save stories mid-read\n• **Share while reading** - Share interesting passages\n• **Comment while reading** - Engage with the story\n\n**Reading Controls:**\n• **Scroll speed** - Adjust scrolling sensitivity\n• **Auto-scroll** - Automatic scrolling option\n• **Reading timer** - Track reading time\n• **Progress tracking** - See reading statistics\n• **Chapter navigation** - Jump between sections\n• **Table of contents** - Quick story navigation\n\n**Reading Benefits:**\n• **Immersive experience** - Beautiful, distraction-free reading\n• **Personalized content** - Stories you'll love\n• **Community engagement** - Connect with other readers\n• **Learning opportunities** - Discover new perspectives\n• **Entertainment** - Enjoy amazing stories\n• **Skill building** - Improve reading comprehension\n\n**Reading Tips:**\n• **Find your rhythm** - Read at your own pace\n• **Take breaks** - Don't rush through stories\n• **Engage with content** - Like, comment, and share\n• **Explore different genres** - Try new types of stories\n• **Join discussions** - Connect with other readers\n• **Use bookmarks** - Save stories for later\n\n**Reading Statistics:**\n• **Reading time** - Track how long you read\n• **Stories completed** - See your reading progress\n• **Words read** - Count your reading achievements\n• **Reading streak** - Maintain daily reading habits\n• **Favorite genres** - Discover your preferences\n• **Reading goals** - Set and achieve targets\n\n**Pro Tips:**\n• Use reading mode for better focus\n• Adjust text size for comfort\n• Bookmark interesting stories\n• Engage with authors through comments\n• Explore different story types\n• Set reading goals to stay motivated\n\nEnjoy your reading journey! 📚✨";
        }

        // Search and discovery - New feature detection
        if (/(search|find|discover|explore|browse|look.*for)/i.test(message)) {
            return "Discovering amazing stories is easy in Pinsry! 🔍 Here's your complete guide:\n\n**Search Features:**\n• **Smart search bar** - Find stories instantly\n• **Search by author** - Find stories from specific writers\n• **Search by title** - Look for specific story titles\n• **Search by content** - Find stories with specific topics\n• **Search by tags** - Discover stories by categories\n• **Search by genre** - Find stories by type\n• **Search by date** - Find recent or older stories\n• **Search by popularity** - See trending content\n\n**Advanced Search Options:**\n• **Filter by length** - Short stories, novels, or articles\n• **Filter by reading time** - Quick reads or long reads\n• **Filter by language** - Stories in different languages\n• **Filter by rating** - Highly rated stories\n• **Filter by date range** - Recent or historical content\n• **Filter by author** - Stories from specific writers\n• **Filter by tags** - Stories with specific topics\n• **Filter by bookmarks** - Stories you've saved\n\n**Discovery Options:**\n• **Personalized Feed** - Stories tailored to your interests\n• **Discover Section** - Explore new and trending content\n• **Bookmarks** - Your saved stories collection\n• **Following Feed** - Stories from authors you follow\n• **Trending Stories** - What's popular right now\n• **Featured Stories** - Editor's picks and highlights\n• **New Releases** - Fresh content from authors\n• **Popular Authors** - Top writers on the platform\n\n**Recommendation System:**\n• **AI-powered suggestions** - Personalized story recommendations\n• **Based on reading history** - Stories similar to what you've read\n• **Based on bookmarks** - Content similar to your saved stories\n• **Based on following** - Stories from similar authors\n• **Trending in your interests** - Popular content in your areas\n• **New author discoveries** - Writers you might like\n• **Genre recommendations** - New types of stories to try\n• **Reading level suggestions** - Content matching your preferences\n\n**Search Tips:**\n• **Use specific keywords** - Be precise in your search\n• **Try different terms** - Use synonyms and related words\n• **Search by author name** - Find all stories from a writer\n• **Use tags effectively** - Search by story categories\n• **Combine filters** - Use multiple search criteria\n• **Save searches** - Bookmark useful search terms\n• **Explore suggestions** - Try recommended searches\n• **Check trending** - See what's popular\n\n**Discovery Benefits:**\n• **Find hidden gems** - Discover amazing unknown stories\n• **Explore new genres** - Try different types of content\n• **Connect with authors** - Find writers you love\n• **Build reading lists** - Curate your perfect collection\n• **Stay updated** - Never miss great content\n• **Learn new things** - Discover educational content\n• **Entertainment** - Find stories that entertain you\n• **Inspiration** - Get inspired by great writing\n\n**Pro Tips:**\n• Use the search bar regularly\n• Explore different discovery sections\n• Try trending and featured content\n• Follow authors you discover\n• Bookmark interesting finds\n• Share great discoveries with friends\n• Use filters to narrow down results\n• Check recommendations daily\n\nHappy exploring! 🌟📚";
        }

        // Likes and interactions - New feature detection
        if (/(like|likes|love|heart|react|interaction|comment|share)/i.test(message)) {
            return "Interacting with stories is a great way to show appreciation! ❤️ Here's your complete guide:\n\n**Liking Stories:**\n• **Tap the heart icon** on any story to like it\n• **Heart turns red** when you've liked it\n• **See liked stories** in your profile section\n• **Authors get notified** when you like their work\n• **Like count increases** for the story\n• **Unlike anytime** by tapping the heart again\n\n**Commenting on Stories:**\n• **Tap the comment icon** on any story\n• **Write thoughtful comments** about the story\n• **Start conversations** with authors and readers\n• **Reply to comments** from other users\n• **Edit or delete** your own comments\n• **Report inappropriate** comments if needed\n\n**Sharing Stories:**\n• **Share with friends** - Send stories directly\n• **Share to social media** - Post on other platforms\n• **Share via link** - Copy story links\n• **Share specific passages** - Highlight and share quotes\n• **Share to groups** - Share with reading communities\n• **Share privately** - Send to specific people\n\n**Interaction Features:**\n• **Like comments** - Show appreciation for good comments\n• **Reply to comments** - Continue conversations\n• **Mention users** - Tag people in comments\n• **Use emojis** - Express reactions with emojis\n• **Quote stories** - Share specific parts\n• **Bookmark while interacting** - Save stories you're engaging with\n\n**Engagement Benefits:**\n• **Support authors** - Help writers grow their audience\n• **Build community** - Connect with like-minded readers\n• **Discover content** - Find stories through interactions\n• **Improve recommendations** - Help AI suggest better content\n• **Create discussions** - Start meaningful conversations\n• **Show appreciation** - Let authors know you enjoyed their work\n\n**Interaction Etiquette:**\n• **Be respectful** - Keep comments constructive\n• **Be genuine** - Only like stories you truly enjoy\n• **Be helpful** - Share useful feedback\n• **Be kind** - Support the community\n• **Be thoughtful** - Write meaningful comments\n• **Be engaging** - Start interesting discussions\n\n**Managing Interactions:**\n• **View your likes** - See all stories you've liked\n• **View your comments** - See all your comments\n• **Edit interactions** - Modify your comments\n• **Delete interactions** - Remove likes or comments\n• **Privacy settings** - Control who sees your interactions\n• **Notification settings** - Control interaction alerts\n\n**Interaction Statistics:**\n• **Likes given** - See how many stories you've liked\n• **Comments made** - Track your commenting activity\n• **Shares made** - See what you've shared\n• **Engagement rate** - How much you interact\n• **Community impact** - Your contribution to discussions\n• **Author relationships** - Connections you've built\n\n**Pro Tips:**\n• Like stories you genuinely enjoy\n• Write thoughtful, constructive comments\n• Share stories that others might love\n• Engage with authors regularly\n• Be part of the community\n• Use interactions to discover new content\n• Build relationships through engagement\n• Support emerging authors\n\nKeep spreading the love! 💕🌟";
        }

        // Help with app features
        if (/how.*use|help.*with|feature|function|what.*can.*do|capabilities/i.test(message)) {
            return "I'd love to help you with Pinsry! 🌟 Here are all the amazing features:\n\n**📝 Story Creation** - Write and publish your stories\n**📖 Reading** - Enjoy beautiful story reading experience\n**🔖 Bookmarks** - Save stories for later reading\n**👥 Following** - Connect with your favorite authors\n**🔔 Notifications** - Stay updated with new content\n**📱 Offline Reading** - Read without internet connection\n**🔍 Search & Discover** - Find amazing stories\n**❤️ Interactions** - Like, comment, and share stories\n**⚙️ Account Settings** - Manage your profile and preferences\n\nJust ask me about any of these features! What would you like to know about?";
        }

        // App problems/bugs
        if (/problem|issue|bug|error|not.*working|broken/i.test(message)) {
            return "Sorry to hear you're experiencing issues! 😔 Let me help:\n\n**Quick fixes:**\n• Try closing and reopening the app\n• Check for app updates in your app store\n• Ensure you have a stable internet connection\n• Restart your device if problems persist\n\n**Still having trouble?**\n• Email us at **support@pinsry.com**\n• Include details about the issue\n• Mention your device type and app version\n\nOur support team responds quickly and will get you back to enjoying stories! 💪";
        }

        // Thanks/positive feedback
        if (/(thank|thanks|appreciate|great|awesome|love|amazing|wonderful|perfect|excellent)/i.test(message)) {
            return "You're very welcome! 😊 It makes me so happy to help! Pinsry is all about bringing people together through amazing stories, and I'm here whenever you need assistance.\n\nIs there anything else you'd like to know about the platform? I'm always here to help! 🌟";
        }

        // General help questions
        if (/(help|how|what|where|when|why|can.*you|do.*you|tell.*me)/i.test(message)) {
            return "I'm here to help! 🤗 I can assist you with:\n\n**📝 Creating & Writing Stories**\n**📖 Reading & Discovering Content**\n**🔖 Bookmarking & Saving Stories**\n**👥 Following Authors & Users**\n**🔔 Managing Notifications**\n**📱 Offline Reading Features**\n**🔍 Searching & Exploring**\n**❤️ Liking & Interacting**\n**⚙️ Account & Settings**\n\nWhat specific feature would you like to learn about? Just ask me anything! 😊";
        }

        // App navigation questions
        if (/(navigate|navigation|menu|screen|page|where.*find|how.*get|go.*to)/i.test(message)) {
            return "Navigating Pinsry is super easy! 🗺️ Here's your complete guide:\n\n**Main Navigation (Bottom Bar):**\n• **Feed** - Your personalized story feed\n• **Discover** - Explore new and trending stories\n• **Bookmarks** - Your saved stories\n• **Profile** - Your account and stories\n• **+** - Create new content\n\n**Top Navigation:**\n• **Search** - Find specific stories or authors\n• **Notifications** - See updates and interactions\n• **Settings** - Manage your account\n\n**Quick Tips:**\n• Swipe between sections\n• Tap and hold for more options\n• Use the search bar for quick access\n\nNeed help with a specific screen? Just ask! 🚀";
        }

        // Story editing and management
        if (/(edit|editing|modify|update|change|revise|draft|unpublish|delete.*story)/i.test(message)) {
            return "Managing your stories is easy in Pinsry! ✏️ Here's your complete guide:\n\n**Editing Published Stories:**\n• **Go to your profile** - Tap your profile icon\n• **Find your story** - Scroll to the story you want to edit\n• **Tap the story** - Open the story details\n• **Tap 'Edit'** - Enter edit mode\n• **Make changes** - Update title, content, or images\n• **Save changes** - Your story updates automatically\n• **Preview changes** - See how it looks before saving\n\n**Draft Management:**\n• **Save as draft** - Work on stories over time\n• **Access drafts** - Find them in your profile\n• **Continue editing** - Pick up where you left off\n• **Publish when ready** - Share your completed story\n• **Delete drafts** - Remove stories you don't want\n\n**Story Settings:**\n• **Privacy settings** - Control who can see your story\n• **Comments** - Enable or disable comments\n• **Sharing** - Control sharing permissions\n• **Reading time** - See estimated read time\n• **Word count** - Track your story length\n\n**Content Management:**\n• **Add images** - Enhance your story with visuals\n• **Format text** - Use bold, italic, and other formatting\n• **Add tags** - Help readers find your story\n• **Set categories** - Organize your content\n• **Preview mode** - See how readers will see it\n\n**Story Analytics:**\n• **View count** - See how many people read your story\n• **Like count** - Track engagement\n• **Comment count** - See reader interactions\n• **Share count** - Track how often it's shared\n• **Reading time** - See average reading duration\n\n**Pro Tips:**\n• Edit stories regularly to improve them\n• Use drafts to work on longer stories\n• Add images to make stories more engaging\n• Use tags to help readers find your content\n• Preview before publishing\n• Engage with readers through comments\n\nKeep your stories fresh and engaging! ✨📝";
        }

        // Community and social features
        if (/(community|social|friends|connect|network|discussion|forum|chat)/i.test(message)) {
            return "Building community in Pinsry is amazing! 🤝 Here's your complete guide:\n\n**Community Features:**\n• **Follow authors** - Connect with writers you love\n• **Join discussions** - Comment on stories and engage\n• **Share stories** - Spread great content with friends\n• **Build relationships** - Connect with like-minded readers\n• **Support authors** - Help writers grow their audience\n\n**Social Interactions:**\n• **Like stories** - Show appreciation for great content\n• **Comment thoughtfully** - Start meaningful conversations\n• **Share recommendations** - Help others discover great stories\n• **Follow interesting people** - Build your reading network\n• **Engage regularly** - Be an active community member\n\n**Community Benefits:**\n• **Discover new content** - Find stories through your network\n• **Get recommendations** - Receive personalized suggestions\n• **Build relationships** - Connect with authors and readers\n• **Learn and grow** - Expand your reading horizons\n• **Support creators** - Help writers succeed\n\n**Community Guidelines:**\n• **Be respectful** - Treat everyone with kindness\n• **Be constructive** - Provide helpful feedback\n• **Be genuine** - Share authentic thoughts and feelings\n• **Be supportive** - Encourage and uplift others\n• **Be inclusive** - Welcome diverse perspectives\n\n**Building Your Network:**\n• **Follow authors** whose writing you enjoy\n• **Engage with content** through likes and comments\n• **Share great stories** with your network\n• **Participate in discussions** about stories\n• **Support emerging writers** by following and engaging\n\n**Pro Tips:**\n• Be active in the community\n• Share stories you genuinely love\n• Write thoughtful comments\n• Follow authors who inspire you\n• Support the community through engagement\n• Be kind and respectful to everyone\n\nJoin the amazing Pinsry community! 🌟📚";
        }

        // Contact and portfolio questions
        if (/(contact|portfolio|website|social|linkedin|github|luohino|developer.*contact|creator.*contact|email.*luohino|reach.*luohino)/i.test(message)) {
            return "Great question! Here's how you can connect with **Luohino**, the creator of Pinsry! 🚀\n\n**Portfolio & Work:**\n• **Main Portfolio**: [luohino.github.io/luohino](https://luohino.github.io/luohino/)\n• **GitHub Profile**: [github.com/luohino](https://github.com/luohino)\n• **Email**: luohino.pinsry@gmail.com\n\n**About Luohino:**\n• **Full-Stack Developer** with passion for storytelling\n• **Creator of Pinsry** - A beautiful story-sharing platform\n• **Technology Enthusiast** - Always learning and building\n• **Community Builder** - Loves connecting people through stories\n\n**What You'll Find:**\n• **Portfolio Projects** - See other amazing creations\n• **Technical Skills** - Full-stack development expertise\n• **Contact Information** - Multiple ways to reach out\n• **Project Showcases** - Detailed case studies\n• **Resume & Experience** - Professional background\n\n**Why Connect?**\n• **Collaboration Opportunities** - Work together on projects\n• **Technical Discussions** - Share knowledge and ideas\n• **Feedback & Suggestions** - Help improve Pinsry\n• **Networking** - Connect with like-minded developers\n\nFeel free to reach out! Luohino loves connecting with the Pinsry community! 💫";
        }

        // Privacy and security
        if (/(privacy|security|safe|protect|block|report|inappropriate|harassment)/i.test(message)) {
            return "Your privacy and security are important in Pinsry! 🔒 Here's your complete guide:\n\n**Privacy Settings:**\n• **Profile visibility** - Control who can see your profile\n• **Story privacy** - Choose who can read your stories\n• **Follow requests** - Approve who can follow you\n• **Location sharing** - Control location information\n• **Data sharing** - Manage how your data is used\n\n**Security Features:**\n• **Two-factor authentication** - Extra security for your account\n• **Password protection** - Strong password requirements\n• **Login history** - See recent account activity\n• **Active sessions** - Manage logged-in devices\n• **Security alerts** - Get notified of suspicious activity\n\n**Content Moderation:**\n• **Report inappropriate content** - Flag harmful or offensive material\n• **Block users** - Prevent unwanted interactions\n• **Mute users** - Hide content from specific people\n• **Content filters** - Control what content you see\n• **Community guidelines** - Clear rules for behavior\n\n**Safety Tools:**\n• **Block and report** - Protect yourself from harassment\n• **Privacy controls** - Limit who can contact you\n• **Content warnings** - Get alerts about sensitive content\n• **Safe browsing** - Filter inappropriate content\n• **Emergency contacts** - Get help when needed\n\n**Data Protection:**\n• **Data encryption** - Your information is protected\n• **Secure storage** - Safe data storage practices\n• **Regular backups** - Your content is backed up\n• **Data export** - Download your data anytime\n• **Account deletion** - Remove your account completely\n\n**Reporting System:**\n• **Easy reporting** - Simple process to report issues\n• **Quick response** - Fast action on reports\n• **Anonymous reporting** - Report without revealing identity\n• **Multiple report types** - Report different kinds of issues\n• **Follow-up support** - Get help after reporting\n\n**Pro Tips:**\n• Use strong, unique passwords\n• Enable two-factor authentication\n• Review privacy settings regularly\n• Report inappropriate behavior\n• Block users who make you uncomfortable\n• Keep your personal information private\n\nStay safe and secure in Pinsry! 🛡️✨";
        }

        return null;
    }

    getDefaultResponse() {
        const defaultResponses = [
            "I'd love to help you! 😊 Could you tell me more about what you're looking for? I can help with creating stories, bookmarks, following authors, notifications, reading, searching, and much more!",
            "That's interesting! 🤔 I'm here to help with all things Pinsry. You can ask me about story creation, bookmarks, following users, account settings, reading features, or anything else!",
            "I'm excited to help you! 🌟 Whether you need help with writing stories, managing your account, discovering content, or using any app features, just let me know what you'd like to learn about!",
            "Absolutely! I'm here for you! 💪 Feel free to ask me about creating stories, using bookmarks, following authors, managing notifications, reading, searching, or any other Pinsry features!",
            "Great question! 🚀 I can help you with story creation, bookmarks, following, notifications, reading, discovery, interactions, and account management. What would you like to know about?",
            "I'm your friendly Pinsry Assistant! 😄 I can help with writing stories, saving bookmarks, following authors, managing notifications, reading content, searching, and so much more. What can I help you with today?"
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
        const sections = ['home', 'help', 'faq', 'guides', 'contact'];
        const scrollPos = window.scrollY + 100;

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            const mobileNavLink = document.querySelector(`.mobile-menu-link[href="#${sectionId}"]`);
            
            if (section && navLink) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    this.updateActiveNav(navLink);
                    if (mobileNavLink) {
                        this.updateActiveMobileNav(mobileNavLink);
                    }
                }
            }
        });
    }

    // Mobile Menu Methods
    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        if (mobileMenu && mobileMenuToggle) {
            mobileMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (mobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        if (mobileMenu && mobileMenuToggle) {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    updateActiveMobileNav(activeLink) {
        document.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
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