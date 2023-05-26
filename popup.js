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
                console.log(searchText.split(' '))
                const found = searchText.split(' ').every(term => titleLowerCase.includes(term));
            
                if (found) {
                    const link = document.createElement('a');
                    link.href = bookmark.url;
                    link.textContent = bookmark.title;
                    link.target = '_blank';
                    link.style.display = 'block';
    
                    // Use the bookmark's index in the search results as its position
                    const position = results.indexOf(bookmark);
    
                    matches.push({ link, position });
                    console.log('matches', matches)
                }
            }
        });

        matches
            .sort((a, b) => {
                aPos = 
                console.log('sort', a.position, b.position)
                return a.position - b.position})
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
