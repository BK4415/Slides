/**
 * Home Page Logic
 * Handles navigation, configuration, and game start
 */

class HomePage {
    constructor() {
        this.init();
    }

    init() {
        Preview.init();
        this.setupEventListeners();
        this.updateResumeSection();
        this.setupPanels();
    }

    setupEventListeners() {
        // Start button
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }

        // Resume button
        const resumeBtn = document.getElementById('resumeBtn');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => this.resumeGame());
        }

        // Upload button
        const uploadBtn = document.getElementById('uploadImageBtn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => this.openUploadModal());
        }

        // Upload modal
        const uploadModal = document.getElementById('uploadModal');
        if (uploadModal) {
            const closeBtn = uploadModal.querySelector('.modal-close');
            const uploadArea = uploadModal.querySelector('.upload-area');
            const fileInput = document.getElementById('fileInput');

            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    uploadModal.style.display = 'none';
                    document.getElementById('overlay').classList.remove('active');
                });
            }

            if (uploadArea) {
                uploadArea.addEventListener('click', () => fileInput.click());
                uploadArea.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    uploadArea.style.borderColor = 'var(--accent-gold)';
                });
                uploadArea.addEventListener('dragleave', () => {
                    uploadArea.style.borderColor = 'rgba(210,166,121,0.3)';
                });
                uploadArea.addEventListener('drop', (e) => {
                    e.preventDefault();
                    uploadArea.style.borderColor = 'rgba(210,166,121,0.3)';
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                        this.handleImageUpload(files[0]);
                    }
                });
            }

            if (fileInput) {
                fileInput.addEventListener('change', (e) => {
                    if (e.target.files.length > 0) {
                        this.handleImageUpload(e.target.files[0]);
                    }
                });
            }
        }
    }

    setupPanels() {
        // Info panel
        const infoPanelBtn = document.querySelector('.info-btn');
        const infoPanel = document.getElementById('infoPanel');
        const infoPanelClose = infoPanel?.querySelector('.panel-close');
        const overlay = document.getElementById('overlay');

        if (infoPanelBtn) {
            infoPanelBtn.addEventListener('click', () => {
                infoPanel.classList.add('active');
                overlay.classList.add('active');
            });
        }

        if (infoPanelClose) {
            infoPanelClose.addEventListener('click', () => {
                infoPanel.classList.remove('active');
                overlay.classList.remove('active');
            });
        }

        // Dashboard panel
        const dashboardPanelBtn = document.querySelector('.dashboard-btn');
        const dashboardPanel = document.getElementById('dashboardPanel');
        const dashboardPanelClose = dashboardPanel?.querySelector('.panel-close');

        if (dashboardPanelBtn) {
            dashboardPanelBtn.addEventListener('click', () => {
                this.updateDashboard();
                dashboardPanel.classList.add('active');
                overlay.classList.add('active');
            });
        }

        if (dashboardPanelClose) {
            dashboardPanelClose.addEventListener('click', () => {
                dashboardPanel.classList.remove('active');
                overlay.classList.remove('active');
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => {
                infoPanel.classList.remove('active');
                dashboardPanel.classList.remove('active');
                overlay.classList.remove('active');
            });
        }

        // Panel navigation
        const panelNavBtns = document.querySelectorAll('.panel-nav-btn');
        panelNavBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                this.switchPanelSection(section);
                
                panelNavBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Swipe support for panels
        this.setupSwipeNavigation();
    }

    setupSwipeNavigation() {
        const phoneFrame = document.querySelector('.phone-frame');
        let startX = 0;

        phoneFrame.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        phoneFrame.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                const infoPanel = document.getElementById('infoPanel');
                const dashboardPanel = document.getElementById('dashboardPanel');
                const overlay = document.getElementById('overlay');

                if (diff > 0) {
                    // Swipe left - open dashboard
                    infoPanel.classList.remove('active');
                    dashboardPanel.classList.add('active');
                    overlay.classList.add('active');
                } else {
                    // Swipe right - open info
                    infoPanel.classList.add('active');
                    dashboardPanel.classList.remove('active');
                    overlay.classList.add('active');
                }
            }
        });
    }

    switchPanelSection(sectionName) {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.dataset.section === sectionName) {
                section.classList.add('active');
            }
        });
    }

    updateResumeSection() {
        const resumeSection = document.getElementById('resumeSection');
        const resumeInfo = document.getElementById('resumeInfo');
        const session = Storage.getGameSession();

        if (session && session.boardSize && session.mode) {
            resumeSection.style.display = 'block';
            const style = session.photoMode ? 'Photo' : 'Number';
            const time = this.formatTime(session.elapsedTime);
            resumeInfo.innerHTML = `
                <strong>Last Game:</strong> ${style} • ${session.boardSize}×${session.boardSize} • ${session.mode}<br>
                <strong>Progress:</strong> ${time} • ${session.moves} moves
            `;
        } else {
            resumeSection.style.display = 'none';
        }
    }

    updateDashboard() {
        const stats = Storage.getStats();
        const achievements = Storage.getAchievements();

        // Update stats
        document.getElementById('gamesPlayed').textContent = stats.gamesPlayed || 0;
        
        const completed = stats.gamesCompleted || 0;
        const played = stats.gamesPlayed || 1;
        const percent = Math.round((completed / played) * 100) || 0;
        document.getElementById('completionPercent').textContent = percent + '%';

        document.getElementById('bestTime').textContent = stats.bestTime === Infinity ? '--:--' : this.formatTime(stats.bestTime);
        document.getElementById('bestMoves').textContent = stats.bestMoves === Infinity ? '-' : stats.bestMoves;

        document.getElementById('currentStreak').textContent = stats.currentStreak || 0;
        document.getElementById('bestStreak').textContent = stats.bestStreak || 0;

        document.getElementById('favStyle').textContent = stats.favouriteStyle || 'Number';
        document.getElementById('favSize').textContent = (stats.favouriteSize || 4) + '×' + (stats.favouriteSize || 4);
        document.getElementById('favMode').textContent = stats.favouriteMode || 'Classic';

        // Achievements
        this.updateAchievementGrid(achievements);

        // Reset button
        const resetBtn = document.getElementById('resetDataBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                    Storage.resetAllData();
                    this.updateDashboard();
                    this.updateResumeSection();
                }
            });
        }
    }

    updateAchievementGrid(achievements) {
        const achievementDefs = {
            firstWin: { emoji: '🎮', name: 'First Win' },
            tenWins: { emoji: '🔟', name: '10 Wins' },
            speedDemon: { emoji: '⚡', name: 'Speed Demon' },
            minimalist: { emoji: '🎯', name: 'Minimalist' },
            perfectScore: { emoji: '⭐', name: 'Perfect' },
            consecutiveWins: { emoji: '🔥', name: 'On Fire' },
            photoMaster: { emoji: '🖼️', name: 'Photo Master' },
            largeBoard: { emoji: '📦', name: 'Big Brain' },
            customImage: { emoji: '📷', name: 'Custom' },
            allModes: { emoji: '🎪', name: 'All Modes' }
        };

        const grid = document.getElementById('achievementGrid');
        if (!grid) return;
        grid.innerHTML = '';

        for (const [id, def] of Object.entries(achievementDefs)) {
            const badge = document.createElement('div');
            badge.className = 'achievement-badge';
            if (achievements[id]) badge.classList.add('unlocked');
            badge.textContent = def.emoji;
            badge.title = def.name;
            grid.appendChild(badge);
        }
    }

    async handleImageUpload(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;
            Storage.saveCustomImage(imageData);
            
            document.getElementById('uploadModal').style.display = 'none';
            document.getElementById('overlay').classList.remove('active');
            
            // Update preview
            Preview.render();
        };
        reader.readAsDataURL(file);
    }

    openUploadModal() {
        document.getElementById('uploadModal').style.display = 'flex';
        document.getElementById('overlay').classList.add('active');
    }

    startGame() {
        const state = Preview.getState();
        const session = {
            boardSize: state.size,
            mode: state.mode,
            photoMode: state.style === 'Photo',
            photoRef: state.style === 'Photo' ? Preview.getPhotoRef() : null,
            startTime: Date.now(),
            elapsedTime: 0,
            moves: 0
        };

        Storage.saveGameSession(session);
        window.location.href = 'game.html';
    }

    resumeGame() {
        window.location.href = 'game.html';
    }

    formatTime(ms) {
        if (!ms) return '00:00';
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});
