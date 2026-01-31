
// normalize string for search
function normalizeForSearch(input) {
    if (!input) return '';
    let s = String(input).normalize('NFC');
    s = s.replace(/\s+/g, ' ').trim();
    s = s.replace(/[\u200B-\u200D\uFEFF]/g, '');
    
    // Arabic/Kurdish normalization map 
    // (Same as Delivery/services.js to ensure consistency)
    const map = [
        [/\u0647/g, '\u06D5'], 
        [/\u064A/g, '\u06CC'], 
        [/\u0643/g, '\u06A9'], 
        [/\u0622/g, '\u0627'], 
        [/\u0623/g, '\u0627'], 
        [/\u0625/g, '\u0627'], 
        [/[,؛،.:\-_\/\\()\[\]{}'"«»`~!@#$%^&*+=|<>?]/g, '']
    ];
    map.forEach(([re, repl]) => { s = s.replace(re, repl); });

    s = s.toLocaleLowerCase();
    return s;
}

async function loadServicesData() {
    try {
        const response = await fetch('./suppliers.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        data.forEach(item => {
            item.searchKey = normalizeForSearch([
                item.title || '',
                item.location || '',
                item.description || '',
                item.preview || '',
                (item.phones || []).join(' '),
                item.vehicleTypes || ''
            ].join(' '));
        });
        return data;
    } catch (error) {
        console.error('Error loading data:', error);
        return [];
    }
}


function generateCardHTML(item) {
    // Generate phone buttons (max 2)
    const phones = Array.isArray(item.phones) ? item.phones : [];
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
    
    // Handle empty image
    let imageSrc = item.image;
    if (!imageSrc || imageSrc.trim() === "") {
        imageSrc = "../Delivery/img/CardlogoPlaceHolder.svg";
    }

    const whatsappNumber = item.whatsapp && item.whatsapp.trim() !== "" ? String(item.whatsapp).trim() : '';
    const waText = 'سڵاو لە لایەن ئەپی سەیارەوە هاتووم ، دەمەوێت زانیاری زیاتر وەربگرم';
    const waHref = whatsappNumber ? `https://wa.me/${encodeURIComponent(whatsappNumber)}?text=${encodeURIComponent(waText)}` : '#';
    const waStyle = whatsappNumber ? '' : 'style="display:none; opacity:0.5; pointer-events:none;"';

    return `
    <div class="card" 
         data-search="${item.searchKey}" 
         data-location="${normalizeForSearch(item.location)}" 
         data-vehicle="${normalizeForSearch(item.vehicleTypes)}">
        <div class="logo">
            <img src="${imageSrc}" alt="${item.title}" onerror="this.src='../img/CardlogoPlaceHolder.svg'">
        </div>
        <div class="text">
            <h2 class="title"><span class="text-highlight">${item.title}</span></h2>
            <div class="description-container-v2">
                <p class="description-text"><strong><span class="text-highlight">${item.description}</span></strong></p>
            </div>
            <div class="ReadMore-v2" onclick="toggleDescriptionV2(this)">
                <span class="text-highlight"><span class="label">زانیاری زیاتر</span> <span class="arrow">▼</span></span>
            </div>
            <p class="location"><strong><span class="text-highlight"><span class="field-label"> شوێن: </span>${item.location}</span></strong></p>
            <hr>
        </div>
        <div class="phone action-buttons">
            ${phoneButtons}
            <a class="whatsUp" href="${waHref}" target="_blank" rel="noopener noreferrer" ${waStyle}>
                <img src="../img/phone.svg" alt="واتساب">
                <span class="wa-text">واتساب</span>
            </a>
        </div>
    </div>`;
}

async function loadCards() {
    const data = await loadServicesData();
    const container = document.getElementById('cardsContainer');
    container.innerHTML = data.map(generateCardHTML).join('');
    
    // Hide Read More buttons for cards that don't need expanding
    hideUnnecessaryReadMore();
}

// Toggle description visibility (v2 - animated)
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

// Check if description overflows and hide Read More button if not needed
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

// Track active service type (default to 'all')
let currentServiceType = 'all';
// Track active brand (default to 'all')
let currentBrand = 'all';

function selectBranch(type) {
    currentServiceType = type;
    
    // Update active UI for service buttons
    document.querySelectorAll('.branch-selector .branch-btn').forEach(btn => {
        if (btn.dataset.target === type) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    filterCards();
}

function selectBrand(brand) {
    currentBrand = brand;

    // Update active UI for brand cards
    document.querySelectorAll('.brand-card').forEach(btn => {
        if (btn.dataset.target === brand) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    filterCards();
}

// Synonym map for smarter search (Kurdish/Arabic <-> English/Common terms)
const synonymMap = {
    // Brands
    'toyota': ['toyota', 'تۆیۆتا', 'تویوتا'],
    'nissan': ['nissan', 'نیسان'],
    'kia': ['kia', 'کیا'],
    'hyundai': ['hyundai', 'هیۆندای', 'هيونداي', 'هۆندا'],
    'ford': ['ford', 'فۆرد'],
    'chevrolet': ['chevrolet', 'شۆفرلێت', 'شۆف', 'شۆفر'],
    'bmw': ['bmw', 'بی ئێم'],
    'mercedes': ['mercedes', 'مێرسیدس', 'مارسیدس'],
    'jeep': ['jeep', 'جیپ', 'جێب'],
    'mitsubishi': ['mitsubishi', 'میتسوبیشی'],
    'mazda': ['mazda', 'مازدا'],
    'honda': ['honda', 'هۆندا'],
    'dodge': ['dodge', 'دۆج'],
    'chrysler': ['chrysler', 'کرایسلەر'],
    'land rover': ['land rover', 'لاند ڕۆڤەر'],
    'range rover': ['range rover', 'ڕەنج ڕۆڤەر'],
    'lexus': ['lexus', 'لێکسس'],
    
    // Models
    'camry': ['camry', 'کامری'],
    'corolla': ['corolla', 'کرۆلا', 'کۆرۆلا'],
    'hilux': ['hilux', 'هایلۆکس'],
    'land cruiser': ['land cruiser', 'لاند کرۆزەر', 'مۆنیکا', 'لاندکرۆز'],
    'yaris': ['yaris', 'یارس'],
    'avalon': ['avalon', 'ئەڤەلۆن'],
    'patrol': ['patrol', 'پاترۆڵ'],
    'sunny': ['sunny', 'سەنی', 'صەنی'],
    'sentra': ['sentra', 'سەنترا'],
    'altima': ['altima', 'ئالتیما'],
    'optima': ['optima', 'ئۆپتیما'],
    'sorento': ['sorento', 'سۆرێنتۆ'],
    'sportage': ['sportage', 'سپۆرتاج'],
    'cerato': ['cerato', 'سیراتۆ', 'سێراتۆ'],
    'rio': ['rio', 'ریۆ'],
    'elantra': ['elantra', 'ئیلانترا', 'ئینانترا'],
    'sonata': ['sonata', 'سۆناتا'],
    'tucson': ['tucson', 'توسان'],
    'santa fe': ['santa fe', 'سانتافی'],
    'accent': ['accent', 'ئەکسێنت'],
    'mustang': ['mustang', 'موستانگ'],
    'explorer': ['explorer', 'ئێکسپلۆرەر'],
    'edge': ['edge', 'ئێج'],
    
    // Locations
    'hawler': ['hawler', 'erbil', 'irbil', 'arbil', 'هەولێر', 'اربیل', 'hewler'],
    'slemani': ['slemani', 'sulaymaniyah', 'sulaimanyah', 'sulaimani', 'sulaymani', 'silemani', 'سلێمانی', 'سلیمانی', 'سلێمانی'],
    'baghdad': ['baghdad', 'بەغداد', 'بغداد'],
    'duhok': ['duhok', 'dihok', 'دهۆک', 'دهوك'],
    'kirkuk': ['kirkuk', 'kerkuk', 'کەرکوک', 'كركوك'],
    'halabja': ['halabja', 'halabje', 'هەڵەبجە'],
    'online': ['online', 'ئۆنلاین', 'اونلاين']
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

function filterCards() {
    const locFilter = document.getElementById('locationFilter').value;
    const searchInput = document.getElementById('searchInput') ? document.getElementById('searchInput').value : '';
    
    const cards = document.querySelectorAll('.card');
    const normLoc = normalizeForSearch(locFilter);
    const normBrand = normalizeForSearch(currentBrand);
    
    // Generate all related search terms (synonyms)
    const searchTerms = getSearchTerms(searchInput);
    
    // Normalize service type
    const normService = normalizeForSearch(currentServiceType);

    let visibleCount = 0;
    
    cards.forEach(card => {
        let show = true;
        
        // 1. Location Filter
        if (locFilter !== 'all') {
            const cardLoc = card.dataset.location || '';
            // Allow general location matches (e.g. searching 'Hawler' finds 'Erbil')
            const locSynonyms = getSearchTerms(locFilter);
            const locMatch = locSynonyms.some(term => cardLoc.includes(term));
            if (!locMatch && !cardLoc.includes(normLoc)) show = false;
        }

        // 2. Brand Filter (formerly vehicleFilter)
        if (show && currentBrand !== 'all') {
            const cardVehicle = card.dataset.vehicle || '';
            // If filtering for "all", we show items marked "all" or any specific brand
            if (!cardVehicle.includes(normBrand) && !cardVehicle.includes('all')) show = false;
        }

        // 3. Service Type Filter (Buttons)
        if (show && currentServiceType !== 'all') {
             const cardVehicle = card.dataset.vehicle || '';
             if (!cardVehicle.includes(normService)) show = false;
        }

        // 4. General Search Filter (The upgraded part)
        if (show && searchInput.trim() !== '') {
            const searchKey = card.dataset.search || '';
            
            // Check if ANY of the expanded search terms match the card's content
            const hit = searchTerms.some(term => searchKey.includes(term));
            
            if (!hit) show = false;
        }

        if (show) {
            card.classList.remove('hidden');
            visibleCount++;
        }
        else card.classList.add('hidden');
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

window.loadCards = loadCards;
window.filterCards = filterCards;
window.toggleDescriptionV2 = toggleDescriptionV2;
window.selectBranch = selectBranch;
window.selectBrand = selectBrand;
