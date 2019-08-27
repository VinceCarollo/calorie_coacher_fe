import './style/reset.css';
import './style/foods.scss';
import './style/navbar.scss';

$(document).ready(() => {
  var foods = $.get('http://localhost:3000/api/v1/foods', (data, status) => {
    data.forEach(food => {
      appendFoodList(food)
    })
  })

  function appendFoodList(food) {
    $('#food-list').append(`
      <section class='food'>
        <h3>${food.name}</h3>
        <p>${food.calories} Calories</p>
      </section><br>
      `)
  }
});
