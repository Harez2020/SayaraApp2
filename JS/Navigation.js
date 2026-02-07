/**
 * Mobile Navigation – SPA Safe (Plain JS)
 * Works with Vercel SPA rewrites & PWA
 */

/* ================================
   Hamburger Menu Toggle
================================ */

function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');
    const moreOverlay = document.querySelector('.more-menu-overlay');

    // Close "More" menu if open
    if (moreOverlay && moreOverlay.classList.contains('open')) {
        moreOverlay.classList.remove('open');
    }

    if (hamburger) hamburger.classList.toggle('active');
    if (navLinks) navLinks.classList.toggle('open');
    if (navOverlay) navOverlay.classList.toggle('show');
}

window.toggleMenu = toggleMenu;

/* ================================
   Render Bottom Navigation
================================ */

function renderMobileNav() {
    const path = window.location.pathname;

    /* -------- Active Page Detection -------- */
    let activePage = 'home';

    if (path.startsWith('/Supplier')) {
        activePage = 'supplier';
    } else if (path.startsWith('/SocialMedia')) {
        activePage = 'social';
    } else if (path.startsWith('/AboutUs')) {
        activePage = 'about';
    } else if (path.startsWith('/ContactUs')) {
        activePage = 'contact';
    }

    const isActive = (name) => activePage === name ? 'active' : '';

    /* -------- Translations -------- */
    const t = (window.translations?.kds?.nav) || {
        home: "سەرەتا",
        supplier: "پارچەفرۆش",
        more: "زیاتر",
        moreTitle: "بەشەکانی تر",
        social: "پلاتفۆڕمەکانمان",
        about: "ئێمە کێین",
        contact: "پەیوەندی بکە"
    };

    /* -------- SPA-Safe Links (ABSOLUTE) -------- */
    const homeLink = '/';
    const link = (folder) => `/${folder}/`;

    /* -------- Navigation HTML -------- */
    const navHTML = `
        <nav class="bottom-nav">
            <a href="${homeLink}" class="nav-item ${isActive('home')}">
                <svg viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                <span>${t.home}</span>
            </a>

            <a href="${link('Supplier')}" class="nav-item ${isActive('supplier')}">
                <svg viewBox="0 0 24 24">
                    <path d="M18.36 9l.6 3H5.04l.6-3h12.72M20 4H4v2h16V4zm0 3H4l-1 5v2h1v6h10v-6h4v6h2v-6h1V8l-1-1zm-7 13H5v-6h6v6z"/>
                </svg>
                <span>${t.supplier}</span>
            </a>

            <button class="nav-item" onclick="toggleMoreMenu()">
                <svg viewBox="0 0 24 24">
                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
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
                    <a href="${link('SocialMedia')}" class="menu-item ${isActive('social')}">
                        <div class="menu-icon" style="background: linear-gradient(135deg,#4facfe,#00f2fe);">📱</div>
                        <span>${t.social}</span>
                    </a>

                    <a href="${link('AboutUs')}" class="menu-item ${isActive('about')}">
                        <div class="menu-icon" style="background: linear-gradient(135deg,#43e97b,#38f9d7);">ℹ️</div>
                        <span>${t.about}</span>
                    </a>

                    <a href="${link('ContactUs')}" class="menu-item ${isActive('contact')}">
                        <div class="menu-icon" style="background: linear-gradient(135deg,#FF9800,#F44336);">📞</div>
                        <span>${t.contact}</span>
                    </a>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', navHTML);
}

/* ================================
   More Menu Toggle
================================ */

function toggleMoreMenu() {
    const moreOverlay = document.querySelector('.more-menu-overlay');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');

    if (navLinks?.classList.contains('open')) {
        hamburger?.classList.remove('active');
        navLinks.classList.remove('open');
        navOverlay?.classList.remove('show');
    }

    moreOverlay?.classList.toggle('open');
}

/* ================================
   Close More Menu on Outside Click
================================ */

document.addEventListener('click', (e) => {
    const overlay = document.querySelector('.more-menu-overlay');
    if (overlay?.classList.contains('open') && e.target === overlay) {
        overlay.classList.remove('open');
    }
});

/* ================================
   Init
================================ */

document.addEventListener('DOMContentLoaded', renderMobileNav);
