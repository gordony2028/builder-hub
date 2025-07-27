// Global state management
const AppState = {
    currentTab: 'builder-hub',
    userVotes: new Set(),
    userBoardVotes: new Set(),
    comments: [],
    crosswordProgress: {},
    newSubmissions: [],
    user: null,
    isLoggedIn: false
};

// Sample data for different tabs
const TabData = {
    'starting-up': {
        title: 'Building Your First Startup: Essential Steps',
        description: 'From idea validation to first revenue - everything you need to know about starting your entrepreneurial journey.',
        image: 'From Zero to Launch: The Complete Startup Guide',
        votes: 25,
        comments: 18,
        author: '@StartupGuru'
    },
    'tech': {
        title: 'Building Scalable Applications in 2025',
        description: 'Modern architecture patterns, cloud infrastructure, and development practices that help you build for millions of users.',
        image: 'Tech Stack Mastery: React, Node.js & Beyond',
        votes: 42,
        comments: 31,
        author: '@TechWiz'
    },
    'ai': {
        title: 'How AI is Transforming Indie Development',
        description: 'Discover how artificial intelligence is revolutionizing the way independent developers build and scale their products.',
        image: 'AI-Powered Development: Tools & Techniques',
        votes: 67,
        comments: 45,
        author: '@AIBuilder'
    },
    'builder-hub': {
        title: 'Hitting a 7-figure ARR by adding value in niche communities',
        description: 'Mas Hossain built a tool for his agency, then started talking about it in communities. Now, it\'s bringing in a 7-figure ARR.',
        image: 'Hitting a 7-figure ARR by adding value in niche communities',
        votes: 10,
        comments: 6,
        author: '@BuilderJames'
    },
    'creators': {
        title: 'Content Creation Empire: From Zero to 100K Followers',
        description: 'How to build a sustainable content business across multiple platforms while maintaining quality and authenticity.',
        image: 'Creator Economy Mastery Guide',
        votes: 38,
        comments: 52,
        author: '@CreatorPro'
    },
    'lifestyle': {
        title: 'Digital Nomad Lifestyle: Working from Anywhere',
        description: 'Complete guide to becoming location independent, managing remote teams, and building a business while traveling.',
        image: 'Ultimate Digital Nomad Handbook',
        votes: 29,
        comments: 67,
        author: '@NomadLife'
    },
    'money': {
        title: 'Revenue Optimization: From $1K to $100K MRR',
        description: 'Proven strategies for scaling subscription revenue, including pricing psychology, retention tactics, and growth hacking.',
        image: 'Revenue Growth Acceleration Guide',
        votes: 84,
        comments: 73,
        author: '@RevenueKing'
    }
};

// Crossword puzzle data
const CrosswordData = {
    solution: [
        ['', 'M', '', '', ''],
        ['S', 'L', 'A', 'C', 'K'],
        ['', 'A', '', '', ''],
        ['', 'C', '', '', ''],
        ['', 'K', '', '', '']
    ],
    clues: {
        across: [
            { number: 1, clue: 'Where startup teams send memes instead of working', answer: 'SLACK', row: 1, col: 0 }
        ],
        down: [
            { number: 2, clue: 'Kind of SaaS that keeps things minimal', answer: 'MICRO', row: 0, col: 1 }
        ]
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupTabNavigation();
    setupWelcomeBanner();
    setupActionButtons();
    setupModals();
    setupVoting();
    setupComments();
    setupCrossword();
    setupBoardVoting();
    setupSidebarInteractions();
    loadNewestPosts();
    setupScrollEffects();
    setupAuthentication();
    checkAuthState();
}

// Tab Navigation System
function setupTabNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    navTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.dataset.tab;
            
            if (targetTab && targetTab !== AppState.currentTab) {
                switchTab(targetTab);
            }
        });
    });
}

function switchTab(tabName) {
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName || (tabName === 'builder-hub' && tab.classList.contains('brand-tab'))) {
            tab.classList.add('active');
        }
    });

    // Show/hide sidebar content
    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.id === `${tabName}-sidebar`) {
            content.style.display = 'block';
            // Animate in
            content.style.opacity = '0';
            setTimeout(() => {
                content.style.opacity = '1';
            }, 10);
        } else {
            content.style.display = 'none';
        }
    });

    // Update main content
    updateMainContent(tabName);
    AppState.currentTab = tabName;

    // Add visual feedback
    const header = document.querySelector('.header');
    header.style.transform = 'scale(1.005)';
    setTimeout(() => {
        header.style.transform = 'scale(1)';
    }, 200);
}

