let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    
    // Check if app is already installed (standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    
    // Only show if NOT standalone and prompt is available
    if (!isStandalone) {
        showInstallPromotion();
    }
});

function showInstallPromotion() {
    // Check if banner already exists
    if (document.getElementById('pwaBanner')) return;

    // Check if user has dismissed it recently
    if (localStorage.getItem('pwaDismissed')) return;

    // Use translations if available
    const t = (window.translations && window.translations.kds && window.translations.kds.pwa) ? window.translations.kds.pwa : {
      installTitle: "سەیارە ئەپ دابەزێنە",
      installDesc: "بۆ ئەزموونێکی باشتر ئەپەکە دابەزێنە",
      installBtn: "دابەزاندن"
    };
    
    // Determine correct image path based on current page location
    const currentPath = window.location.pathname;
    const isRootPage = currentPath === '/' || currentPath.endsWith('/index.html') || !currentPath.includes('/');
    const imgPath = isRootPage ? 'img/sayaralogo192.png' : '../img/sayaralogo192.png';
    
    const bannerHTML = `
      <div class="pwa-install-banner" id="pwaBanner">
        <div class="pwa-content">
          <img src="${imgPath}" alt="Icon" class="pwa-icon">
          <div class="pwa-text">
            <h3>${t.installTitle}</h3>
            <p>${t.installDesc}</p>
          </div>
        </div>
        <div class="pwa-actions">
          <button class="pwa-install-btn" onclick="installPWA()">${t.installBtn}</button>
          <button class="pwa-dismiss-btn" onclick="dismissPWA()">×</button>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', bannerHTML);
    const banner = document.getElementById('pwaBanner');
    if(banner) banner.style.display = 'flex';
}

// Make functions global so onclick works
window.installPWA = async function() {
    const banner = document.getElementById('pwaBanner');
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
    }
    // Hide banner after interaction
    if(banner) banner.style.display = 'none';
};

window.dismissPWA = function() {
    const banner = document.getElementById('pwaBanner');
    if(banner) {
        banner.style.display = 'none';
        // Save to localStorage so we don't annoy the user immediately again
        localStorage.setItem('pwaDismissed', 'true');
    }
};
