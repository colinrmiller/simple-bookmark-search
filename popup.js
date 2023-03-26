const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');
let selectedIndex = 0;

searchInput.addEventListener('input', (event) => {
    const searchText = event.target.value.trim().toLowerCase();
    resultsDiv.innerHTML = '';

    if (!searchText) {
        return;
    }

    chrome.bookmarks.search(searchText, (results) => {
        const matches = [];

        results.forEach((bookmark, index) => {
            if (bookmark.url && bookmark.url.indexOf('javascript:') !== 0) {
                const titleLowerCase = bookmark.title.toLowerCase();
                const index = titleLowerCase.indexOf(searchText);

                if (index !== -1) {
                    const link = document.createElement('a');
                    link.href = bookmark.url;
                    link.textContent = bookmark.title;
                    link.target = '_blank';
                    link.style.display = 'block';

                    matches.push({ link, index });
                }
            }
        });

        matches
            .sort((a, b) => a.index - b.index)
            .forEach(({ link }, index) => {
                if (index === 0) {
                    link.className = 'result-selected';
                }
                resultsDiv.appendChild(link);
            });
    });
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        debugger
        const children = resultsDiv.children;
        for (let i = 0; i < children.length; i++) {
            if (i === selectedIndex) {
                const firstLink = children[i];
                if (firstLink) {
                    window.open(firstLink.href);
                    window.close();
                }
            }
        };
    }
});

function updateSelectedClass() {
    const children = resultsDiv.children;
    for (let i = 0; i < children.length; i++) {
        children[i].className = i === selectedIndex ? 'result-selected' : 'result';
    }    
}

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectedIndex = Math.max(0, selectedIndex - 1);
    }
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectedIndex = Math.min(resultsDiv.children.length - 1, selectedIndex + 1);
    }

    updateSelectedClass();
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        window.close();
    }
});

searchInput.focus();
