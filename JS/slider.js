
const slidesData = [
    {
        image: '/img/Said-Sadiq-Fittary-Garok.jpg',
        link: 'https://wa.me/9647719486880?text=سڵاو%20من%20لە%20سەیارە%20ئەپەوە%20هاتووم%20و%20پێویستم%20بە%20زانیاری%20زیاتر%20لەسەر%20خزمەتگوزارییەکانتان'
    },
    { 
        image: '/img/Goran-Fittary-Garok-Suly.jpg',
        link: 'https://wa.me/9647701517198?text=سڵاو%20من%20لە%20سەیارە%20ئەپەوە%20هاتووم%20و%20پێویستم%20بە%20زانیاری%20زیاتر%20لەسەر%20خزمەتگوزارییەکانتان' 
    },
    { 
        image: '/img/Zanyar-Services-Suly.jpg',
        link: 'https://wa.me/9647704750101?text=سڵاو%20من%20لە%20سەیارە%20ئەپەوە%20هاتووم%20و%20پێویستم%20بە%20زانیاری%20زیاتر%20لەسەر%20خزمەتگوزارییەکانتان' 
    },
    { 
        image: 'https://placehold.co/800x400/f84269/ffffff?text=Ad+Banner+3+Click+Here',
        link: 'https://wa.me/9647701455471?text=سڵاو%20من%20لە%20سەیارە%20ئەپەوە%20هاتووم%20و%20پێویستم%20بە%20زانیاری%20زیاتر%20لەسەر%20خزمەتگوزارییەکانتان' 
    },
    { 
        image: 'https://placehold.co/800x400/2a2a2a/4facfe?text=Ad+Banner+4',
        link: 'https://wa.me/9647701455471?text=سڵاو%20من%20لە%20سەیارە%20ئەپەوە%20هاتووم%20و%20پێویستم%20بە%20زانیاری%20زیاتر%20لەسەر%20خزمەتگوزارییەکانتان' 
    },
    { 
        image: 'https://placehold.co/800x400/121212/f84269?text=Ad+Banner+5',
        link: 'https://wa.me/9647701455471?text=سڵاو%20من%20لە%20سەیارە%20ئەپەوە%20هاتووم%20و%20پێویستم%20بە%20زانیاری%20زیاتر%20لەسەر%20خزمەتگوزارییەکانتان' 
    },
];

// ============================================
// SLIDER LOGIC
// ============================================
let slideIndex = 0;
let slideInterval;

function renderSlider() {
    const wrapper = document.querySelector('.slider-wrapper');
    const thumbContainer = document.querySelector('.slider-thumbnails');
    
    if (!wrapper || !thumbContainer) return;

    // Clear existing content
    wrapper.innerHTML = '';
    thumbContainer.innerHTML = '';

    slidesData.forEach((slide, index) => {
        // Create Slide
        const slideDiv = document.createElement('div');
        slideDiv.className = `slide ${index === 0 ? 'active' : ''}`;
        
        // Wrap in link if provided
        let content = `<img src="${slide.image}" alt="Ad ${index + 1}">`;
        if (slide.link && slide.link !== '#') {
            content = `<a href="${slide.link}">${content}</a>`;
        }
        slideDiv.innerHTML = content;
        wrapper.appendChild(slideDiv);

        // Create Thumbnail
        const thumbDiv = document.createElement('div');
        thumbDiv.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbDiv.onclick = () => currentSlide(index);
        // Use the same image for thumbnail, css will size it down
        thumbDiv.innerHTML = `<img src="${slide.image}" alt="Thumb ${index + 1}">`;
        thumbContainer.appendChild(thumbDiv);
    });
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (slides.length === 0) return;

    if (index >= slides.length) slideIndex = 0;
    if (index < 0) slideIndex = slides.length - 1;
    
    slides.forEach(slide => slide.classList.remove('active'));
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    
    if (slides[slideIndex]) slides[slideIndex].classList.add('active');
    if (thumbnails[slideIndex]) thumbnails[slideIndex].classList.add('active');
}

function moveSlide(n) {
    clearInterval(slideInterval); // Reset timer on manual interaction
    slideIndex += n;
    showSlide(slideIndex);
    startAutoPlay();
}

function currentSlide(n) {
    clearInterval(slideInterval);
    slideIndex = n;
    showSlide(slideIndex);
    startAutoPlay();
}

function startAutoPlay() {
    // Clear any existing interval to prevent multiples
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        slideIndex++;
        showSlide(slideIndex);
    }, 5000); // Change image every 5 seconds
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderSlider(); // Generate HTML first
    startAutoPlay();
});