function updateMainContent(tabName) {
    const data = TabData[tabName];
    if (!data) return;

    // Update featured post content
    document.getElementById('post-title').textContent = data.title;
    document.getElementById('post-description').textContent = data.description;
    document.getElementById('featured-image').textContent = data.image;
    document.getElementById('upvote-count').textContent = data.votes;
    document.getElementById('comment-count').textContent = data.comments;
    document.querySelector('.username').textContent = data.author;

    // Reset voting state for new content
    const upvoteBtn = document.getElementById('upvote-btn');
    upvoteBtn.classList.remove('voted');
    
    // Clear comments
    document.getElementById('comments-list').innerHTML = '';
    AppState.comments = [];
}

// Welcome Banner
function setupWelcomeBanner() {
    const closeBanner = document.getElementById('close-banner');
    const banner = document.getElementById('welcome-banner');

    closeBanner.addEventListener('click', function() {
        banner.classList.add('hidden');
        setTimeout(() => {
            banner.style.display = 'none';
        }, 300);
    });
}

// Action Buttons
function setupActionButtons() {
    const submitBtn = document.getElementById('submit-btn');
    const advertiseBtn = document.getElementById('advertise-btn');

    submitBtn.addEventListener('click', function() {
        showModal('submit-modal');
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });

    advertiseBtn.addEventListener('click', function() {
        showModal('advertise-modal');
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
}

// Modal System
function setupModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        // Close button
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => hideModal(modal.id));
        
        // Click outside to close
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideModal(modal.id);
            }
        });
    });

    // Submit form handler
    const submitForm = document.getElementById('submit-form');
    submitForm.addEventListener('submit', handleSubmitPost);

    // Contact sales button
    const contactSales = document.getElementById('contact-sales');
    contactSales.addEventListener('click', function() {
        alert('Thanks for your interest! We\'ll contact you within 24 hours.');
        hideModal('advertise-modal');
    });
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    const firstInput = modal.querySelector('input, textarea');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function handleSubmitPost(e) {
    e.preventDefault();
    
    const title = document.getElementById('post-title-input').value;
    const content = document.getElementById('post-content-input').value;
    const category = document.getElementById('post-category').value;
    
    if (title && content) {
        // Add to submissions
        AppState.newSubmissions.push({
            title,
            content,
            category,
            timestamp: new Date(),
            votes: 0,
            comments: 0,
            author: '@You'
        });
        
        // Show success feedback
        showNotification('Post submitted successfully! 🎉');
        
        // Reset form and close modal
        e.target.reset();
        hideModal('submit-modal');
        
        // Update newest posts
        loadNewestPosts();
    }
}

// Voting System
function setupVoting() {
    const upvoteBtn = document.getElementById('upvote-btn');
    const commentBtn = document.getElementById('comment-btn');

    upvoteBtn.addEventListener('click', function() {
        if (!AppState.isLoggedIn) {
            showNotification('Please sign in to vote', 'error');
            showModal('login-modal');
            return;
        }
        
        const currentCount = parseInt(document.getElementById('upvote-count').textContent);
        const postKey = `${AppState.currentTab}-main`;
        
        if (AppState.userVotes.has(postKey)) {
            // Remove vote
            AppState.userVotes.delete(postKey);
            document.getElementById('upvote-count').textContent = currentCount - 1;
            this.classList.remove('voted');
            this.style.transform = 'scale(0.9)';
        } else {
            // Add vote
            AppState.userVotes.add(postKey);
            document.getElementById('upvote-count').textContent = currentCount + 1;
            this.classList.add('voted');
            this.style.transform = 'scale(1.1)';
            
            // Update user stats
            updateUserStats('vote');
            
            // Celebration effect
            createVoteParticles(this);
        }
        
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });

    commentBtn.addEventListener('click', function() {
        if (!AppState.isLoggedIn) {
            showNotification('Please sign in to comment', 'error');
            showModal('login-modal');
            return;
        }
        
        const commentsSection = document.getElementById('comments-section');
        commentsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Highlight comment form
        const commentInput = document.getElementById('comment-input');
        commentInput.focus();
        commentInput.style.borderColor = '#ff6b6b';
        setTimeout(() => {
            commentInput.style.borderColor = '#4a5568';
        }, 2000);
    });
}

