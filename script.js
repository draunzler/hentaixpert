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
document.getElementById('search-button').addEventListener('click', function () {
    var searchTerm = document.getElementById('search-input').value
    // You can replace this with your actual search logic
    // For this example, let's assume you have predefined search results
    var searchResults = [
        { link: 'https://nhentai.net/search/?q=' + searchTerm, logo: 'https://i.kym-cdn.com/entries/icons/original/000/026/029/n.png' },
        { link: 'https://rule34.xxx/index.php?page=post&s=list&tags=' + searchTerm.replace(/\s+/g, '_'), logo: 'https://rule34.xxx/images/header2.png' },
        { link: 'https://www.xvideos.com/?k=' + searchTerm, logo: 'XVideos-Logo.png' },
        { link: 'https://www.pornhub.com/video/search?search=' + searchTerm, logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Pornhub-logo.svg/297px-Pornhub-logo.svg.png' }
    ];
    // Clear previous search results
    clearSearchResults();
    // Display the new search results
    displaySearchResults(searchResults);
});
function clearSearchResults() {
    var resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // Clear previous search results
}
function displaySearchResults(results) {
    var resultsContainer = document.getElementById('search-results');
    results.forEach(function (result) {
        var resultDiv = document.createElement('div');
        resultDiv.classList.add('result')
        var resultImage = document.createElement('img');
        resultImage.src = result.logo;
    
        var resultLink = document.createElement('a');
        resultLink.href = result.link;
        resultLink.textContent = 'Take Me ⬈';
        // Open the link in a new tab/window
        resultLink.target = '_blank';
        resultDiv.appendChild(resultImage);
        resultDiv.appendChild(resultLink);
        resultsContainer.appendChild(resultDiv);
    });
}
function redirect() {
    var randomNumber = Math.floor(1 + Math.random() * 489096);
    var redirectURL = 'https://www.nhentai.net/g/' + randomNumber;
    window.location.href = redirectURL;
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