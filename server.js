var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var PORT = process.env.PORT || 3000
var todoNextId = 1

var todos = []

app.use(bodyParser.json());

app.get('/', function (req, res){
	res.send('Todo API Root')
})

// Get /todos
app.get('/todos', function (req, res){
	res.json(todos)
})

app.get('/todos/:id', function (req, res){
	var todoId = req.params.id
	var matchIdtodo

	todos.forEach(function (todo) {
		if (todo.id == todoId) {
			matchIdtodo = todo
		};
	})

	if (typeof matchIdtodo == 'undefined'){

		res.status(404).send()
	} else {
		res.json(matchIdtodo)
	}
})

// POST /todos/
app.post('/todos', function (req, res){
	var body = req.body
	body.id = todoNextId
	todoNextId++
	todos.push(body)


	// console.log('description: ' + body.description)

	res.json(body)

	console.log(todos)


})


app.listen(PORT, function(){

	console.log("Express server listening on port " + PORT +"!")

})