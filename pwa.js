/**
 * PWA Module
 * Service Worker registration and PWA features
 */

const PWA = (() => {
    let registration = null;

    const init = () => {
        if ('serviceWorker' in navigator) {
            registerServiceWorker();
            setupInstallPrompt();
            handleAppVisibility();
        }
    };

    const registerServiceWorker = async () => {
        try {
            registration = await navigator.serviceWorker.register('./sw.js', {
                scope: './'
            });

            console.log('Service Worker registered successfully:', registration);

            // Check for updates periodically
            setInterval(() => {
                registration.update();
            }, 60000); // Check every minute

            // Listen for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'activated') {
                        console.log('App updated - refreshing...');
                        // Auto-refresh or notify user
                        notifyAppUpdate();
                    }
                });
            });
        } catch (error) {
            console.log('Service Worker registration failed:', error);
        }
    };

    const setupInstallPrompt = () => {
        let deferredPrompt = null;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            showInstallPrompt();
        });

        window.addEventListener('appinstalled', () => {
            console.log('App installed successfully');
            deferredPrompt = null;
        });
    };

    const showInstallPrompt = () => {
        // Could show a custom install button here
        // For now, we let the browser show its native prompt
    };

    const notifyAppUpdate = () => {
        console.log('App update available');
        // Could show a toast or notification
    };

    const handleAppVisibility = () => {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // App is hidden
                console.log('App hidden');
            } else {
                // App is visible
                console.log('App visible');
            }
        });
    };

    const getRegistration = () => {
        return registration;
    };

    const unregister = async () => {
        if (registration) {
            await registration.unregister();
        }
    };

    return {
        init,
        getRegistration,
        unregister
    };
})();

// Initialize PWA when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        PWA.init();
    });
} else {
    PWA.init();
}
