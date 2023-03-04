// Get elements from the DOM
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const searchHistoryList = document.querySelector('#search-history-list');
const clearHistoryBtn = document.querySelector('#clear-history-btn');
const bookList = document.querySelector('#book-list');
const errorMessage = document.querySelector('#error-message');
const bookListDiv = document.querySelector('.books-list-title');
// Initialize the search history from localStorage
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Render the search history
function renderSearchHistory() {
    searchHistoryList.innerHTML = '';
    searchHistory.forEach(query => {
        const li = document.createElement('li');
        li.textContent = query;
        li.addEventListener('click', () => {
            searchBooks(query);
        });
        searchHistoryList.appendChild(li);
    });
}

renderSearchHistory();

// Save the search query to localStorage and update the search history
function saveSearchQuery(query) {
    if (!searchHistory.includes(query)) {
        searchHistory.push(query);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        renderSearchHistory();
    }
}

// Clear the search history from localStorage and the UI
function clearSearchHistory() {
    searchHistory = [];
    localStorage.removeItem('searchHistory');
    renderSearchHistory();
}

clearHistoryBtn.addEventListener('click', () => {
    clearSearchHistory();

});

// Fetch book data from the Google Books API
async function searchBooks(query) {
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
        const data = await response.json();
        if (data.items) {

            bookListDiv.innerHTML = `<h2 class='search-title'>Book Results For '${query}'</h2>`;
            bookList.innerHTML = '';
            data.items.forEach(book => {
                const li = document.createElement('li');
                const img = document.createElement('img');
                const h3 = document.createElement('h3');
                const p1 = document.createElement('p');
                const p2 = document.createElement('p');
                const p3 = document.createElement('p');
                const p4 = document.createElement('p');
                const a = document.createElement('a');
                if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.smallThumbnail) {
                    img.src = book.volumeInfo.imageLinks.smallThumbnail;
                } else {
                    img.src = 'https://via.placeholder.com/128x192.png?text=No+Image';
                }
                h3.textContent = book.volumeInfo.title;
                p1.textContent = `Author: ${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown'}`;
                p2.textContent = `Publisher: ${book.volumeInfo.publisher || 'Unknown'}`;
                p3.textContent = `Published Date: ${book.volumeInfo.publishedDate || 'Unknown'}`;
                p4.textContent = `Page Count: ${book.volumeInfo.pageCount || 'Unknown'}`;
                a.href = book.volumeInfo.infoLink;
                a.textContent = 'Learn More';
                li.appendChild(img);
                li.appendChild(h3);
                li.appendChild(p1);
                li.appendChild(p2);
                li.appendChild(p3);
                li.appendChild(p4);
                li.appendChild(a);
                bookList.appendChild(li);
            });
            errorMessage.textContent = '';
            saveSearchQuery(query);
        } else {
            errorMessage.textContent = 'No results found. Please try a different search query.';
        }
    } catch (error) {
        console.error(error);
        errorMessage.textContent = 'An error occurred while fetching data. Please try again later.';
    }
}

// Handle form submission
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        searchBooks(query);
        searchInput.value = '';
    }
});
