function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const container = document.getElementById('favoritesContainer');
  container.innerHTML = '';

  // Show a message if no favorites are found
  if (favorites.length === 0) {
    container.innerHTML = '<p>Your favorites list is empty.</p>';
    return;
  }
  // Card of Favorites for each saved recipe
  favorites.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe_card');
    recipeCard.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <div class="recipe_info">
        <h3><a href="recipe_info.html?id=${recipe.id}">${recipe.title}</a></h3>
        <button class="remove_btn" onclick="removeFromFavorites(${recipe.id})">Remove</button>
      </div>
    `;
    container.appendChild(recipeCard);
  });
}

function removeFromFavorites(recipeId) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const updatedFavorites = favorites.filter(recipe => recipe.id !== recipeId);
  localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  loadFavorites(); // Re-load the favorites after removing an item
}

loadFavorites();
