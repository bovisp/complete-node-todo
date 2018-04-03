require("./config/config");

const express      = require("express"),
	  { ObjectID } = require("mongodb"),
	  bodyParser   = require("body-parser"),
	  _            = require("lodash");

const { mongoose } = require('./db/mongoose'),
	  { User }	   = require('./models/User'),
	  { Todo }	   = require('./models/Todo');
	  
let app = express();

app.use(bodyParser.json());

app.get("/todos", (req, res) => {
	Todo.find()
		.then((todos) => {
			if (todos.length === 0) {
				return console.log("No todos found");
			}

			res.send({ todos });
		})
		.catch((e) => {
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
		})
		.catch((e) => {
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
		})
		.catch((e) => {
			res.status(400).send();
		});
});

app.patch("/todos/:id", (req, res) => {
	let body = _.pick(req.body, ['text', 'completed']);

	if (!ObjectID.isValid(req.params.id)) {
		return res.status(404).send();
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findByIdAndUpdate(
		req.params.id,
		{
			$set: body
		},
		{
			new: true
		}
	)
		.then((todo) => {
			if (todo === null) {
				return res.status(404).send();
			}

			res.send({ todo });
		})
		.catch((e) => {
			res.status(400).send();
		});
});

app.delete("/todos/:id", (req, res) => {
	if (!ObjectID.isValid(req.params.id)) {
		return res.status(404).send();
	}

	Todo.findByIdAndRemove(req.params.id)
		.then((todo) => {
			if (todo === null) {
				return res.status(404).send();
			}

			res.send({ todo });
		})
		.catch((e) => {
			res.status(400).send();
		});
});

app.post("/users", (req, res) => {
	let body = _.pick(req.body, ['email', 'password']);

	let user = new User(body);

	user.save()
		.then(() => {
			return user.generateAuthToken();
		})
		.then((token) => {
			res.header('x-auth', token).send(user)
		})
		.catch((e) => {
			res.status(400).send(e);
		});
})

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

module.exports = { app };