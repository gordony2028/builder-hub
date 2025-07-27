// Global Application State
const AppState = {
    currentUser: null,
    currentTab: 'feed',
    posts: [],
    projects: [],
    discussions: [],
    resources: [],
    jobs: []
};

// Sample data to start with
const SAMPLE_DATA = {
    posts: [
        {
            id: 1,
            title: "Just launched my first SaaS product!",
            content: "After 6 months of development, I finally launched my project management tool. Looking for feedback!",
            author: "Sarah Chen",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=40&h=40&fit=crop&crop=face",
            category: "achievement",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            likes: 12,
            comments: 5
        },
        {
            id: 2,
            title: "Need advice on scaling my team",
            content: "My startup is growing and I need to hire my first developer. Any tips on what to look for?",
            author: "Mike Rodriguez",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
            category: "question",
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            likes: 8,
            comments: 12
        }
    ],
    projects: [
        {
            id: 1,
            name: "TaskFlow - Project Management",
            description: "A simple, intuitive project management tool for small teams",
            author: "Sarah Chen",
            status: "completed",
            url: "https://taskflow.example.com",
            github: "https://github.com/sarahchen/taskflow",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        {
            id: 2,
            name: "AI Code Assistant",
            description: "VSCode extension that helps developers write better code using AI",
            author: "Alex Kim",
            status: "in-progress",
            github: "https://github.com/alexkim/ai-assistant",
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000)
        }
    ],
    discussions: [
        {
            id: 1,
            title: "Best practices for user onboarding?",
            content: "I'm working on improving the onboarding flow for my app. What are some proven strategies?",
            author: "Emily Watson",
            category: "general",
            replies: 8,
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
        },
        {
            id: 2,
            title: "React vs Vue for new projects in 2025?",
            content: "Starting a new project and debating between React and Vue. What are your thoughts?",
            author: "David Park",
            category: "technical",
            replies: 15,
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
        }
    ]
};

// Initialize app when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadSampleData();
    setupEventListeners();
    checkAuthState();
    loadCurrentTab();
}

// Load sample data if no data exists
function loadSampleData() {
    const savedPosts = getFromStorage('posts');
    const savedProjects = getFromStorage('projects');
    const savedDiscussions = getFromStorage('discussions');

    AppState.posts = savedPosts || SAMPLE_DATA.posts;
    AppState.projects = savedProjects || SAMPLE_DATA.projects;
    AppState.discussions = savedDiscussions || SAMPLE_DATA.discussions;
    AppState.resources = getFromStorage('resources') || [];
    AppState.jobs = getFromStorage('jobs') || [];

    saveToStorage('posts', AppState.posts);
    saveToStorage('projects', AppState.projects);
    saveToStorage('discussions', AppState.discussions);
}

// Set up all event listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });

    // Auth buttons
    document.getElementById('login-btn').addEventListener('click', () => showModal('login-modal'));
    document.getElementById('signup-btn').addEventListener('click', () => showModal('signup-modal'));
    document.getElementById('logout-link').addEventListener('click', logout);

    // Modal switches
    document.getElementById('switch-to-signup').addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('login-modal');
        showModal('signup-modal');
    });

    document.getElementById('switch-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('signup-modal');
        showModal('login-modal');
    });

    // Content action buttons
    document.getElementById('new-post-btn').addEventListener('click', () => {
        if (requireAuth()) showModal('post-modal');
    });
    
    document.getElementById('add-project-btn').addEventListener('click', () => {
        if (requireAuth()) showModal('project-modal');
    });
    
    document.getElementById('new-discussion-btn').addEventListener('click', () => {
        if (requireAuth()) showModal('discussion-modal');
    });

    // Forms
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    document.getElementById('post-form').addEventListener('submit', handleNewPost);
    document.getElementById('project-form').addEventListener('submit', handleNewProject);
    document.getElementById('discussion-form').addEventListener('submit', handleNewDiscussion);

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = e.target.dataset.modal;
            hideModal(modalId);
        });
    });

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal.id);
            }
        });
    });

    // User menu dropdown
    document.getElementById('user-section').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    document.addEventListener('click', () => {
        hideDropdown();
    });
}

// Tab Management
function switchTab(tabName) {
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });

    // Show appropriate panel
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    document.getElementById(`${tabName}-panel`).classList.add('active');
    
    // Load content for the tab
    loadTabContent(tabName);
    AppState.currentTab = tabName;
}

