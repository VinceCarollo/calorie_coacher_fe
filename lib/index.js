import './style/reset.css';
import './style/foods.scss';
import './style/recipes.scss';
import './style/navbar.scss';

$(document).ready(() => {
  let url = document.URL.split('/')
  let file = url[url.length-1]

  if (file === 'index.html' || file === '') {
    loadFoodsPage();
  } else if (file === 'recipes.html') {
    loadRecipesPage();
  }

  function loadRecipesPage() {
    $.get('https://calorie-coacher.herokuapp.com/api/v1/foods', (foods, status) => {
      foods.forEach(food => {
        appendFoodTypesToRecipeList(food)
        $.get(`https://calorie-coacher-recipes.herokuapp.com/api/v1/recipes/search?food_type=${food.name.toLowerCase()}`, (recipes, status) => {
          recipes.forEach(recipe => {
            appendRecipeList(recipe, food)
          })
        })
      })
    })
  }

  function loadFoodsPage() {
    $.get('https://calorie-coacher.herokuapp.com/api/v1/foods', (data, status) => {
      data.forEach(food => {
        appendFoodList(food);
      })
    })
  }

  function appendFoodTypesToRecipeList(food) {
    $('#recipe-list').append(`
      <section class='food-type-recipe-header'>
        <h1>${food.name} Recipes</h1>
      </section>
      <section id='food-${food.id}'></section>
      `)
  }

  function appendRecipeList(recipe, food) {
    $(`#food-${food.id}`).append(`
      <section class='recipe'>
        <a href='${recipe.url}'><img src="${recipe.image}" alt="${recipe.name} recipe image"></a>
        <section class='recipe-info'>
          <a href='${recipe.url}'><h3>${recipe.name}</h3></a>
          <p>Calories: ${recipe.calories}</p>
          <p>Prep Time: ${recipe.prepTime} minutes</p>
          <p>Number of Ingredients: ${recipe.numIngredients}</p>
          <p>Servings: ${recipe.servings}</p>
          <p>Type: ${recipe.cuisineType.charAt(0).toUpperCase() + recipe.cuisineType.slice(1)}</p>
        </section>
      </section>
      `)
  }

  function appendFoodList(food) {
    $('#food-list').append(`
      <section class='food'>
        <h3>${food.name}</h3>
        <p>${food.calories} Calories</p>
        <button type="button" class="default-button delete-food" id='delete-food-${food.id}'>Remove</button>
      </section><br>
      `)
  }

  function showFlashMessage(message) {
    $('#new-food-form').prepend(`
      <p id='flash-message' style='text-align:center;'></p>
      `)
      $('#flash-message').html(message);
      $('#flash-message').slideDown('slow');
      setTimeout(() => {
        $('#flash-message').remove('');
      }, 3000)
  }

  $('#food-submit-button').click(() => {
    let food = {
      name: $('#name-input').val(),
      calories: $('#calorie-input').val()
    }
    $('#name-input').val('');
    $('#calorie-input').val('');
    $.post('https://calorie-coacher.herokuapp.com/api/v1/foods', food)
      .done(() => {
        appendFoodList(food)
      })
      .fail(() => {
        showFlashMessage('Invalid Food Entered')
      })
  })

  $('#main-foods').on('click', '.delete-food', (event) => {
    let elementId = event.target.id.split('-')
    let foodId = elementId[elementId.length - 1]
    $.ajax({
      url: `https://calorie-coacher.herokuapp.com/api/v1/foods/${foodId}`,
      type: 'DELETE'
    })
    .done(() => {
      $(`#${event.target.id}`).parent().remove();
      showFlashMessage("Successfully Deleted")
    })
    .fail(() => {
      showFlashMessage("Food Not Deleted")
    })
  })
});
