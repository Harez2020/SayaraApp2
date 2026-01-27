// ============================================
// ADS/SLIDER CONFIGURATION
// ============================================
// To add/remove slides, just edit this array.
// image: The URL of the ad image.
// link: (Optional) URL to open when clicked.
const slidesData = [
    { 
        image: 'https://placehold.co/800x400/121212/f84269?text=Ad+Banner+1',
        link: '#' 
    },
    { 
        image: 'https://placehold.co/800x400/2a2a2a/4facfe?text=Ad+Banner+2',
        link: '#' 
    },
    { 
        image: 'https://placehold.co/800x400/f84269/ffffff?text=Ad+Banner+3',
        link: '#' 
    }
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
