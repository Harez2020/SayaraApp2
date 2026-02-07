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
    
    if (path.includes('/Delivery/') || path.endsWith('SayaraApp/') || path.endsWith('index.html') && !path.includes('Supplier') && !path.includes('SocialMedia') && !path.includes('AboutUs') && !path.includes('ContactUs')) {
        activePage = 'home';
    } else if (path.includes('/Supplier/')) {
        activePage = 'supplier';
    } else if (path.includes('/SocialMedia/')) {
        activePage = 'social';
    } else if (path.includes('/AboutUs/')) {
        activePage = 'about';
    } else if (path.includes('/ContactUs/')) {
        activePage = 'contact';
    }

    // Helper to add 'active' class
    const isActive = (name) => activePage === name ? 'active' : '';
    
    // Use translations if available, fallback to hardcoded if not (safety check)
    const t = (window.translations && window.translations.kds && window.translations.kds.nav) ? window.translations.kds.nav : {
      home: "سەرەتا",
      supplier: "پارچەفرۆش",
      more: "زیاتر",
      moreTitle: "بەشەکانی تر",
      social: "پلاتفۆڕمەکانمان",
      about: "ئێمە کێین",
      contact: "پەیوەندی بکە"
    };

    // Determine prefix based on current depth
    // If we are at root (index.html or /), prefix is ./
    // If we are in a subfolder (Supplier/, AboutUs/, etc.), prefix is ../
    
    // Simple heuristic: if we match one of the known subfolders, we are deep.
    // Otherwise we are at root.
    const knownSubfolders = ['Supplier', 'SocialMedia', 'AboutUs', 'ContactUs'];
    const isSubfolder = knownSubfolders.some(folder => path.includes(folder));
    
    const rootPrefix = isSubfolder ? '../' : './';
    
    // Home link
    const homeLink = rootPrefix; // goes to ./ or ../ (which is root)
    
    // Other links need to append folder name
    // e.g. from root: ./Supplier/
    // e.g. from sub: ../Supplier/
    const getLink = (folder) => `${rootPrefix}${folder}/`;
    const getFileLink = (folder, file) => `${rootPrefix}${folder}/${file}`;

     const navHTML = `
      <nav class="bottom-nav">
        <a href="${homeLink}" class="nav-item ${isActive('home')}">
          <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span>${t.home}</span>
        </a>
        <a href="${getLink('Supplier')}" class="nav-item ${isActive('supplier')}">
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
            <a href="${getLink('SocialMedia')}" class="menu-item ${isActive('social')}">
              <div class="menu-icon" style="background: linear-gradient(135deg, #4facfe, #00f2fe);">📱</div>
              <span>${t.social}</span>
            </a>
            <a href="${getLink('AboutUs')}" class="menu-item ${isActive('about')}">
              <div class="menu-icon" style="background: linear-gradient(135deg, #43e97b, #38f9d7);">ℹ️</div>
              <span>${t.about}</span>
            </a>
            <a href="${getLink('ContactUs')}" class="menu-item ${isActive('contact')}">
                <div class="menu-icon" style="background: linear-gradient(135deg, #FF9800, #F44336);">📞</div>
                <span>${t.contact}</span>
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