function createVoteParticles(element) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.textContent = '👍';
        particle.style.position = 'absolute';
        particle.style.pointerEvents = 'none';
        particle.style.fontSize = '12px';
        particle.style.zIndex = '1000';
        
        const rect = element.getBoundingClientRect();
        particle.style.left = rect.left + Math.random() * 40 + 'px';
        particle.style.top = rect.top + 'px';
        
        document.body.appendChild(particle);
        
        // Animate particle
        particle.animate([
            { transform: 'translateY(0px) scale(1)', opacity: 1 },
            { transform: 'translateY(-50px) scale(0.5)', opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
}

// Comments System
function setupComments() {
    const postCommentBtn = document.getElementById('post-comment');
    const commentInput = document.getElementById('comment-input');

    postCommentBtn.addEventListener('click', function() {
        const commentText = commentInput.value.trim();
        if (commentText) {
            addComment(commentText);
            commentInput.value = '';
            
            // Update comment count
            const currentCount = parseInt(document.getElementById('comment-count').textContent);
            document.getElementById('comment-count').textContent = currentCount + 1;
            
            // Show feedback
            this.textContent = 'Posted! ✓';
            setTimeout(() => {
                this.textContent = 'Post Comment';
            }, 2000);
        }
    });

    // Enter to submit
    commentInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            postCommentBtn.click();
        }
    });
}

function addComment(text) {
    const comment = {
        id: Date.now(),
        text,
        author: '@You',
        timestamp: new Date()
    };
    
    AppState.comments.push(comment);
    renderComment(comment);
}

function renderComment(comment) {
    const commentsList = document.getElementById('comments-list');
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `
        <div class="comment-author">${comment.author}</div>
        <div class="comment-text">${comment.text}</div>
        <div class="comment-time">${formatTime(comment.timestamp)}</div>
    `;
    
    // Add with animation
    commentElement.style.opacity = '0';
    commentElement.style.transform = 'translateY(20px)';
    commentsList.appendChild(commentElement);
    
    setTimeout(() => {
        commentElement.style.transition = 'all 0.3s ease';
        commentElement.style.opacity = '1';
        commentElement.style.transform = 'translateY(0)';
    }, 10);
}

// Crossword Game
function setupCrossword() {
    const grid = document.getElementById('crossword-grid');
    const resetBtn = document.getElementById('crossword-reset');
    
    // Generate grid
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const cell = document.createElement('div');
            cell.className = 'crossword-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // Pre-fill some cells
            if (CrosswordData.solution[row] && CrosswordData.solution[row][col]) {
                if ((row === 1 && col >= 1 && col <= 4) || (row === 0 && col === 1)) {
                    cell.textContent = CrosswordData.solution[row][col];
                    cell.classList.add('filled');
                }
            }
            
            cell.addEventListener('click', () => selectCrosswordCell(cell));
            grid.appendChild(cell);
        }
    }
    
    resetBtn.addEventListener('click', resetCrossword);
    
    // Keyboard input
    document.addEventListener('keydown', handleCrosswordInput);
}

function selectCrosswordCell(cell) {
    // Remove previous selection
    document.querySelectorAll('.crossword-cell.selected').forEach(c => 
        c.classList.remove('selected')
    );
    
    // Select new cell
    cell.classList.add('selected');
}

function handleCrosswordInput(e) {
    const selectedCell = document.querySelector('.crossword-cell.selected');
    if (!selectedCell) return;
    
    if (e.key.match(/[a-zA-Z]/)) {
        selectedCell.textContent = e.key.toUpperCase();
        selectedCell.classList.add('filled');
        
        // Check if correct
        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);
        const expectedLetter = CrosswordData.solution[row] && CrosswordData.solution[row][col];
        
        if (selectedCell.textContent === expectedLetter) {
            selectedCell.classList.add('correct');
            checkCrosswordCompletion();
        } else {
            selectedCell.classList.remove('correct');
        }
        
        // Move to next cell
        moveToNextCell(selectedCell);
    } else if (e.key === 'Backspace') {
        selectedCell.textContent = '';
        selectedCell.classList.remove('filled', 'correct');
        moveToPreviousCell(selectedCell);
    }
}

