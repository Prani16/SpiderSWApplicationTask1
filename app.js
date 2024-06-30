// Sample ingredients
const ingredients = ["Penne Pasta", "bread", "vegetables", "Parmesan Cheese", "flour", "Tomatoes", "Onions", "Garlic", "Basil", "Olive Oil","spice powder","cauliflower"];
// Function to load recipes from local storage or default
async function loadRecipes() {
    let recipes = localStorage.getItem('data/recipes.json');
    if (recipes) {
        console.log('Loaded recipes from local storage');
        return JSON.parse(recipes);
    } else {
        const response = await fetch('recipes.json');
        const data = await response.json();
        localStorage.setItem('recipes', JSON.stringify(data));
        console.log('Loaded recipes from recipes.json');
        return data;
    }
}

// Function to load favorite recipes
function loadFavorites() {
    let favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
}

// Function to save favorite recipes
function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Display ingredients
const ingredientList = document.getElementById('ingredient-list');
ingredients.forEach(ingredient => {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = ingredient;
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(ingredient));
    ingredientList.appendChild(li);
});

// Function to find matching recipes
async function findRecipes(selectedIngredients) {
    const recipes = await loadRecipes();
    console.log('Finding recipes for selected ingredients:', selectedIngredients);
    const matchedRecipes = recipes.filter(recipe =>
        recipe.ingredients.every(ingredient =>
            selectedIngredients.includes(ingredient)
        )
    );
    console.log('Matched recipes:', matchedRecipes);
    return matchedRecipes;
}

// Function to filter recipes
async function filterRecipes(cuisine, prepTime, diet) {
    const recipes = await loadRecipes();
    console.log('Filtering recipes with', {cuisine, prepTime, diet});
    const filteredRecipes = recipes.filter(recipe =>
        (!cuisine || recipe.cuisine === cuisine) &&
        (!prepTime || recipe.prepTime <= prepTime) &&
        (!diet || recipe.diet === diet)
    );
    console.log('Filtered recipes:', filteredRecipes);
    return filteredRecipes;
}

// Display recipes
function displayRecipes(recipes, container) {
    container.innerHTML = '';
    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe';
        
        const img = document.createElement('img');
        img.src = recipe.image;
        recipeDiv.appendChild(img);
        
        const detailsDiv = document.createElement('div');
        
        const title = document.createElement('h3');
        title.textContent = recipe.name;
        detailsDiv.appendChild(title);
        
        const ingredientsList = document.createElement('p');
        ingredientsList.textContent = `Ingredients: ${recipe.ingredients.join(', ')}`;
        detailsDiv.appendChild(ingredientsList);
        
        const procedure = document.createElement('p');
        procedure.textContent = recipe.procedure;
        detailsDiv.appendChild(procedure);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save to Favorites';
        saveButton.addEventListener('click', () => {
            const favorites = loadFavorites();
            favorites.push(recipe);
            saveFavorites(favorites);
            alert('Recipe saved to favorites!');
        });
        detailsDiv.appendChild(saveButton);

        recipeDiv.appendChild(detailsDiv);
        container.appendChild(recipeDiv);
    });
}

// Display favorite recipes
function displayFavorites() {
    const favorites = loadFavorites();
    const favoriteList = document.getElementById('favorite-list');
    displayRecipes(favorites, favoriteList);
}

// Event listener for finding recipes
document.getElementById('find-recipes').addEventListener('click', async () => {
    const selectedIngredients = [];
    document.querySelectorAll('#ingredient-list input:checked').forEach(checkbox => {
        selectedIngredients.push(checkbox.value);
    });
    console.log('Selected ingredients:', selectedIngredients);
    const recipes = await findRecipes(selectedIngredients);
    displayRecipes(recipes, document.getElementById('recipe-list'));
});

// Event listener for filtering recipes
document.getElementById('filter-recipes').addEventListener('click', async () => {
    const cuisine = document.getElementById('cuisine').value;
    const prepTime = document.getElementById('prep-time').value;
    const diet = document.getElementById('diet').value;
    const recipes = await filterRecipes(cuisine, prepTime, diet);
    displayRecipes(recipes, document.getElementById('recipe-list'));
});

// Initial load of favorite recipes
displayFavorites();
