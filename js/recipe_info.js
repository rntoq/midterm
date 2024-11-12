const apiKey = 'aabfee0952ce4f8b920aa30c2c991709';
const recipeId = new URLSearchParams(window.location.search).get('id');
const recipeDetailsUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

// Show a loading spinner while fetching data
const detailsContainer = document.getElementById('recipeDetails');
detailsContainer.innerHTML = '<p>Loading recipe details...</p>';

async function fetchRecipeDetails() {
  if (!recipeId) {
    detailsContainer.innerHTML = '<p>Recipe not found. Please try again.</p>';
    return;
  }

  try {
    const response = await fetch(recipeDetailsUrl);
    if (!response.ok) throw new Error('Failed to fetch recipe details.');

    const recipe = await response.json();
    displayRecipeDetails(recipe);
  } catch (error) {
    console.error(error);
    detailsContainer.innerHTML = '<p>Could not load recipe details. Please try again later.</p>';
  }
}


//Displaying recipe details to section #recipeDetails
function displayRecipeDetails(recipe) {
  document.getElementById('recipeTitle').innerText = recipe.title;
  detailsContainer.innerHTML = `
    <div class="recipe_info_card">
        <img src="${recipe.image}" alt="${recipe.title}">
        <h2>Ingredients:</h2>
        <ul>${recipe.extendedIngredients.map(i => `<li>${i.original}</li>`).join('')}</ul>
    </div>
    <div class="recipe_info_card">
        <h2>Instructions:</h2>
        <p>${recipe.instructions}</p>
        <h2>Nutritional Information:</h2>
        <p>Calories: ${recipe.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount || 'N/A'}</p>
        <p>Protein: ${recipe.nutrition?.nutrients?.find(n => n.name === "Protein")?.amount || 'N/A'}</p>
        <p>Fat: ${recipe.nutrition?.nutrients?.find(n => n.name === "Fat")?.amount || 'N/A'}</p>
    </div>
    `;
}

// Call the function to fetch and display the recipe details
fetchRecipeDetails();
