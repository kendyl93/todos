const $ = require('jquery');
const todoTemplate = require('../views/partials/todo.hbs');

$(function() {
  const addTodo = function() {
    const text = $('#add-todo-text').val();
    console.log({ text });
    $.ajax({
      url: '/api/todos',
      type: 'POST',
      data: { text },
      dataType: 'json',
      success: function(data) {
        const { todo } = data;

        if (todo) {
          const newLiHtml = todoTemplate(todo);
          $('form + ul').append(newLiHtml);
          $('#add-todo-text').val('');
        }
      }
    });
  };

  $(':button').on('click', addTodo);

  $(':text').on('keypress', function(e) {
    const key = e.keyCode;
    if (key == 13 || key == 169) {
      addTodo();
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });

  $('input').on('click', function() {
    $(this)
      .parent()
      .toggleClass('checked');
  });
});
