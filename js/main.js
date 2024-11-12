const apiKey = 'aabfee0952ce4f8b920aa30c2c991709';
const apiUrl = 'https://api.spoonacular.com/recipes/complexSearch';

document.getElementById('searchBtn').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value;
  if (query) {
    fetchRecipes(query);
  }
});
const query = document.getElementById('searchInput').value.trim();


async function fetchRecipes(query) {
  try {
    const response = await fetch(`${apiUrl}?apiKey=${apiKey}&query=${query}`);
    if (!response.ok) throw new Error("Failed to fetch recipes.");
    const data = await response.json();
    if (data.results.length === 0) {
      recipesContainer.innerHTML = `<h2>Recipes not found</h2>`;
    } else {
      displayRecipes(data.results);
    }
  } catch (error) {
    console.error(error);
    alert("Could not fetch recipes. Please try again later.");
  }
}


function displayRecipes(recipes) {
  const container = document.getElementById('recipesContainer');
  container.innerHTML = '';
  recipes.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe_card');
    recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="recipe_info">
                <h3><a href="recipe_info.html?id=${recipe.id}">${recipe.title}</a></h3>
                <button class="save_btn" onclick="addToFavorites(${recipe.id}, '${recipe.title}', '${recipe.image}')">Save</button>
            </div>`;
    container.appendChild(recipeCard);
  });
}


function addToFavorites(id, title, image) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites.some(recipe => recipe.id === id)) {
    favorites.push({ id, title, image });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Added to favorites');
    document.querySelector("button").style.backgroundColor="#f7ff00";
  } else {
    alert('This recipe is already in your favorites.');
  }
}
