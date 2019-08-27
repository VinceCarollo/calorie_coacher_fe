import './style/reset.css';
import './style/foods.scss';
import './style/navbar.scss';

$(document).ready(() => {
  var foods = $.get('https://calorie-coacher.herokuapp.com/api/v1/foods', (data, status) => {
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
        $('body').append(`
          <p style='text-align:center;'>Food Not Created</p>
          `)
      })
  })
});
