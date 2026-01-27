document.getElementById('partRequestForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Gather form data
    const phone = this.querySelector('input[type="tel"]').value;
    const partName = this.querySelector('input[type="text"]').value;
    const quality = this.querySelector('select').value;
    
    // For now, just show an alert or log
    console.log('Form Submitted', { phone, partName, quality });
    alert('سوپاس بۆ داواکاریەکەت! بەم زوانە پەیوەندیت پێوە دەکەین.');
    
    // TODO: Implement actual submission (e.g. to WhatsApp or Backend)
});

// File upload preview logic (optional enhancement)
document.querySelectorAll('.upload-area input[type="file"]').forEach(input => {
    input.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const fileName = this.files[0].name;
            const p = this.parentElement.querySelector('p');
            if (p) p.textContent = `فایلی هەڵبژێردراو: ${fileName}`;
        }
    });
});
