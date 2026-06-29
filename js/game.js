/**
 * Game Page Logic
 * Main gameplay controller, timer, scoring, and UI updates
 */

class GamePage {
    constructor() {
        this.engine = null;
        this.session = Storage.getGameSession();
        this.timerInterval = null;
        this.gameStarted = false;
        this.gamePaused = false;
        this.soundEnabled = true;
        this.vibrationEnabled = true;
        this.tilesNumbersVisible = true;

        if (!this.session) {
            window.location.href = 'index.html';
            return;
        }

        this.init();
    }

    init() {
        this.loadPreferences();
        this.setupBoard();
        this.setupEventListeners();
        this.updateHUD();
        this.ensureFirstMoveTrigger();
    }

    loadPreferences() {
        const prefs = Storage.getPreferences();
        this.soundEnabled = prefs.soundEnabled !== false;
        this.vibrationEnabled = prefs.vibrationEnabled !== false;
        this.tilesNumbersVisible = prefs.tilesNumbersVisible !== false;
    }

    setupBoard() {
        const gameBoard = document.getElementById('gameBoard');
        this.engine = new SlidingEngine(gameBoard);
        
        this.engine.init(this.session.boardSize, this.session.mode || 'Classic');
        
        if (this.session.photoMode) {
            this.loadPhotoMode();
        }

        this.engine.shuffle();
    }

    loadPhotoMode() {
        const customImage = Storage.getCustomImage();
        const photoRef = this.session.photoRef || 'photo1';
        const imageSource = customImage || `assets/images/photos/${photoRef}.jpg`;

        this.engine.tiles.forEach((tile, idx) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = this.engine.tileSize;
            canvas.height = this.engine.tileSize;

            const img = new Image();
            img.onload = () => {
                const size = this.engine.size;
                const tileW = img.width / size;
                const tileH = img.height / size;

                const col = tile.x;
                const row = tile.y;

                ctx.drawImage(img, col * tileW, row * tileH, tileW, tileH, 0, 0, canvas.width, canvas.height);
                
                tile.el.innerHTML = '';
                const imgEl = new Image();
                imgEl.src = canvas.toDataURL();
                imgEl.className = 'tile-image';
                tile.el.appendChild(imgEl);

                if (this.tilesNumbersVisible) {
                    const numberOverlay = document.createElement('div');
                    numberOverlay.className = 'tile-number-overlay visible';
                    numberOverlay.textContent = tile.number;
                    tile.el.appendChild(numberOverlay);
                }
            };
            img.src = imageSource;
            img.crossOrigin = 'anonymous';
        });

