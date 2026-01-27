/**
 * Mobile Navigation - Hamburger Menu Toggle
 */

// Toggle hamburger menu (shared across all pages)
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');
    const moreOverlay = document.querySelector('.more-menu-overlay');
    
    // Close the "More" menu if it's open
    if (moreOverlay && moreOverlay.classList.contains('open')) {
        moreOverlay.classList.remove('open');
    }
    
    // Toggle hamburger menu
    if (hamburger) hamburger.classList.toggle('active');
    if (navLinks) navLinks.classList.toggle('open');
    if (navOverlay) navOverlay.classList.toggle('show');
}

// Make toggleMenu globally available
window.toggleMenu = toggleMenu;

// Function to generate the navigation HTML
function renderMobileNav() {
    // Determine current page from URL to set active state
    const path = window.location.pathname;
    let activePage = '';
    
    if (path.includes('/Delivery/') || path.endsWith('SayaraApp/') || path.endsWith('index.html') && !path.includes('Supplier') && !path.includes('Form') && !path.includes('SocialMedia') && !path.includes('AboutUs') && !path.includes('Share')) {
        activePage = 'home';
    } else if (path.includes('/Supplier/')) {
        activePage = 'supplier';
    } else if (path.includes('/Form/')) {
        activePage = 'form';
    } else if (path.includes('/SocialMedia/')) {
        activePage = 'social';
    } else if (path.includes('/AboutUs/')) {
        activePage = 'about';
    } else if (path.includes('/ContactUs/')) {
        activePage = 'contact';
    } else if (path.includes('/Share/')) {
        activePage = 'share';
    } else if (path.includes('privacy.html')) {
        activePage = 'privacy';
    } else if (path.includes('terms.html')) {
        activePage = 'terms';
    }

    // Helper to add 'active' class
    const isActive = (name) => activePage === name ? 'active' : '';
    
    // Use translations if available, fallback to hardcoded if not (safety check)
    const t = (window.translations && window.translations.kds && window.translations.kds.nav) ? window.translations.kds.nav : {
      home: "سەرەتا",
      supplier: "پارچەفرۆش",
      more: "زیاتر",
      moreTitle: "بەشەکانی تر",
      form: "داواکردن",
      social: "سۆشیاڵ",
      about: "دەربارە",
      contact: "پەیوەندی",
      share: "بڵاوکردنەوە",
      privacy: "پاراستن",
      terms: "مەرجەکان"
    };

    const navHTML = `
      <nav class="bottom-nav">
        <a href="../Delivery/" class="nav-item ${isActive('home')}">
          <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span>${t.home}</span>
        </a>
        <a href="../Supplier/" class="nav-item ${isActive('supplier')}">
          <svg viewBox="0 0 24 24"><path d="M18.36 9l.6 3H5.04l.6-3h12.72M20 4H4v2h16V4zm0 3H4l-1 5v2h1v6h10v-6h4v6h2v-6h1V8l-1-1zm-7 13H5v-6h6v6z"/></svg>
          <span>${t.supplier}</span>
        </a>
        
        <button class="nav-item" onclick="toggleMoreMenu()">
          <svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
          <span>${t.more}</span>
        </button>
      </nav>

      <!-- More Menu Overlay -->
      <div class="more-menu-overlay">
        <div class="more-menu-container">
          <div class="menu-header">
            <span class="menu-title">${t.moreTitle}</span>
            <button class="close-menu-btn" onclick="toggleMoreMenu()">×</button>
          </div>
          <div class="menu-grid">
            <a href="../Form/" class="menu-item ${isActive('form')}">
              <div class="menu-icon" style="background: linear-gradient(135deg, #f84269, #ff6b8a);">📝</div>
              <span>${t.form}</span>
            </a>
            <a href="../SocialMedia/" class="menu-item ${isActive('social')}">
              <div class="menu-icon" style="background: linear-gradient(135deg, #4facfe, #00f2fe);">📱</div>
              <span>${t.social}</span>
            </a>
            <a href="../AboutUs/" class="menu-item ${isActive('about')}">
              <div class="menu-icon" style="background: linear-gradient(135deg, #43e97b, #38f9d7);">ℹ️</div>
              <span>${t.about}</span>
            </a>
            <a href="../ContactUs/" class="menu-item ${isActive('contact')}">
                <div class="menu-icon" style="background: linear-gradient(135deg, #FF9800, #F44336);">📞</div>
                <span>${t.contact}</span>
            </a>
            <a href="../Share/" class="menu-item ${isActive('share')}">
              <div class="menu-icon" style="background: linear-gradient(135deg, #fa709a, #fee140);">📤</div>
              <span>${t.share}</span>
            </a>
            <a href="../termandprivacy/privacy.html" class="menu-item ${isActive('privacy')}">
              <div class="menu-icon" style="background: linear-gradient(135deg, #667eea, #764ba2);">🔒</div>
              <span>${t.privacy}</span>
            </a>
            <a href="../termandprivacy/terms.html" class="menu-item ${isActive('terms')}">
              <div class="menu-icon" style="background: linear-gradient(135deg, #ff9a9e, #fad0c4);">📜</div>
              <span>${t.terms}</span>
            </a>
          </div>
        </div>
      </div>
    `;

    // Inject before script tags or at end of body
    document.body.insertAdjacentHTML('beforeend', navHTML);
}

// Toggle "More" menu function
function toggleMoreMenu() {
    const moreOverlay = document.querySelector('.more-menu-overlay');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');
    
    // Close the hamburger menu if it's open
    if (navLinks && navLinks.classList.contains('open')) {
        if (hamburger) hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('show');
    }
    
    // Toggle More menu
    if (moreOverlay) {
        moreOverlay.classList.toggle('open');
    }
}

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    const overlay = document.querySelector('.more-menu-overlay');
    if (overlay && overlay.classList.contains('open')) {
        if (e.target === overlay) {
            overlay.classList.remove('open');
        }
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', renderMobileNav);
