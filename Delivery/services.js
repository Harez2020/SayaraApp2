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
        phoneNumbers = `<strong><span class="field-label"> ژمارە مۆبایل : </span>${phones[0]}</strong>`;
    } else if (phones.length >= 2) {
        phoneNumbers = `<strong><span class="field-label"> ژمارە مۆبایل : </span>${phones[0]} <br>: ${phones[1]}</strong>`;
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
    const waText = 'سڵاو، دەمەوێت زانیاری زیاتر وەربگرم دەربارەی خزمەتگوزاریەکەتان';
    const waHref = whatsappNumber ? `https://wa.me/${encodeURIComponent(whatsappNumber)}?text=${encodeURIComponent(waText)}` : '#';

    return `
    <div class="card" data-search="${service.searchKey}">
        <div class="logo">
            <img src="${imageSrc}" alt="${encodedTitle}">
        </div>
        <div class="text">
            <h2 class="title">${service.title}</h2>
            <div class="description-container">
                <p class="description preview"><strong>${service.preview}</strong></p>
                <p class="description full-view"><strong>${service.description}</strong></p>
            </div>
            <div class="ReadMore" onclick="toggleDescription(this)">زانیاری زیاتر بزانە...</div>
            <p class="location"><strong><span class="field-label"> شوێنی کارکردن: </span>${service.location}</strong></p>
            <p class="phone">${phoneNumbers}</p>
            <p class="time">${workHours}</p>
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

// Function to load and display all cards
async function loadCards() {
    const servicesData = await loadServicesData();
    const cardsContainer = document.getElementById('cardsContainer');
    let cardsHTML = '';
    
    servicesData.forEach(service => {
        cardsHTML += generateCardHTML(service);
    });
    
    cardsContainer.innerHTML = cardsHTML;
}

// Toggle description visibility
function toggleDescription(element) {
    const descriptionContainer = element.previousElementSibling;
    descriptionContainer.classList.toggle('expanded');
}

// Filter cards based on selected criteria
function filterCards() {
    // Get selected values
    const locationFilter = document.getElementById('locationFilter').value;
    const serviceFilter = document.getElementById('serviceFilter').value;
    
    // Get all cards
    const cards = document.querySelectorAll('.card');
    
    // Pre-normalize filters
    const normalizedLocationFilter = normalizeForSearch(locationFilter);

    // map serviceFilter keys to likely keywords (Kurdish/Arabic + english)
    const serviceKeywordsMap = {
        mechanic: ['mechanic', 'فیتەر', 'فیتەری', 'میکانیك', 'میکانیک'],
        car_wash: ['car wash', 'غەسل', 'شۆردن', 'غسل', 'شستن'],
        fuel_pump: ['fuel', 'pump', 'فیت پەمپ', 'پەمپ'],
        tire: ['tire', 'وایەرمەن', 'لاتە'],
        transport: ['transport', 'فلات', 'کرێن', 'بارکردن', 'گواستنەوە'],
        locksmith: ['locksmith', 'کلیل', 'دەرگا', 'قفل']
    };

    cards.forEach(card => {
        let showCard = true;
        const search = card.dataset.search || '';

        // Location filter (use precomputed searchKey)
        if (locationFilter !== 'all') {
            if (!search.includes(normalizedLocationFilter)) {
                showCard = false;
            }
        }

        // Service filter
        if (serviceFilter !== 'all' && showCard) {
            const keywords = serviceKeywordsMap[serviceFilter] || [serviceFilter];
            const hasMatch = keywords.some(k => search.includes(normalizeForSearch(k)));
            if (!hasMatch) showCard = false;
        }

        if (showCard) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// Export functions for use in other files
window.loadServicesData = loadServicesData;
window.generateCardHTML = generateCardHTML;
window.loadCards = loadCards;
window.toggleDescription = toggleDescription;
window.filterCards = filterCards;