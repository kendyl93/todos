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

  const updateTodo = function(id, data, cb) {
    $.ajax({
      url: '/api/todos/' + id,
      type: 'PUT',
      data: data,
      dataType: 'json',
      success: function(data) {
        cb();
      }
    });
  };

  const deleteTodo = function(id, cb) {
    $.ajax({
      url: '/api/todos/' + id,
      type: 'DELETE',
      data: {
        _id: id
      },
      dataType: 'json',
      success: function(data) {
        cb();
      }
    });
  };

  const deleteTodoLi = function($li) {
    $li.remove();
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

  $('ul').on('change', 'li :checkbox', function() {
    const $this = $(this),
      $input = $this[0],
      $li = $this.parent(),
      id = $li.attr('id'),
      checked = $input.checked,
      data = { done: checked };
    updateTodo(id, data, function(d) {
      $this.next().toggleClass('checked');
    });
  });

  $('ul').on('keydown', 'li span', function(e) {
    const $this = $(this),
      $span = $this[0],
      $li = $this.parent(),
      id = $li.attr('id'),
      key = e.keyCode,
      target = e.target,
      text = $span.innerHTML,
      data = { text: text };
    $this.addClass('editing');
    if (key === 27) {
      //escape key
      $this.removeClass('editing');
      document.execCommand('undo');
      target.blur();
    } else if (key === 13) {
      //enter key
      updateTodo(id, data, function(d) {
        $this.removeClass('editing');
        target.blur();
      });
      e.preventDefault();
    }
  });

  $('ul').on('click', 'li a', function() {
    const $this = $(this),
      $input = $this[0],
      $li = $this.parent(),
      id = $li.attr('id');

    deleteTodo(id, function(e) {
      deleteTodoLi($li);
    });
  });

  const updateTodoCount = function() {
    $('.count').text($('li').length);
  };

  const initTodoObserver = function() {
    var target = $('ul')[0];
    var config = { attributes: true, childList: true, characterData: true };
    var observer = new MutationObserver(function(mutationRecords) {
      $.each(mutationRecords, function(index, mutationRecord) {
        updateTodoCount();
      });
    });
    if (target) {
      observer.observe(target, config);
    }
    updateTodoCount();
  };

  initTodoObserver();
});
