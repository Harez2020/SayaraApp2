// normalize string for search (handles Arabic/Kurdish variants and Latin diacritics)
function normalizeForSearch(input) {
    if (!input) return '';
    let s = String(input).normalize('NFC');
    // collapse whitespace
    s = s.replace(/\s+/g, ' ').trim();
    
    // remove zero-width characters (joiners/non-joiners) that can break matching
    s = s.replace(/[\u200B-\u200D\uFEFF]/g, '');

    // map common Arabic/Persian/Kurdish variants to canonical forms
    const map = [
        // Kurdish-specific normalizations (most important for Kurdish users)
        [/\u0647/g, '\u06D5'], // Arabic Heh (ه) -> Kurdish Ae (ە) - CRITICAL for Kurdish search
        
        // Standard Arabic/Persian to Kurdish/Persian normalizations
        [/\u064A/g, '\u06CC'], // Arabic Yeh (ي) -> Farsi/Kurdish Yeh (ی)
        [/\u0643/g, '\u06A9'], // Arabic Kaf (ك) -> Persian Kaf (ک)
        
        // Alef variants to canonical Alef
        [/\u0622/g, '\u0627'], // Alef Madda (آ) -> Alef (ا)
        [/\u0623/g, '\u0627'], // Alef with Hamza above (أ) -> Alef (ا)
        [/\u0625/g, '\u0627'], // Alef with Hamza below (إ) -> Alef (ا)
        
        // Remove all punctuation and special characters
        [/[,؛،.:\-_\/\\()\[\]{}'"«»`~!@#$%^&*+=|<>?]/g, '']
    ];
    map.forEach(([re, repl]) => { s = s.replace(re, repl); });

    // If the string contains Latin letters, strip diacritics and lowercase
    if (/[A-Za-z]/.test(s)) {
        s = s.normalize('NFD').replace(/\p{M}/gu, '').normalize('NFC');
        s = s.toLocaleLowerCase();
    } else {
        // for Arabic/Kurdish script, lowercase is a no-op but keep locale fold
        s = s.toLocaleLowerCase();
    }

    return s;
}

// Function to load services data from JSON file
async function loadServicesData() {
    try {
        // use an explicit relative URL based on current document location
        // this avoids issues when the page is served from a different base path
        const jsonUrl = new URL('./services.json', location.href).href;
        const response = await fetch(jsonUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const servicesData = await response.json();
        // precompute a normalized searchKey for each service
        servicesData.forEach(service => {
            service.searchKey = normalizeForSearch([
                service.title || '',
                service.location || '',
                service.description || '',
                service.preview || '',
                (service.phones || []).join(' ')
            ].join(' '));

            // Default targetType to 'car' if missing
            if (!service.targetType) service.targetType = 'car';
        });
        return servicesData;
    } catch (error) {
        console.error('Error loading services data:', error);
        // Fallback to hardcoded data if JSON loading fails
        const fallback = [
            {
                "id": 1,
                "title": "فیتەری گەڕۆک",
                "preview": "ئامادەین بۆ چاککردنی سەیارەکانتان...",
                "description": "ئامادەین بۆ چاککردنی سەیارەکانتان فیتەری وایەرمەنی (خەلەلی مەکینە فیول پەمپ سلف دیلەمۆ ) ڕۆنگۆڕین و پەنچەری هتد",
                "location": "سلێمانی ، تاسڵوجە ، پێنجوێن ، شارباژێر",
                "phones": ["07701490797", "07719916297"],
                "workHours": "٧ بەیانی تا ١ی شەو",
                "image": "img/fetaryGarok.jpg",
                "whatsapp": "9647701490797"
            }
        ];
        // compute searchKey for fallback
        fallback.forEach(service => {
            service.searchKey = normalizeForSearch([
                service.title || '',
                service.location || '',
                service.description || '',
                service.preview || '',
                (service.phones || []).join(' ')
            ].join(' '));
        });
        return fallback;
    }
}

// Function to generate a card HTML from service data
function generateCardHTML(service) {
    // Format phone numbers
    const phones = Array.isArray(service.phones) ? service.phones : [];
    let phoneNumbers = "";
    if (phones.length === 1) {
        phoneNumbers = `<strong><span class="field-label"> ژمارە مۆبایل : </span><a href="tel:${phones[0]}" class="phone-link">${phones[0]}</a></strong>`;
    } else if (phones.length >= 2) {
        phoneNumbers = `<strong><span class="field-label"> ژمارە مۆبایل : </span><a href="tel:${phones[0]}" class="phone-link">${phones[0]}</a> <br><span class="field-placeholder"> ............... : </span> <a href="tel:${phones[1]}" class="phone-link">${phones[1]}</a></strong>`;
    } else {
        phoneNumbers = `<strong><span class="field-label"> ژمارە مۆبایل : </span>---</strong>`;
    }
    
    // Format work hours
    let workHours = service.workHours ? `<strong><span class="field-label">کاتی دەوام : </span>${service.workHours}</strong>` : `<strong><span class="field-label">کاتی دەوام : </span></strong>`;
    
    // encode image URL to avoid issues with non-ASCII filenames on some hosts
    const imageSrc = service.image ? encodeURI(service.image) : 'img/placeholder.png';
    const encodedTitle = service.title ? service.title.replace(/"/g, '&quot;') : '';

    // Prepare WhatsApp link (safely encode message)
    const whatsappNumber = service.whatsapp ? String(service.whatsapp).trim() : '';
    const waText = 'سڵاو لە لایەن ئەپی سەیارەوە هاتووم ، دەمەوێت زانیاری زیاتر وەربگرم';
    const waHref = whatsappNumber ? `https://wa.me/${encodeURIComponent(whatsappNumber)}?text=${encodeURIComponent(waText)}` : '#';

    return `
    <div class="card" data-search="${service.searchKey}" data-target-type="${service.targetType}">
        <div class="logo">
            <img src="${imageSrc}" alt="${encodedTitle}">
        </div>
        <div class="text">
            <h2 class="title"><span class="text-highlight">${service.title}</span></h2>
            <div class="description-container">
                <p class="description preview"><strong><span class="text-highlight">${service.preview}</span></strong></p>
                <p class="description full-view"><strong><span class="text-highlight">${service.description}</span></strong></p>
            </div>
            <div class="ReadMore" onclick="toggleDescription(this)"><span class="text-highlight">زانیاری زیاتر بزانە...</span></div>
            <p class="location"><strong><span class="text-highlight"><span class="field-label"> شوێنی کارکردن: </span>${service.location}</span></strong></p>
            <p class="phone"><span class="text-highlight">${phoneNumbers}</span></p>
            <p class="time"><span class="text-highlight">${workHours}</span></p>
            <hr>
        </div>
        <div class="phone">
            <a class="whatsUp" href="${waHref}" target="_blank" rel="noopener noreferrer" aria-label="واتساب: ${encodedTitle}">
                <img src="img/phone.svg" alt="واتساب ${encodedTitle}">
                <span class="wa-text">واتساب</span>
            </a>
        </div>
    </div>`;
}

// NEW: v2 card generator with animated Read More/Less
function generateCardHTMLv2(service) {
    // Format phone numbers as buttons (max 2)
    const phones = Array.isArray(service.phones) ? service.phones : [];
    let phoneButtons = "";
    phones.slice(0, 2).forEach(phone => {
        // Ensure phone starts with 0 for display
        const displayPhone = phone.toString().startsWith('0') ? phone : '0' + phone;

        phoneButtons += `
            <a class="phone-btn" href="tel:${displayPhone}" aria-label="پەیوەندی کردن: ${displayPhone}">
                <span class="phone-icon"></span>
                <span class="phone-number">${displayPhone}</span>
            </a>
        `;
    });



    // Format work hours
    let workHours = service.workHours ? `<strong><span class="field-label">کاتی دەوام : </span>${service.workHours}</strong>` : `<strong><span class="field-label">کاتی دەوام : </span></strong>`;
    
    // encode image URL
    const imageSrc = service.image ? encodeURI(service.image) : 'img/placeholder.png';
    const encodedTitle = service.title ? service.title.replace(/"/g, '&quot;') : '';

    // Prepare WhatsApp link
    const whatsappNumber = service.whatsapp ? String(service.whatsapp).trim() : '';
    const waText = 'سڵاو، دەمەوێت زانیاری زیاتر وەربگرم دەربارەی خزمەتگوزاریەکەتان';
    const waHref = whatsappNumber ? `https://wa.me/${encodeURIComponent(whatsappNumber)}?text=${encodeURIComponent(waText)}` : '#';

    return `
    <div class="card" data-search="${service.searchKey}" data-target-type="${service.targetType}">
        <div class="logo">
            <img src="${imageSrc}" alt="${encodedTitle}">
        </div>
        <div class="text">
            <h2 class="title"><span class="text-highlight">${service.title}</span></h2>
            <div class="description-container-v2">
                <p class="description-text"><strong><span class="text-highlight">${service.description}</span></strong></p>
            </div>
            <div class="ReadMore-v2" onclick="toggleDescriptionV2(this)">
                <span class="text-highlight"><span class="label">زانیاری زیاتر</span> <span class="arrow">▼</span></span>
            </div>
            <p class="location"><strong><span class="text-highlight"><span class="field-label"> شوێنی کارکردن: </span>${service.location}</span></strong></p>
            <p class="time"><span class="text-highlight">${workHours}</span></p>
            <hr>
        </div>
        <div class="phone action-buttons">
            ${phoneButtons}
            <a class="whatsUp" href="${waHref}" target="_blank" rel="noopener noreferrer" aria-label="واتساب: ${encodedTitle}">
                <img src="img/phone.svg" alt="واتساب ${encodedTitle}">
                <span class="wa-text">واتساب</span>
            </a>
        </div>
    </div>`;
}

// Function to load and display all cards
async function loadCards() {
    const servicesData = await loadServicesData();
    const cardsContainer = document.getElementById('cardsContainer');
    let cardsHTML = '';
    
    servicesData.forEach((service) => {
        cardsHTML += generateCardHTMLv2(service);
    });
    
    cardsContainer.innerHTML = cardsHTML;
    
    // Hide Read More buttons for cards that don't need expanding
    hideUnnecessaryReadMore();
}

// NEW: Check if description overflows and hide Read More button if not needed
function hideUnnecessaryReadMore() {
    const containers = document.querySelectorAll('.description-container-v2');
    const MIN_CHARS_FOR_READ_MORE = 80; // Minimum characters before showing Read More
    
    containers.forEach(container => {
        const textElement = container.querySelector('.description-text');
        const readMoreBtn = container.nextElementSibling;
        
        if (textElement && readMoreBtn && readMoreBtn.classList.contains('ReadMore-v2')) {
            const textContent = textElement.textContent || '';
            const textLength = textContent.trim().length;
            
            // Hide Read More if:
            // 1. Text doesn't overflow the container, OR
            // 2. Text is shorter than minimum threshold
            const noOverflow = container.scrollHeight <= container.clientHeight + 2;
            const tooShort = textLength < MIN_CHARS_FOR_READ_MORE;
            
            if (noOverflow || tooShort) {
                readMoreBtn.style.display = 'none';
                container.classList.add('no-overflow');
            }
        }
    });
}
 
// NEW: Toggle description visibility (v2 - animated)
function toggleDescriptionV2(element) {
    const container = element.previousElementSibling;
    const isExpanded = container.classList.toggle('expanded');
    element.classList.toggle('expanded', isExpanded);
    
    // Update button text
    const label = element.querySelector('.label');
    if (label) {
        label.textContent = isExpanded ? 'زانیاری کەمتر' : 'زانیاری زیاتر';
    }
}

// Synonym map for smarter search (Kurdish/Arabic <-> English/Common terms) - Consistent with suppliers.js
const synonymMap = {
    // Locations
    'hawler': ['hawler', 'erbil', 'irbil', 'arbil', 'هەولێر', 'اربیل', 'hewler'],
    'slemani': ['slemani', 'sulaymaniyah', 'sulaimanyah', 'sulaimani', 'sulaymani', 'silemani', 'سلێمانی', 'سلیمانی', 'سلێمانی'],
    'baghdad': ['baghdad', 'بەغداد', 'بغداد'],
    'duhok': ['duhok', 'dihok', 'دهۆک', 'دهوك'],
    'kirkuk': ['kirkuk', 'kerkuk', 'کەرکوک', 'كركوك'],
    'halabja': ['halabja', 'halabje', 'هەڵەبجە'],
    
    // Services
    'mechanic': ['mechanic', 'فیتەر', 'فیتەری', 'میکانیك', 'میکانیک'],
    'car_wash': ['car wash', 'غەسل', 'شۆردن', 'غسل', 'شستن'],
    'fuel_pump': ['fuel', 'pump', 'فیت پەمپ', 'پەمپ'],
    'tire': ['tire', 'وایەرمەن', 'لاتە'],
    'transport': ['transport', 'فلات', 'کرێن', 'بارکردن', 'گواستنەوە'],
    'locksmith': ['locksmith', 'کلیل', 'دەرگا', 'قفل']
};

function getSearchTerms(input) {
    const normalized = normalizeForSearch(input);
    if (!normalized) return [];

    let terms = [normalized];

    // Check for synonyms
    for (const [key, values] of Object.entries(synonymMap)) {
        // If input matches any of the values (normalized), add the key and all values
        const match = values.some(v => normalizeForSearch(v) === normalized || normalized.includes(normalizeForSearch(v)));
        if (match) {
            terms = [...terms, key, ...values];
        }
    }
    
    // Deduplicate and normalize all
    return [...new Set(terms.map(t => normalizeForSearch(t)))];
}

// Current active branch
let currentBranch = 'car';

// Function to select a branch
function selectBranch(branch) {
    currentBranch = branch;
    
    // Update UI
    document.querySelectorAll('.branch-btn').forEach(btn => {
        if (btn.dataset.target === branch) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Re-filter cards
    filterCards();
}

// Filter cards based on selected criteria
function filterCards() {
    // Get selected values
    const locationFilter = document.getElementById('locationFilter').value;
    const serviceFilter = document.getElementById('serviceFilter').value;
    const searchInput = document.getElementById('searchInput') ? document.getElementById('searchInput').value : '';
    
    // Get all cards
    const cards = document.querySelectorAll('.card');
    
    // Pre-normalize filters
    const normalizedLocationFilter = normalizeForSearch(locationFilter);
    
    // Generate all related search terms (synonyms) from input
    const searchTerms = getSearchTerms(searchInput);

    // map serviceFilter keys to likely keywords (Kurdish/Arabic + english)
    const serviceKeywordsMap = {
        mechanic: ['mechanic', 'فیتەر', 'فیتەری', 'میکانیك', 'میکانیک'],
        car_wash: ['car wash', 'غەسل', 'شۆردن', 'غسل', 'شستن'],
        fuel_pump: ['fuel', 'pump', 'فیت پەمپ', 'پەمپ'],
        tire: ['tire', 'وایەرمەن', 'لاتە'],
        transport: ['transport', 'فلات', 'کرێن', 'بارکردن', 'گواستنەوە'],
        locksmith: ['locksmith', 'کلیل', 'دەرگا', 'قفل']
    };

    let visibleCount = 0;

    cards.forEach(card => {
        let showCard = true;
        const search = card.dataset.search || '';
        const cardType = card.dataset.targetType || 'car';

        // 1. Branch Filter (Primary)
        if (cardType !== currentBranch) {
            showCard = false;
        }

        // 2. Location filter (use precomputed searchKey)
        if (showCard && locationFilter !== 'all') {
            // Use synonym matching for location dropdown too
            const locSynonyms = getSearchTerms(locationFilter);
            const locMatch = locSynonyms.some(term => search.includes(term));
            
            if (!locMatch && !search.includes(normalizedLocationFilter)) {
                showCard = false;
            }
        }

        // 3. Service filter
        if (showCard && serviceFilter !== 'all') {
            const keywords = serviceKeywordsMap[serviceFilter] || [serviceFilter];
            const hasMatch = keywords.some(k => search.includes(normalizeForSearch(k)));
            if (!hasMatch) showCard = false;
        }

        // 4. Text Search Filter
        if (showCard && searchInput.trim() !== '') {
            // Check if ANY of the expanded search terms match the card's content
            const hit = searchTerms.some(term => search.includes(term));
            if (!hit) showCard = false;
        }

        if (showCard) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });

    // Handle No Results Message
    const container = document.getElementById('cardsContainer');
    let noResultsMsg = document.getElementById('noResultsMsg');
    
    if (visibleCount === 0) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'noResultsMsg';
            noResultsMsg.style.textAlign = 'center';
            noResultsMsg.style.padding = '50px 20px';
            noResultsMsg.style.fontSize = '1.4rem';
            noResultsMsg.style.fontWeight = 'bold';
            noResultsMsg.style.color = '#555';
            noResultsMsg.style.backgroundColor = '#f4f4f4';
            noResultsMsg.style.borderRadius = '12px';
            noResultsMsg.style.margin = '30px auto';
            noResultsMsg.style.width = '100%';
            noResultsMsg.style.maxWidth = '600px';
            noResultsMsg.style.gridColumn = '1 / -1';
            noResultsMsg.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
            noResultsMsg.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 15px;">🔍</div>
                ببوورە، هیچ ئەنجامێک نەدۆزرایەوە
            `;
            container.appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    } else {
        if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }
}

// Export functions for use in other files
window.loadServicesData = loadServicesData;
window.generateCardHTML = generateCardHTML;
window.generateCardHTMLv2 = generateCardHTMLv2;
window.loadCards = loadCards; 
window.toggleDescriptionV2 = toggleDescriptionV2;
window.filterCards = filterCards;
window.selectBranch = selectBranch;