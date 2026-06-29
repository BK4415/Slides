/**
 * Storage Module
 * Manages all persistent game data using localStorage
 */

const Storage = (() => {
    const STORAGE_PREFIX = 'prism_puzzle_';
    const DB_VERSION = 1;

    // Initialize storage schema
    const initStorage = () => {
        if (!localStorage.getItem(STORAGE_PREFIX + 'initialized')) {
            localStorage.setItem(STORAGE_PREFIX + 'version', DB_VERSION);
            localStorage.setItem(STORAGE_PREFIX + 'initialized', 'true');
            
            // Initialize default data
            setStats({
                gamesPlayed: 0,
                gamesCompleted: 0,
                totalTime: 0,
                bestTime: Infinity,
                bestMoves: Infinity,
                currentStreak: 0,
                bestStreak: 0,
                favouriteStyle: 'Number',
                favouriteSize: 4,
                favouriteMode: 'Classic'
            });

            setAchievements({
                firstWin: false,
                tenWins: false,
                speedDemon: false,
                minimalist: false,
                perfectScore: false,
                consecutiveWins: false,
                photoMaster: false,
                largeBoard: false,
                customImage: false,
                allModes: false
            });

            setPreferences({
                soundEnabled: true,
                vibrationEnabled: true,
                tilesNumbersVisible: true
            });
        }
    };

    // Stats
    const getStats = () => {
        const data = localStorage.getItem(STORAGE_PREFIX + 'stats');
        return data ? JSON.parse(data) : {};
    };

    const setStats = (stats) => {
        localStorage.setItem(STORAGE_PREFIX + 'stats', JSON.stringify(stats));
    };

    const updateStats = (updates) => {
        const stats = getStats();
        const updated = { ...stats, ...updates };
        setStats(updated);
        return updated;
    };

    // Achievements
    const getAchievements = () => {
        const data = localStorage.getItem(STORAGE_PREFIX + 'achievements');
        return data ? JSON.parse(data) : {};
    };

    const setAchievements = (achievements) => {
        localStorage.setItem(STORAGE_PREFIX + 'achievements', JSON.stringify(achievements));
    };

    const unlockAchievement = (id) => {
        const achievements = getAchievements();
        if (!achievements[id]) {
            achievements[id] = true;
            setAchievements(achievements);
            return true;
        }
        return false;
    };

    // Preferences
    const getPreferences = () => {
        const data = localStorage.getItem(STORAGE_PREFIX + 'preferences');
        return data ? JSON.parse(data) : {};
    };

    const setPreferences = (preferences) => {
        localStorage.setItem(STORAGE_PREFIX + 'preferences', JSON.stringify(preferences));
    };

    const updatePreferences = (updates) => {
        const prefs = getPreferences();
        const updated = { ...prefs, ...updates };
        setPreferences(updated);
        return updated;
    };

    // Game Resume Data
    const saveGameSession = (sessionData) => {
        localStorage.setItem(STORAGE_PREFIX + 'session', JSON.stringify(sessionData));
    };

    const getGameSession = () => {
        const data = localStorage.getItem(STORAGE_PREFIX + 'session');
        return data ? JSON.parse(data) : null;
    };

    const clearGameSession = () => {
        localStorage.removeItem(STORAGE_PREFIX + 'session');
    };

    // Score Records (per board size/mode)
    const getScoreRecord = (size, mode, style) => {
        const key = `${style}_${size}x${size}_${mode}`;
        const data = localStorage.getItem(STORAGE_PREFIX + 'score_' + key);
        return data ? JSON.parse(data) : null;
    };

    const saveScoreRecord = (size, mode, style, record) => {
        const key = `${style}_${size}x${size}_${mode}`;
        localStorage.setItem(STORAGE_PREFIX + 'score_' + key, JSON.stringify(record));
    };

    // Custom Images
    const saveCustomImage = (imageData) => {
        try {
            localStorage.setItem(STORAGE_PREFIX + 'custom_image', imageData);
            return true;
        } catch (e) {
            console.warn('Storage quota exceeded for image');
            return false;
        }
    };

    const getCustomImage = () => {
        return localStorage.getItem(STORAGE_PREFIX + 'custom_image');
    };

    // Reset all data
    const resetAllData = () => {
        for (let key in localStorage) {
            if (key.startsWith(STORAGE_PREFIX)) {
                localStorage.removeItem(key);
            }
        }
        initStorage();
    };

    // Export public API
    return {
        init: initStorage,
        
        // Stats
        getStats,
        setStats,
        updateStats,
        
        // Achievements
        getAchievements,
        unlockAchievement,
        
        // Preferences
        getPreferences,
        updatePreferences,
        
        // Session
        saveGameSession,
        getGameSession,
        clearGameSession,
        
        // Scores
        getScoreRecord,
        saveScoreRecord,
        
        // Images
        saveCustomImage,
        getCustomImage,
        
        // Admin
        resetAllData
    };
})();

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    Storage.init();
});