function loadTabContent(tabName) {
    switch(tabName) {
        case 'feed':
            renderPosts();
            break;
        case 'projects':
            renderProjects();
            break;
        case 'discussions':
            renderDiscussions();
            break;
        case 'resources':
            renderResources();
            break;
        case 'jobs':
            renderJobs();
            break;
    }
}

function loadCurrentTab() {
    loadTabContent(AppState.currentTab);
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Simple authentication (in real app, this would call an API)
    const user = {
        id: generateId(),
        name: email.split('@')[0],
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=4299e1&color=fff`
    };

    loginUser(user);
    hideModal('login-modal');
    showNotification('Welcome back!');
    
    // Reset form
    document.getElementById('login-form').reset();
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;

    if (!name || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
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

    const user = {
        id: generateId(),
        name: name,
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4299e1&color=fff`
    };

    loginUser(user);
    hideModal('signup-modal');
    showNotification('Account created successfully! Welcome to Builder Hub!');
    
    // Reset form
    document.getElementById('signup-form').reset();
}

function loginUser(user) {
    AppState.currentUser = user;
    updateAuthUI();
    saveToStorage('currentUser', user);
}

function logout() {
    AppState.currentUser = null;
    updateAuthUI();
    removeFromStorage('currentUser');
    showNotification('Logged out successfully');
    hideDropdown();
}

function checkAuthState() {
    const savedUser = getFromStorage('currentUser');
    if (savedUser) {
        AppState.currentUser = savedUser;
        updateAuthUI();
    }
}

function updateAuthUI() {
    const authSection = document.getElementById('auth-section');
    const userSection = document.getElementById('user-section');
    
    if (AppState.currentUser) {
        authSection.style.display = 'none';
        userSection.style.display = 'block';
        
        document.getElementById('user-name').textContent = AppState.currentUser.name;
        document.getElementById('user-avatar').src = AppState.currentUser.avatar;
    } else {
        authSection.style.display = 'flex';
        userSection.style.display = 'none';
    }
}

function requireAuth() {
    if (!AppState.currentUser) {
        showNotification('Please log in to continue', 'error');
        showModal('login-modal');
        return false;
    }
    return true;
}

// Content Handlers
function handleNewPost(e) {
    e.preventDefault();
    
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const category = document.getElementById('post-category').value;

    if (!title) {
        showNotification('Please enter a title', 'error');
        return;
    }

    const post = {
        id: generateId(),
        title,
        content,
        author: AppState.currentUser.name,
        avatar: AppState.currentUser.avatar,
        category,
        timestamp: new Date(),
        likes: 0,
        comments: 0
    };

    AppState.posts.unshift(post);
    saveToStorage('posts', AppState.posts);
    renderPosts();
    hideModal('post-modal');
    showNotification('Post created successfully!');
    
    // Reset form
    document.getElementById('post-form').reset();
}

function handleNewProject(e) {
    e.preventDefault();
    
    const name = document.getElementById('project-name').value;
    const description = document.getElementById('project-description').value;
    const url = document.getElementById('project-url').value;
    const github = document.getElementById('project-github').value;
    const status = document.getElementById('project-status').value;

    if (!name || !description) {
        showNotification('Please fill in required fields', 'error');
        return;
    }

    const project = {
        id: generateId(),
        name,
        description,
        author: AppState.currentUser.name,
        status,
        url,
        github,
        timestamp: new Date()
    };

    AppState.projects.unshift(project);
    saveToStorage('projects', AppState.projects);
    renderProjects();
    hideModal('project-modal');
    showNotification('Project added successfully!');
    
    // Reset form
    document.getElementById('project-form').reset();
}

function handleNewDiscussion(e) {
    e.preventDefault();
    
    const title = document.getElementById('discussion-title').value;
    const content = document.getElementById('discussion-content').value;
    const category = document.getElementById('discussion-category').value;

    if (!title || !content) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    const discussion = {
        id: generateId(),
        title,
        content,
        author: AppState.currentUser.name,
        category,
        replies: 0,
        timestamp: new Date()
    };

    AppState.discussions.unshift(discussion);
    saveToStorage('discussions', AppState.discussions);
    renderDiscussions();
    hideModal('discussion-modal');
    showNotification('Discussion started successfully!');
    
    // Reset form
    document.getElementById('discussion-form').reset();
}

