var texts = ['hentai', 'anime', 'anime character', 'genre'];
var currentTextIndex = 0;
var i = 0;
var speed = 100;
function typeWriter() {
  if (i < texts[currentTextIndex].length) {
    document.getElementById("demo").innerHTML += texts[currentTextIndex].charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  } else {
    // Wait for 2000ms before starting to delete
    setTimeout(deleteText, 1500);
  }
}
function deleteText() {
  if (i >= 0) {
    var currentText = texts[currentTextIndex];
    document.getElementById("demo").innerHTML = currentText.substring(0, i);
    i--;
    setTimeout(deleteText, speed);
  } else {
    // Move to the next text in the array
    currentTextIndex++;
    // Reset the index for the next text
    i = 0;
    // If all texts are displayed, you can reset to the beginning or do something else
    if (currentTextIndex === texts.length) {
      currentTextIndex = 0;
    }
    // Call typeWriter again for the next text
    setTimeout(typeWriter, speed);
  }
}
// Call the typeWriter function to start typing
typeWriter();
// Search functionality
let currentPage = 1;
let currentQuery = '';
let isLoading = false;

document.getElementById('search-button').addEventListener('click', function () {
    performSearch();
});

document.getElementById('search-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});

async function performSearch(page = 1) {
    const searchTerm = document.getElementById('search-input').value.trim();
    
    if (!searchTerm || searchTerm.length < 2) {
        showError('Please enter at least 2 characters to search');
        return;
    }

    if (isLoading) return;
    
    try {
        isLoading = true;
        currentQuery = searchTerm;
        currentPage = page;
        
        showLoading();
        
        const response = await fetch(`/api/search?query=${encodeURIComponent(searchTerm)}&page=${page}`);
        
        if (!response.ok) {
            throw new Error(`Search failed: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (page === 1) {
            clearSearchResults();
        }
        
        displaySearchResults(data.results, data);
        
    } catch (error) {
        console.error('Search error:', error);
        showError('Search failed. Please try again.');
    } finally {
        isLoading = false;
        hideLoading();
    }
}
function clearSearchResults() {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';
    resultsContainer.className = 'search-results-grid';
}
function displaySearchResults(results, metadata) {
    const resultsContainer = document.getElementById('search-results');
    
    if (!results || results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h3>No results found</h3>
                <p>Try different keywords or check your spelling</p>
            </div>
        `;
        return;
    }

    results.forEach(function (result) {
        const resultCard = createResultCard(result);
        resultsContainer.appendChild(resultCard);
    });

    // Add pagination if needed
    if (metadata && metadata.total_pages > 1) {
        addPaginationControls(metadata);
    }
}

function createResultCard(result) {
    const card = document.createElement('div');
    card.classList.add('result-card');
    card.setAttribute('data-source', result.source);

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('result-image-container');

    const image = document.createElement('img');
    image.src = result.thumbnail;
    image.alt = result.title;
    image.loading = 'lazy';
    image.onerror = function() {
        this.src = 'https://via.placeholder.com/300x400/cccccc/666666?text=No+Image';
    };

    const overlay = document.createElement('div');
    overlay.classList.add('result-overlay');

    const rating = document.createElement('span');
    rating.classList.add('result-rating');
    rating.textContent = `★ ${result.rating}`;

    const source = document.createElement('span');
    source.classList.add('result-source');
    source.textContent = result.source.toUpperCase();

    overlay.appendChild(rating);
    overlay.appendChild(source);

    imageContainer.appendChild(image);
    imageContainer.appendChild(overlay);

    const content = document.createElement('div');
    content.classList.add('result-content');

    const title = document.createElement('h3');
    title.classList.add('result-title');
    title.textContent = result.title;
    title.title = result.title; // Tooltip for long titles

    const stats = document.createElement('div');
    stats.classList.add('result-stats');

    const views = document.createElement('span');
    views.innerHTML = `👁 ${formatNumber(result.views)}`;

    stats.appendChild(views);

    if (result.pages) {
        const pages = document.createElement('span');
        pages.innerHTML = `📄 ${result.pages}`;
        stats.appendChild(pages);
    }

    if (result.duration) {
        const duration = document.createElement('span');
        duration.innerHTML = `⏱ ${result.duration}`;
        stats.appendChild(duration);
    }

    if (result.resolution) {
        const resolution = document.createElement('span');
        resolution.innerHTML = `📐 ${result.resolution}`;
        stats.appendChild(resolution);
    }

    const tags = document.createElement('div');
    tags.classList.add('result-tags');
    
    if (result.tags && result.tags.length > 0) {
        result.tags.slice(0, 4).forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.classList.add('result-tag');
            tagSpan.textContent = tag;
            tags.appendChild(tagSpan);
        });
    }

    const actions = document.createElement('div');
    actions.classList.add('result-actions');

    const viewButton = document.createElement('button');
    viewButton.classList.add('result-button', 'primary');
    viewButton.textContent = 'View';
    viewButton.onclick = () => viewContent(result);

    const favoriteButton = document.createElement('button');
    favoriteButton.classList.add('result-button', 'secondary');
    favoriteButton.innerHTML = '♡';
    favoriteButton.title = 'Add to favorites';
    favoriteButton.onclick = (e) => {
        e.stopPropagation();
        toggleFavorite(result, favoriteButton);
    };

    actions.appendChild(viewButton);
    actions.appendChild(favoriteButton);

    content.appendChild(title);
    content.appendChild(stats);
    content.appendChild(tags);
    content.appendChild(actions);

    card.appendChild(imageContainer);
    card.appendChild(content);

    return card;
}
async function redirect() {
    try {
        showLoading();
        const response = await fetch('/api/random');
        
        if (!response.ok) {
            throw new Error('Failed to get random content');
        }
        
        const randomContent = await response.json();
        
        clearSearchResults();
        displaySearchResults([randomContent]);
        
        // Update search input to show what was found
        document.getElementById('search-input').value = 'Random Lucky Pick';
        
    } catch (error) {
        console.error('Random content error:', error);
        showError('Failed to get random content. Please try again.');
    } finally {
        hideLoading();
    }
}

// Utility functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function showLoading() {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Searching for content...</p>
        </div>
    `;
}

function hideLoading() {
    const loadingContainer = document.querySelector('.loading-container');
    if (loadingContainer) {
        loadingContainer.remove();
    }
}

function showError(message) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = `
        <div class="error-container">
            <h3>😕 Oops!</h3>
            <p>${message}</p>
            <button onclick="clearSearchResults()" class="retry-button">Clear Results</button>
        </div>
    `;
}

function viewContent(result) {
    // Create modal or new page to view content
    console.log('Viewing content:', result);
    // You can implement a modal here or redirect to a detailed view
    alert(`Viewing: ${result.title}\nSource: ${result.source}\nRating: ${result.rating} stars`);
}

function toggleFavorite(result, button) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.findIndex(fav => fav.id === result.id && fav.source === result.source);
    
    if (index === -1) {
        favorites.push(result);
        button.innerHTML = '♥';
        button.classList.add('favorited');
    } else {
        favorites.splice(index, 1);
        button.innerHTML = '♡';
        button.classList.remove('favorited');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function addPaginationControls(metadata) {
    const resultsContainer = document.getElementById('search-results');
    const paginationDiv = document.createElement('div');
    paginationDiv.classList.add('pagination');
    
    if (metadata.page > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = '← Previous';
        prevButton.onclick = () => performSearch(metadata.page - 1);
        paginationDiv.appendChild(prevButton);
    }
    
    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Page ${metadata.page} of ${metadata.total_pages}`;
    paginationDiv.appendChild(pageInfo);
    
    if (metadata.page < metadata.total_pages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next →';
        nextButton.onclick = () => performSearch(metadata.page + 1);
        paginationDiv.appendChild(nextButton);
    }
    
    resultsContainer.appendChild(paginationDiv);
}
const modeToggle = document.getElementById('modeToggle');
const modeLabel = document.getElementById('modeLabel');

modeToggle.addEventListener('change', () => {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        modeLabel.textContent = 'Light Mode';
    } else {
        modeLabel.textContent = 'Dark Mode';
    }
});