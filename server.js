var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var PORT = process.env.PORT || 3000
var todoNextId = 1
var _ = require('underscore')
var db = require('./db.js')

var todos = []

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root')
})

app.get('/todos', function(req, res) {
	var queryParams = req.query
	var filteredTodos = todos

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {
			completed: true
		})
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {
			completed: false
		})
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function(todo) {
			if (todo.description.toLowerCase.indexOf(queryParams.q.toLowerCase) > -1) {
				return true
			} else {
				return false
			}

		})

	};


	res.json(filteredTodos)
})

app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10)
	var matchedIdTodo = _.findWhere(todos, {
		id: todoId
	})

	if (typeof matchedIdTodo == 'undefined') {

		res.status(404).send()
	} else {
		res.json(matchedIdTodo)
	}
})

// POST /todos/
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed')

db.todo.create(body).then(function(todo){
	res.json(todo.toJSON())
}, function (e){
	res.status(400).json(e)
})


	// if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {

	// 	return res.status(400).send();
	// }
	// body.description = body.description.trim()

	// body.id = todoNextId
	// todoNextId++
	// todos.push(body)

	// res.json(body)
})

app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10)
	var matchedIdTodo = _.findWhere(todos, {
		id: todoId
	})

	if (!matchedIdTodo) {
		res.status(404).json({
			"error": "no todo found with that id"
		})
	} else {
		todos = _.without(todos, matchedIdTodo)
		res.json(todos)
	}
})

app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10)
	var matchedIdTodo = _.findWhere(todos, {
		id: todoId
	})
	var body = _.pick(req.body, 'description', 'completed')
	var validAttributes = {}

	if (!matchedIdTodo) {
		res.status(404).json({
			"error": "no todo found with that id"
		})
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send()
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send()
	}

	_.extend(matchedIdTodo, validAttributes)
	res.json(matchedIdTodo)
})

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("Express server listening on port " + PORT + "!")
	})
})