        // Setup toggle button
        const toggleBtn = document.getElementById('tileNumbersToggle');
        if (toggleBtn) {
            toggleBtn.style.display = 'flex';
            toggleBtn.addEventListener('click', () => this.toggleTileNumbers());
        }
    }

    toggleTileNumbers() {
        this.tilesNumbersVisible = !this.tilesNumbersVisible;
        Storage.updatePreferences({ tilesNumbersVisible: this.tilesNumbersVisible });

        this.engine.tiles.forEach(tile => {
            const overlay = tile.el.querySelector('.tile-number-overlay');
            if (overlay) {
                overlay.classList.toggle('visible');
            }
        });
    }

    ensureFirstMoveTrigger() {
        // Override engine move completion to start timer on first move
        const originalCompleteMove = this.engine.completeMove.bind(this.engine);
        this.engine.completeMove = () => {
            originalCompleteMove();
            
            if (!this.gameStarted) {
                this.gameStarted = true;
                this.startTimer();
            }

            this.updateHUD();
            this.checkWinCondition();
        };
    }

    setupEventListeners() {
        // Back button
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.goHome());
        }

        // Game controls
        const shuffleBtn = document.getElementById('shuffleBtn');
        const hintBtn = document.getElementById('hintBtn');
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        const pauseBtn = document.getElementById('pauseBtn');

        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => this.confirmShuffle());
        }
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }
        if (undoBtn) {
            undoBtn.addEventListener('click', () => this.undo());
        }
        if (redoBtn) {
            redoBtn.addEventListener('click', () => this.redo());
        }
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pauseGame());
        }

        // Menu
        const menuBtn = document.getElementById('menuBtn');
        const menuDropdown = document.getElementById('menuDropdown');
        if (menuBtn && menuDropdown) {
            menuBtn.addEventListener('click', () => {
                menuDropdown.style.display = menuDropdown.style.display === 'none' ? 'flex' : 'none';
            });
        }

        // Menu items
        const settingsBtn = document.getElementById('settingsBtn');
        const helpBtn = document.getElementById('helpBtn');
        const homeBtn = document.getElementById('homeBtn');

        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }
        if (helpBtn) {
            helpBtn.addEventListener('click', () => alert('Use drag and drop to move tiles. Tap the control buttons for additional options.'));
        }
        if (homeBtn) {
            homeBtn.addEventListener('click', () => this.goHome());
        }

        // Pause modal
        const pauseModal = document.getElementById('pauseModal');
        const resumeGameBtn = document.getElementById('resumeGameBtn');
        const homeFromPauseBtn = document.getElementById('homeFromPauseBtn');

        if (resumeGameBtn) {
            resumeGameBtn.addEventListener('click', () => {
                pauseModal.style.display = 'none';
                document.getElementById('gameOverlay').classList.remove('active');
                this.resumeGame();
            });
        }
        if (homeFromPauseBtn) {
            homeFromPauseBtn.addEventListener('click', () => this.goHome());
        }

        // Shuffle confirmation
        const shuffleConfirmModal = document.getElementById('shuffleConfirmModal');
        const confirmShuffleBtn = document.getElementById('confirmShuffleBtn');
        const cancelShuffleBtn = document.getElementById('cancelShuffleBtn');

        if (confirmShuffleBtn) {
            confirmShuffleBtn.addEventListener('click', () => {
                shuffleConfirmModal.style.display = 'none';
                document.getElementById('gameOverlay').classList.remove('active');
                this.performShuffle();
            });
        }
        if (cancelShuffleBtn) {
            cancelShuffleBtn.addEventListener('click', () => {
                shuffleConfirmModal.style.display = 'none';
                document.getElementById('gameOverlay').classList.remove('active');
            });
        }

        // Settings modal
        const settingsModal = document.getElementById('settingsModal');
        const closeSettingsBtn = document.getElementById('closeSettingsBtn');
        const soundToggle = document.getElementById('soundToggle');
        const vibrationToggle = document.getElementById('vibrationToggle');
        const resetGameBtn = document.getElementById('resetGameBtn');

        if (closeSettingsBtn) {
            closeSettingsBtn.addEventListener('click', () => {
                settingsModal.style.display = 'none';
                document.getElementById('gameOverlay').classList.remove('active');
            });
        }

        if (soundToggle) {
            soundToggle.checked = this.soundEnabled;
            soundToggle.addEventListener('change', () => {
                this.soundEnabled = soundToggle.checked;
                Storage.updatePreferences({ soundEnabled: this.soundEnabled });
            });
        }

        if (vibrationToggle) {
            vibrationToggle.checked = this.vibrationEnabled;
            vibrationToggle.addEventListener('change', () => {
                this.vibrationEnabled = vibrationToggle.checked;
                Storage.updatePreferences({ vibrationEnabled: this.vibrationEnabled });
            });
        }

        if (resetGameBtn) {
            resetGameBtn.addEventListener('click', () => {
                if (confirm('Restart this game?')) {
                    location.reload();
                }
            });
        }

        // Win modal
        const playAgainBtn = document.getElementById('playAgainBtn');
        const shareBtn = document.getElementById('shareBtn');
        const homeFromWinBtn = document.getElementById('homeFromWinBtn');

        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                Storage.clearGameSession();
                location.reload();
            });
        }
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareGame());
        }
        if (homeFromWinBtn) {
            homeFromWinBtn.addEventListener('click', () => this.goHome());
        }
    }

    updateHUD() {
        if (!this.gameStarted && this.engine.moveCount === 0) {
            document.getElementById('timer').textContent = '00:00';
        }

        document.getElementById('moveCounter').textContent = this.engine.moveCount;
        document.getElementById('boardSize').textContent = `${this.session.boardSize}×${this.session.boardSize}`;
    }

    startTimer() {
        const startTime = Date.now() - (this.session.elapsedTime || 0);
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const seconds = Math.floor(elapsed / 1000);
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            document.getElementById('timer').textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            
            this.session.elapsedTime = elapsed;
        }, 100);
    }

    confirmShuffle() {
        if (this.gameStarted) {
            document.getElementById('shuffleConfirmModal').style.display = 'flex';
            document.getElementById('gameOverlay').classList.add('active');
        } else {
            this.performShuffle();
        }
    }

    performShuffle() {
        this.engine.shuffle();
        this.engine.moveCount = 0;
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.gameStarted = false;
        this.updateHUD();
    }

    undo() {
        if (this.engine.currentMoveIndex > 0) {
            this.engine.undo();
            this.updateHUD();
        }
    }

    redo() {
        if (this.engine.currentMoveIndex < this.engine.moveHistory.length - 1) {
            this.engine.redo();
            this.updateHUD();
        }
    }

    showHint() {
        const moves = this.findNextMove();
        if (moves.length > 0) {
            const move = moves[0];
            this.vibrate(50);
        }
    }

    findNextMove() {
        // Simple BFS to find next move(s)
        const solvedConfig = this.getSolvedConfig();
        const neighbors = this.engine.tiles.filter(t => 
            (Math.abs(t.x - this.engine.emptyPos.x) === 1 && t.y === this.engine.emptyPos.y) ||
            (Math.abs(t.y - this.engine.emptyPos.y) === 1 && t.x === this.engine.emptyPos.x)
        );
        return neighbors;
    }

    getSolvedConfig() {
        // Config where all tiles are in order
        const config = {};
        for (let i = 0; i < this.session.boardSize * this.session.boardSize - 1; i++) {
            config[i + 1] = { x: i % this.session.boardSize, y: Math.floor(i / this.session.boardSize) };
        }
        return config;
    }

    pauseGame() {
        this.gamePaused = true;
        this.engine.pause();
        if (this.timerInterval) clearInterval(this.timerInterval);

        const pauseModal = document.getElementById('pauseModal');
        document.getElementById('pauseTime').textContent = document.getElementById('timer').textContent;
        document.getElementById('pauseMoves').textContent = this.engine.moveCount;
        pauseModal.style.display = 'flex';
        document.getElementById('gameOverlay').classList.add('active');
    }

    resumeGame() {
        this.gamePaused = false;
        this.engine.resume();
        if (this.gameStarted) {
            this.startTimer();
        }
    }

    openSettings() {
        document.getElementById('settingsModal').style.display = 'flex';
        document.getElementById('gameOverlay').classList.add('active');
    }

    checkWinCondition() {
        if (this.engine.isSolved()) {
            this.gameWon();
        }
    }

    gameWon() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.engine.gameActive = false;

        const elapsedSeconds = Math.floor(this.session.elapsedTime / 1000);
        const moves = this.engine.moveCount;
        const boardSize = this.session.boardSize;
        const mode = this.session.mode || 'Classic';

        // Calculate stars
        const stars = this.calculateStars(boardSize, moves, elapsedSeconds);
        const rating = this.getStarRating(stars);

        // Check if new record
        const record = Storage.getScoreRecord(boardSize, mode, this.session.photoMode ? 'Photo' : 'Number');
        const isNewRecord = !record || moves < record.moves || elapsedSeconds < record.time;

        // Save record
        Storage.saveScoreRecord(boardSize, mode, this.session.photoMode ? 'Photo' : 'Number', {
            moves,
            time: elapsedSeconds,
            stars
        });

        // Update stats
        const stats = Storage.getStats();
        stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
        stats.gamesCompleted = (stats.gamesCompleted || 0) + 1;
        stats.totalTime = (stats.totalTime || 0) + elapsedSeconds;
        
        if (!record || moves < stats.bestMoves) {
            stats.bestMoves = moves;
        }
        if (!record || elapsedSeconds < stats.bestTime) {
            stats.bestTime = elapsedSeconds;
        }

        stats.currentStreak = (stats.currentStreak || 0) + 1;
        if (!stats.bestStreak || stats.currentStreak > stats.bestStreak) {
            stats.bestStreak = stats.currentStreak;
        }

        Storage.setStats(stats);

        // Show win modal
        this.showWinModal(boardSize, mode, moves, elapsedSeconds, stars, rating, isNewRecord);
    }

    calculateStars(size, moves, seconds) {
        // Star requirements based on board size
        const minMoves = {
            3: 8,
            4: 20,
            5: 35,
            6: 55,
            7: 80
        };

        const minTime = {
            3: 30,
            4: 120,
            5: 300,
            6: 600,
            7: 1200
        };

        let stars = 0;
        if (moves <= minMoves[size]) stars++;
        if (seconds <= minTime[size]) stars++;
        if (moves <= minMoves[size] * 0.7 && seconds <= minTime[size] * 0.7) stars++;
        
        return Math.min(3, Math.max(1, stars));
    }

    getStarRating(stars) {
        const ratings = {
            1: 'Good Job!',
            2: 'Excellent!',
            3: 'Perfect!'
        };
        return ratings[stars] || 'Good Job!';
    }

    showWinModal(boardSize, mode, moves, seconds, stars, rating, isNewRecord) {
        const winModal = document.getElementById('winModal');
        
        document.getElementById('winBoardSize').textContent = `${boardSize}×${boardSize}`;
        document.getElementById('winMode').textContent = mode;
        document.getElementById('winMoves').textContent = moves;
        document.getElementById('winTime').textContent = this.formatTime(seconds * 1000);
        document.getElementById('ratingText').textContent = rating;
        document.getElementById('starDisplay').textContent = '⭐'.repeat(stars);

        const recordBadge = document.getElementById('recordBadge');
        if (isNewRecord) {
            recordBadge.style.display = 'block';
        } else {
            recordBadge.style.display = 'none';
        }

        winModal.style.display = 'flex';
        document.getElementById('gameOverlay').classList.add('active');
        
        // Celebration vibration
        this.vibrate([100, 50, 100, 50, 200]);
    }

    shareGame() {
        const boardSize = this.session.boardSize;
        const mode = this.session.mode || 'Classic';
        const moves = this.engine.moveCount;
        const time = document.getElementById('winTime').textContent;
        const stars = document.getElementById('starDisplay').textContent;

        const text = `🎮 I just solved the PrismPuzzle!\n\n${boardSize}×${boardSize} ${mode}\n⏱️ ${time} | 🎯 ${moves} moves\n${stars}\n\nCan you beat my score?`;

        if (navigator.share) {
            navigator.share({
                title: 'PrismPuzzle',
                text: text
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(text).then(() => {
                alert('Score copied to clipboard!');
            });
        }
    }

    goHome() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        Storage.clearGameSession();
        window.location.href = 'index.html';
    }

    vibrate(pattern) {
        if (this.vibrationEnabled && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }

    formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GamePage();
});
