import './style/reset.css';
import './style/foods.scss';
import './style/navbar.scss';

$(document).ready(() => {
  loadPage();

  function loadPage() {
    let foods = $.get('https://calorie-coacher.herokuapp.com/api/v1/foods', (data, status) => {
      data.forEach(food => {
        appendFoodList(food);
      })
    })
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
