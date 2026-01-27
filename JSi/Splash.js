const splashScreen = document.getElementById('splash-screen');

// Check if splash has been shown in this session
if (sessionStorage.getItem('splashShown')) {
    // If already shown, hide strictly immediately
    if (splashScreen) {
        splashScreen.style.display = 'none'; 
        splashScreen.remove();
    }
} else {
    // If not shown, carry on with the animation logic
    window.addEventListener('load', () => {
        const minDisplayTime = 2000; // Minimum time to show splash screen
        const startTime = performance.now();

        const hideSplash = () => {
            const elapsedTime = performance.now() - startTime;
            const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

            setTimeout(() => {
                splashScreen.classList.add('hidden');
                // Remove from DOM after transition
                setTimeout(() => {
                    splashScreen.remove();
                    // Mark as shown for this session
                    sessionStorage.setItem('splashShown', 'true');
                }, 500);
            }, remainingTime);
        };

        hideSplash();
    });
}
