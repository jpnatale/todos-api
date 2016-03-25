var express = require('express')
var app = express()
var PORT = process.env.PORT || 3000
var todos = [{
	id: 1,
	description: 'Meet mom for lunch',
	completed: false
}, {
	id: 2,
	description: 'Go to market',
	completed: false
}, {
	id: 3,
	description: 'Do laundry',
	completed: true
}]

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
		res.send(matchIdtodo)
	}
})

// GET /todos/id

app.listen(PORT, function(){

	console.log("Express server listening on port " + PORT +"!")

})