// Rendering Functions
function renderPosts() {
    const container = document.getElementById('posts-list');
    
    if (AppState.posts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No posts yet</h3>
                <p>Be the first to share an update!</p>
                <button class="btn btn-primary" onclick="document.getElementById('new-post-btn').click()">Create First Post</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = AppState.posts.map(post => `
        <div class="post-card" data-id="${post.id}">
            <div class="post-header">
                <img src="${post.avatar}" alt="${post.author}" class="post-author-avatar">
                <div class="post-author-info">
                    <h4>${post.author}</h4>
                    <span class="post-time">${formatTime(post.timestamp)}</span>
                </div>
            </div>
            <div class="post-content">
                <span class="post-category">${post.category}</span>
                <h3>${post.title}</h3>
                ${post.content ? `<p>${post.content}</p>` : ''}
            </div>
            <div class="post-actions">
                <span class="post-action" onclick="likePost(${post.id})">
                    ❤️ ${post.likes} likes
                </span>
                <span class="post-action">
                    💬 ${post.comments} comments
                </span>
            </div>
        </div>
    `).join('');
}

function renderProjects() {
    const container = document.getElementById('projects-grid');
    
    if (AppState.projects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No projects yet</h3>
                <p>Share your awesome projects with the community!</p>
                <button class="btn btn-primary" onclick="document.getElementById('add-project-btn').click()">Add First Project</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = AppState.projects.map(project => `
        <div class="project-card" data-id="${project.id}">
            <div class="project-header">
                <h3 class="project-title">${project.name}</h3>
                <span class="project-status ${project.status}">${formatStatus(project.status)}</span>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-links">
                ${project.url ? `<a href="${project.url}" target="_blank" class="project-link">🌐 Live Demo</a>` : ''}
                ${project.github ? `<a href="${project.github}" target="_blank" class="project-link">📱 GitHub</a>` : ''}
            </div>
            <div class="project-meta">
                <small>by ${project.author} • ${formatTime(project.timestamp)}</small>
            </div>
        </div>
    `).join('');
}

function renderDiscussions() {
    const container = document.getElementById('discussions-list');
    
    if (AppState.discussions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No discussions yet</h3>
                <p>Start a conversation with the community!</p>
                <button class="btn btn-primary" onclick="document.getElementById('new-discussion-btn').click()">Start First Discussion</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = AppState.discussions.map(discussion => `
        <div class="discussion-card" data-id="${discussion.id}">
            <h3 class="discussion-title">${discussion.title}</h3>
            <p class="discussion-excerpt">${discussion.content}</p>
            <div class="discussion-meta">
                <span>${discussion.author} • ${formatTime(discussion.timestamp)}</span>
                <span>${discussion.replies} replies</span>
            </div>
        </div>
    `).join('');
}

function renderResources() {
    const container = document.getElementById('resources-grid');
    container.innerHTML = `
        <div class="empty-state">
            <h3>Resources coming soon</h3>
            <p>We're curating the best learning resources for builders!</p>
        </div>
    `;
}

function renderJobs() {
    const container = document.getElementById('jobs-list');
    container.innerHTML = `
        <div class="empty-state">
            <h3>Job board launching soon</h3>
            <p>Connect with opportunities in the builder community!</p>
        </div>
    `;
}

// Interactive Functions
function likePost(postId) {
    if (!requireAuth()) return;
    
    const post = AppState.posts.find(p => p.id === postId);
    if (post) {
        post.likes += 1;
        saveToStorage('posts', AppState.posts);
        renderPosts();
        showNotification('Post liked!');
    }
}

// Modal Management
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Dropdown Management
function toggleDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    dropdown.classList.toggle('show');
}

function hideDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    dropdown.classList.remove('show');
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Utility Functions
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

function formatTime(date) {
    const now = new Date();
    const diff = Math.abs(now - new Date(date));
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

function formatStatus(status) {
    return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Storage Functions
function saveToStorage(key, data) {
    try {
        localStorage.setItem(`builderHub_${key}`, JSON.stringify(data));
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
}

function getFromStorage(key) {
    try {
        const data = localStorage.getItem(`builderHub_${key}`);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.warn('Could not read from localStorage:', e);
        return null;
    }
}

function removeFromStorage(key) {
    try {
        localStorage.removeItem(`builderHub_${key}`);
    } catch (e) {
        console.warn('Could not remove from localStorage:', e);
    }
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Esc to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => {
            hideModal(modal.id);
        });
        hideDropdown();
    }
    
    // Ctrl/Cmd + Enter to submit forms
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeModal = document.querySelector('.modal.show');
        if (activeModal) {
            const submitBtn = activeModal.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.click();
        }
    }
});

// Export for debugging (optional)
window.AppState = AppState;
window.switchTab = switchTab;