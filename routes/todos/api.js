const express = require('express');
const router = express.Router();

const Todo = require('../../models/todos');

router
  .route('/')
  .get(function(req, res, next) {
    Todo.findAsync({})
      .then(function(todos) {
        res.json(todos);
      })
      .catch(next)
      .error(console.error);
  })
  .post(function(req, res, next) {
    const todo = new Todo();
    todo.text = req.body.text;
    todo
      .saveAsync()
      .then(function(todo) {
        console.log('success');
        res.json({ status: 'success', todo: todo });
      })
      .catch(function(e) {
        console.log('fail');
        res.json({ status: 'error', error: e });
      })
      .error(console.error);
  });

router.route('/:id').get(function(req, res, next) {
  Todo.findOneAsync({ _id: req.params.id }, { text: 1, done: 1 })
    .then(function(todo) {
      res.json(todo);
    })
    .catch(next)
    .error(console.error);
});

module.exports = router;
