var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var PORT = process.env.PORT || 3000
var todoNextId = 1
var _ = require('underscore')

var todos = []
//comment
app.use(bodyParser.json());

app.get('/', function (req, res){
	res.send('Todo API Root')
})

// Get /todos
app.get('/todos', function (req, res){
	res.json(todos)
})

app.get('/todos/:id', function (req, res){
	var todoId = parseInt(req.params.id, 10)
	var matchedIdTodo = _.findWhere(todos, {id: todoId})

	if (typeof matchedIdTodo == 'undefined'){

		res.status(404).send()
	} else {
		res.json(matchedIdTodo)
	}
})

// POST /todos/
app.post('/todos', function (req, res){
	var body = _.pick(req.body,'description','completed')

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0 ){

		return res.status(400).send();
	}
	body.description = body.description.trim()

	body.id = todoNextId
	todoNextId++
	todos.push(body)

	res.json(body)
})

app.delete('/todos/:id', function (req, res){
	var todoId = parseInt(req.params.id, 10)
	var matchedIdTodo = _.findWhere(todos, {id: todoId})
	
	if (!matchedIdTodo){
		res.status(404).json({"error": "no todo found with that id"})
	} else {
	todos = _.without(todos,matchedIdTodo)

	res.json(todos)
	}

})


app.listen(PORT, function(){

	console.log("Express server listening on port " + PORT +"!")

})