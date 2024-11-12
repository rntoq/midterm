const apiKey = '6f51bae8764cdf47a790d0c2a4ef22e0';
const apiUrl = 'https://api.themoviedb.org/3/search/movie';
const movieDetailsUrl = 'https://api.themoviedb.org/3/movie';
const imgUrl = 'https://image.tmdb.org/t/p/w500';
const searchInput = document.getElementById('searchInput');
const suggestionsContainer = document.createElement('div');
suggestionsContainer.classList.add('suggestions');
searchInput.parentNode.appendChild(suggestionsContainer);

// Event listener for search button
document.getElementById('searchBtn').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value;
  if (query) {
    fetchMovies(query);
  }
});
let debounceTimeout;

// Event listener for typing in the search input
searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimeout);
  const query = searchInput.value.trim();

  if (query.length > 2) { // Start suggesting after 3 characters
    debounceTimeout = setTimeout(() => {
      fetchSuggestions(query);
    }, 300); // 300ms delay for debounce
  } else {
    suggestionsContainer.innerHTML = ''; // Clear suggestions if query is too short
  }
});
async function fetchSuggestions(query) {
  try {
    const response = await fetch(`${apiUrl}?api_key=${apiKey}&query=${query}&page=1`);
    if (!response.ok) throw new Error("Failed to fetch suggestions.");
    const data = await response.json();
    displaySuggestions(data.results);
  } catch (error) {
    console.error(error);
  }
}

// Display suggestions in a dropdown below the search input
function displaySuggestions(suggestions) {
  suggestionsContainer.innerHTML = '';
  suggestions.forEach(suggestion => {
    const suggestionItem = document.createElement('div');
    suggestionItem.classList.add('suggestion_item');
    suggestionItem.innerText = suggestion.title; // Display movie title
    suggestionItem.addEventListener('click', () => {
      searchInput.value = suggestion.title; // Fill search input with selected suggestion
      suggestionsContainer.innerHTML = ''; // Clear suggestions
      fetchMovies(suggestion.title); // Fetch movies based on selected suggestion
    });
    suggestionsContainer.appendChild(suggestionItem);
  });
}

async function fetchMovies(query) {
  try {
    const response = await fetch(`${apiUrl}?api_key=${apiKey}&query=${query}`);
    if (!response.ok) throw new Error('Failed to fetch movies.');

    const data = await response.json();
    if (data.results.length === 0) {
      moviesContainer.innerHTML = `<a class="watchlist_link" href="movie.html">View Watchlist</a><br><h2>Movies not found</h2>`;
    } else {
      moviesContainer.innerHTML = ``;
      displayMovies(data.results);
    }
  } catch (error) {
    console.error(error);
    alert('Could not fetch movies. Please try again later.');
  }
}

function displayMovies(movies) {
  const container = document.getElementById('moviesContainer');
  container.innerHTML = '';
  suggestionsContainer.innerHTML = `<a class="watchlist_link" href="movie.html">View Watchlist</a>`;
  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie_card');
    movieCard.innerHTML = `
      <a class="movie_link" onclick="viewDetails(${movie.id})">
        <img src="${imgUrl}${movie.poster_path}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <div>
        <p>${movie.release_date}</p>
        <button class="save_btn" onclick="addToWatchlist(${movie.id}, '${movie.title}', '${imgUrl}${movie.poster_path}')">Save</button>
        </div>
      </a>`;
    container.appendChild(movieCard);
  });
}

async function viewDetails(movieId) {
  try {
    const response = await fetch(`${movieDetailsUrl}/${movieId}?api_key=${apiKey}`);
    if (!response.ok) throw new Error('Failed to fetch movie details.');
    const movie = await response.json();
    displayMovieDetails(movie);
  } catch (error) {
    console.error(error);
    alert('Could not load movie details.');
  }
}

function displayMovieDetails(movie) {
  const detailsContainer = document.getElementById('movieDetails');
  detailsContainer.innerHTML = `
    <div class="movie_info_card">
        <img src="${imgUrl}${movie.poster_path}" alt="${movie.title}">
    </div>
    <div class="movie_info_card">
        <h2>${movie.title}</h2>
        <p>${movie.overview}</p>
        <h4>Runtime: ${movie.runtime} minutes</h4>
        <h4>Release Date: ${movie.release_date}</h4>
        <h3>Rating: ${movie.vote_average}</h3>
    </div>
  `;

  // Show modal
  document.getElementById('modal').style.display = 'block';
}

document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});

// Watchlist
function addToWatchlist(id, title, image) {
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  if (!watchlist.some(movie => movie.id === id)) {
    watchlist.push({ id, title, image });
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    alert('Added to watchlist');
  } else {
    alert('This movie is already in your watchlist.');
  }
}

function loadWatchlist() {
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  const container = document.getElementById('moviesContainer');
  container.innerHTML = '';
  watchlist.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie_card');
    movieCard.innerHTML = `
      <img src="${movie.image}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <div>
      <button class="watchlist_btn" onclick="viewDetails(${movie.id})">Details</button>
      <button class="watchlist_btn" onclick="removeFromWatchlist(${movie.id})">Remove</button>
      </div>
    `;
    container.appendChild(movieCard);
  });
}

function removeFromWatchlist(movieId) {
  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  watchlist = watchlist.filter(movie => movie.id !== movieId);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  loadWatchlist();
}

// Load watchlist if needed
loadWatchlist();