function moveToNextCell(currentCell) {
    const cells = Array.from(document.querySelectorAll('.crossword-cell'));
    const currentIndex = cells.indexOf(currentCell);
    const nextCell = cells[currentIndex + 1];
    
    if (nextCell) {
        selectCrosswordCell(nextCell);
    }
}

function moveToPreviousCell(currentCell) {
    const cells = Array.from(document.querySelectorAll('.crossword-cell'));
    const currentIndex = cells.indexOf(currentCell);
    const prevCell = cells[currentIndex - 1];
    
    if (prevCell) {
        selectCrosswordCell(prevCell);
    }
}

function checkCrosswordCompletion() {
    const correctCells = document.querySelectorAll('.crossword-cell.correct');
    if (correctCells.length === 5) { // Total correct letters needed
        showNotification('🎉 Crossword completed! You\'re a puzzle master!');
        
        // Celebration animation
        correctCells.forEach((cell, index) => {
            setTimeout(() => {
                cell.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    cell.style.transform = 'scale(1)';
                }, 200);
            }, index * 100);
        });
    }
}

function resetCrossword() {
    document.querySelectorAll('.crossword-cell').forEach(cell => {
        if (!((cell.dataset.row === '1' && parseInt(cell.dataset.col) >= 1 && parseInt(cell.dataset.col) <= 4) || 
              (cell.dataset.row === '0' && cell.dataset.col === '1'))) {
            cell.textContent = '';
            cell.classList.remove('filled', 'correct', 'selected');
        }
    });
    
    showNotification('Crossword reset! Try again.');
}

// Board Voting
function setupBoardVoting() {
    const voteButtons = document.querySelectorAll('.vote-board-btn');
    
    voteButtons.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const boardItem = this.closest('.board-item');
            const itemKey = `board-${index}`;
            const currentVotes = parseInt(this.textContent);
            
            if (AppState.userBoardVotes.has(itemKey)) {
                // Remove vote
                AppState.userBoardVotes.delete(itemKey);
                this.textContent = currentVotes - 1;
                this.classList.remove('voted');
            } else {
                // Add vote
                AppState.userBoardVotes.add(itemKey);
                this.textContent = currentVotes + 1;
                this.classList.add('voted');
                
                // Celebration effect
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            }
            
            // Update rankings
            updateBoardRankings();
        });
    });
}

function updateBoardRankings() {
    const boardItems = Array.from(document.querySelectorAll('.board-item'));
    
    // Sort by vote count
    boardItems.sort((a, b) => {
        const aVotes = parseInt(a.querySelector('.board-votes').textContent);
        const bVotes = parseInt(b.querySelector('.board-votes').textContent);
        return bVotes - aVotes;
    });
    
    // Update rankings
    boardItems.forEach((item, index) => {
        const numberElement = item.querySelector('.board-number');
        numberElement.textContent = `#${index + 1}`;
        
        // Highlight changes
        if (numberElement.textContent !== numberElement.dataset.oldNumber) {
            item.style.background = 'rgba(255, 107, 107, 0.1)';
            setTimeout(() => {
                item.style.background = 'transparent';
            }, 1000);
        }
        
        numberElement.dataset.oldNumber = numberElement.textContent;
    });
}

// Sidebar Interactions
function setupSidebarInteractions() {
    const sidebarPosts = document.querySelectorAll('.sidebar-post');
    
    sidebarPosts.forEach(post => {
        post.addEventListener('click', function() {
            // Highlight clicked post
            document.querySelectorAll('.sidebar-post').forEach(p => 
                p.style.background = 'transparent'
            );
            this.style.background = 'rgba(255, 107, 107, 0.1)';
            
            // Simulate loading
            const title = this.querySelector('.sidebar-title').textContent;
            showNotification(`Loading: ${title.substring(0, 30)}...`);
            
            // Update main content with clicked post
            setTimeout(() => {
                updateMainContentFromSidebar(this);
            }, 500);
        });
        
        // Vote interactions
        const voteCount = post.querySelector('.vote-count');
        const commentCount = post.querySelector('.comment-count');
        
        voteCount.addEventListener('click', function(e) {
            e.stopPropagation();
            const current = parseInt(this.textContent);
            const postKey = post.dataset.post;
            
            if (AppState.userVotes.has(postKey)) {
                AppState.userVotes.delete(postKey);
                this.textContent = current - 1;
                this.style.color = '#718096';
            } else {
                AppState.userVotes.add(postKey);
                this.textContent = current + 1;
                this.style.color = '#ff6b6b';
            }
        });
    });
}

