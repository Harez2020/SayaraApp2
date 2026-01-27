document.addEventListener('DOMContentLoaded', function() {
    const contentContainer = document.getElementById('content-container');
    const pageId = document.body.id; // 'page-privacy' or 'page-terms'

    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            let pageData = null;
            if (pageId === 'page-privacy') {
                pageData = data.privacy;
            } else if (pageId === 'page-terms') {
                pageData = data.terms;
            }

            if (pageData) {
                const titleElement = document.createElement('h1');
                titleElement.textContent = pageData.title;
                
                // Optional: Add styling class to title
                // titleElement.classList.add('page-title');

                const bodyElement = document.createElement('div');
                bodyElement.innerHTML = pageData.content;
                bodyElement.classList.add('page-content');

                contentContainer.appendChild(titleElement);
                contentContainer.appendChild(bodyElement);
            }
        })
        .catch(error => {
            console.error('Error loading content:', error);
            contentContainer.innerHTML = '<p>Error loading content.</p>';
        });
});
