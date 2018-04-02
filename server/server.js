const express      = require("express"),
	  { ObjectID } = require("mongodb"),
	  bodyParser   = require("body-parser");

const { mongoose } = require('./db/mongoose'),
	  { User }	   = require('./models/User'),
	  { Todo }	   = require('./models/Todo');
	  
let app = express();

app.use(bodyParser.json());
app.set("port", process.env.PORT || 8080);

app.get("/todos", (req, res) => {
	Todo.find()
		.then((todos) => {
			if (users.length === 0) {
				return console.log("No todos found");
			}

			res.send({ todos });
		},(e) => {
			res.status(400).send("could not fetch todos");
		});
});

app.post("/todos", (req, res) => {
	let todo = new Todo({
		text: req.body.text
	});
	
	todo.save()
		.then((doc) => {
			res.send(doc);
		}, (e) => {
			res.status(400).send("Unable to save todo");
		});
});

app.get("/todos/:id", (req, res) => {
	if (!ObjectID.isValid(req.params.id)) {
		return res.status(404).send();
	}

	Todo.findById(req.params.id)
	.then((todo) => {
		if (todo === null) {
			return res.status(404).send();
		}

		res.send({ todo });
	},(e) => {
		res.status(400).send();
	});
});

app.listen(app.get('port'), process.env.IP, () => {
  console.log(`Listening on port ${app.get('port')}`);
});

module.exports = { app };