function updateMainContentFromSidebar(postElement) {
    const title = postElement.querySelector('.sidebar-title').textContent;
    const author = postElement.querySelector('.username').textContent;
    const votes = postElement.querySelector('.vote-count').textContent;
    const comments = postElement.querySelector('.comment-count').textContent;
    
    document.getElementById('post-title').textContent = title;
    document.getElementById('post-description').textContent = 'Click to read the full story and join the discussion with fellow entrepreneurs.';
    document.getElementById('featured-image').textContent = title.substring(0, 50) + '...';
    document.getElementById('upvote-count').textContent = votes;
    document.getElementById('comment-count').textContent = comments;
    document.querySelector('.username').textContent = author;
    
    // Scroll to main content
    document.getElementById('featured-post').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
}

// Newest Posts
function loadNewestPosts() {
    const newestContainer = document.getElementById('newest-posts');
    const samplePosts = [
        'How I automated my entire sales funnel',
        'Building a Chrome extension in 48 hours',
        'From developer to founder: my journey',
        'Why I chose Supabase over Firebase',
        'Launching on Product Hunt: lessons learned'
    ];
    
    // Combine sample posts with user submissions
    const allPosts = [...AppState.newSubmissions.map(s => s.title), ...samplePosts];
    
    newestContainer.innerHTML = allPosts.slice(0, 8).map(post => 
        `<div class="newest-post">${post}</div>`
    ).join('');
    
    // Add click handlers
    newestContainer.querySelectorAll('.newest-post').forEach(post => {
        post.addEventListener('click', function() {
            showNotification(`Loading: ${this.textContent}...`);
        });
    });
}

