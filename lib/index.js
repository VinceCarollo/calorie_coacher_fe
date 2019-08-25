import style from './foods.scss';

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
        <p>Calories: ${food.calories}</p>
      </section>
      `)
  }

  $('#test').append(`
    <p>hi<p>
    `)
});