// Scroll Effects
function setupScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.header');
        
        // Header shadow on scroll
        if (scrolled > 10) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        // Parallax effect on featured image
        const featuredImage = document.getElementById('featured-image');
        if (featuredImage) {
            const offset = scrolled * 0.1;
            featuredImage.style.transform = `translateY(${offset}px)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Authentication System
function setupAuthentication() {
    const signInBtn = document.getElementById('sign-in-btn');
    const joinBtn = document.getElementById('join-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const profileForm = document.getElementById('profile-form');
    const logoutBtn = document.getElementById('logout-btn');
    const userAvatar = document.getElementById('user-avatar');
    const profileLink = document.getElementById('profile-link');
    
    // Show login/signup modals
    signInBtn?.addEventListener('click', () => showModal('login-modal'));
    joinBtn?.addEventListener('click', () => showModal('signup-modal'));
    
    // Switch between login and signup
    document.getElementById('show-signup')?.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('login-modal');
        showModal('signup-modal');
    });
    
    document.getElementById('show-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('signup-modal');
        showModal('login-modal');
    });
    
    // User menu dropdown
    userAvatar?.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = document.getElementById('dropdown-menu');
        dropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        const dropdown = document.getElementById('dropdown-menu');
        dropdown?.classList.remove('show');
    });
    
    // Profile modal
    profileLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showModal('profile-modal');
        loadUserProfile();
    });
    
    // Form submissions
    loginForm?.addEventListener('submit', handleLogin);
    signupForm?.addEventListener('submit', handleSignup);
    profileForm?.addEventListener('submit', handleProfileUpdate);
    logoutBtn?.addEventListener('click', handleLogout);
    
    // Google auth buttons (demo)
    document.getElementById('google-login')?.addEventListener('click', handleGoogleAuth);
    document.getElementById('google-signup')?.addEventListener('click', handleGoogleAuth);
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Simulate login validation
    if (email && password) {
        if (password.length < 6) {
            showNotification('Password must be at least 6 characters', 'error');
            return;
        }
        
        // Create user object
        const user = {
            id: generateUserId(),
            email: email,
            name: email.split('@')[0],
            avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`,
            joinDate: new Date(),
            posts: 0,
            votes: 0,
            comments: 0,
            bio: '',
            website: '',
            location: ''
        };
        
        loginUser(user, rememberMe);
        hideModal('login-modal');
        showNotification('Welcome back! 🎉');
        
        // Reset form
        e.target.reset();
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    const agreeTerms = document.getElementById('terms-agree').checked;
    
    // Validation
    if (!agreeTerms) {
        showNotification('Please agree to the terms of service', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (name && email && password) {
        // Create new user
        const user = {
            id: generateUserId(),
            email: email,
            name: name,
            avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`,
            joinDate: new Date(),
            posts: 0,
            votes: 0,
            comments: 0,
            bio: '',
            website: '',
            location: ''
        };
        
        loginUser(user, true);
        hideModal('signup-modal');
        showNotification('Account created successfully! Welcome to Builder Hub! 🎉');
        
        // Reset form
        e.target.reset();
    }
}

function handleGoogleAuth() {
    // Simulate Google OAuth
    const user = {
        id: generateUserId(),
        email: 'user@gmail.com',
        name: 'Google User',
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`,
        joinDate: new Date(),
        posts: 0,
        votes: 0,
        comments: 0,
        bio: 'Joined with Google',
        website: '',
        location: ''
    };
    
    loginUser(user, true);
    hideModal('login-modal');
    hideModal('signup-modal');
    showNotification('Signed in with Google! 🎉');
}

function handleProfileUpdate(e) {
    e.preventDefault();
    
    if (!AppState.isLoggedIn) return;
    
    const name = document.getElementById('profile-name').value;
    const email = document.getElementById('profile-email').value;
    const bio = document.getElementById('profile-bio').value;
    const website = document.getElementById('profile-website').value;
    const location = document.getElementById('profile-location').value;
    
    // Update user data
    AppState.user = {
        ...AppState.user,
        name,
        email,
        bio,
        website,
        location
    };
    
    // Save to localStorage
    localStorage.setItem('builderHub_user', JSON.stringify(AppState.user));
    
    // Update UI
    document.getElementById('user-name').textContent = name;
    
    hideModal('profile-modal');
    showNotification('Profile updated successfully! ✅');
}

function handleLogout() {
    AppState.user = null;
    AppState.isLoggedIn = false;
    
    // Clear localStorage
    localStorage.removeItem('builderHub_user');
    localStorage.removeItem('builderHub_rememberMe');
    
    // Update UI
    updateAuthUI();
    
    showNotification('Logged out successfully! 👋');
}

function loginUser(user, rememberMe) {
    AppState.user = user;
    AppState.isLoggedIn = true;
    
    // Save to localStorage
    if (rememberMe) {
        localStorage.setItem('builderHub_user', JSON.stringify(user));
        localStorage.setItem('builderHub_rememberMe', 'true');
    } else {
        sessionStorage.setItem('builderHub_user', JSON.stringify(user));
    }
    
    // Update UI
    updateAuthUI();
}

function checkAuthState() {
    // Check localStorage first (remember me)
    const savedUser = localStorage.getItem('builderHub_user');
    const rememberMe = localStorage.getItem('builderHub_rememberMe');
    
    if (savedUser && rememberMe) {
        AppState.user = JSON.parse(savedUser);
        AppState.isLoggedIn = true;
        updateAuthUI();
        return;
    }
    
    // Check sessionStorage (current session)
    const sessionUser = sessionStorage.getItem('builderHub_user');
    if (sessionUser) {
        AppState.user = JSON.parse(sessionUser);
        AppState.isLoggedIn = true;
        updateAuthUI();
        return;
    }
    
    // No saved user, show login buttons
    updateAuthUI();
}

function updateAuthUI() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const userNameElement = document.getElementById('user-name');
    const userAvatarImg = document.querySelector('#user-avatar .avatar-img');
    
    if (AppState.isLoggedIn && AppState.user) {
        // Hide auth buttons, show user menu
        authButtons.style.display = 'none';
        userMenu.style.display = 'block';
        
        // Update user info
        userNameElement.textContent = AppState.user.name;
        if (userAvatarImg) {
            userAvatarImg.src = AppState.user.avatar;
            userAvatarImg.alt = AppState.user.name;
        }
        
        // Update welcome banner for logged in users
        updateWelcomeBannerForUser();
        
    } else {
        // Show auth buttons, hide user menu
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

function updateWelcomeBannerForUser() {
    if (!AppState.isLoggedIn || !AppState.user) return;
    
    const welcomeText = document.querySelector('.welcome-text');
    if (welcomeText) {
        welcomeText.innerHTML = `Welcome back, <strong>${AppState.user.name}</strong>! 👋 Ready to share your latest project?`;
    }
}

function loadUserProfile() {
    if (!AppState.isLoggedIn || !AppState.user) return;
    
    const user = AppState.user;
    
    // Populate form fields
    document.getElementById('profile-name').value = user.name || '';
    document.getElementById('profile-email').value = user.email || '';
    document.getElementById('profile-bio').value = user.bio || '';
    document.getElementById('profile-website').value = user.website || '';
    document.getElementById('profile-location').value = user.location || '';
    
    // Update profile image
    document.getElementById('profile-img').src = user.avatar;
    
    // Update stats
    document.getElementById('user-posts').textContent = user.posts || 0;
    document.getElementById('user-votes').textContent = user.votes || 0;
    document.getElementById('user-comments').textContent = user.comments || 0;
}

function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function updateUserStats(type) {
    if (!AppState.isLoggedIn || !AppState.user) return;
    
    switch(type) {
        case 'post':
            AppState.user.posts++;
            break;
        case 'vote':
            AppState.user.votes++;
            break;
        case 'comment':
            AppState.user.comments++;
            break;
    }
    
    // Save updated user data
    if (localStorage.getItem('builderHub_user')) {
        localStorage.setItem('builderHub_user', JSON.stringify(AppState.user));
    } else {
        sessionStorage.setItem('builderHub_user', JSON.stringify(AppState.user));
    }
}

// Update existing functions to work with authentication
function addComment(text) {
    if (!AppState.isLoggedIn) {
        showNotification('Please sign in to comment', 'error');
        showModal('login-modal');
        return;
    }
    
    const comment = {
        id: Date.now(),
        text,
        author: '@' + AppState.user.name,
        timestamp: new Date()
    };
    
    AppState.comments.push(comment);
    renderComment(comment);
    updateUserStats('comment');
}

function handleSubmitPost(e) {
    e.preventDefault();
    
    if (!AppState.isLoggedIn) {
        showNotification('Please sign in to submit a post', 'error');
        hideModal('submit-modal');
        showModal('login-modal');
        return;
    }
    
    const title = document.getElementById('post-title-input').value;
    const content = document.getElementById('post-content-input').value;
    const category = document.getElementById('post-category').value;
    
    if (title && content) {
        // Add to submissions
        AppState.newSubmissions.push({
            title,
            content,
            category,
            timestamp: new Date(),
            votes: 0,
            comments: 0,
            author: '@' + AppState.user.name
        });
        
        // Update user stats
        updateUserStats('post');
        
        // Show success feedback
        showNotification('Post submitted successfully! 🎉');
        
        // Reset form and close modal
        e.target.reset();
        hideModal('submit-modal');
        
        // Update newest posts
        loadNewestPosts();
    }
}
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

// Utility Functions
function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    
    const bgColor = type === 'error' ? '#e53e3e' : '#ff6b6b';
    const icon = type === 'error' ? '❌' : '✅';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 1001;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    // Add icon
    notification.textContent = `${icon} ${message}`;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto-remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, type === 'error' ? 4000 : 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Esc to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => {
            hideModal(modal.id);
        });
    }
    
    // Number keys for tab switching
    if (e.key >= '1' && e.key <= '7' && !e.ctrlKey && !e.altKey) {
        const tabs = ['starting-up', 'tech', 'ai', 'builder-hub', 'creators', 'lifestyle', 'money'];
        const tabIndex = parseInt(e.key) - 1;
        if (tabs[tabIndex]) {
            switchTab(tabs[tabIndex]);
        }
    }
});

// Export for debugging (optional)
window.AppState = AppState;
window.switchTab = switchTab;