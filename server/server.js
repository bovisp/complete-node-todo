require("./config/config");

const express      = require("express"),
	  { ObjectID } = require("mongodb"),
	  bodyParser   = require("body-parser"),
	  _            = require("lodash");

const { mongoose }     = require('./db/mongoose'),
	  { User }	       = require('./models/User'),
	  { Todo }	       = require('./models/Todo'),
	  { authenticate } = require('./middleware/authenticate');
	  
let app = express();

app.use(bodyParser.json());

app.get("/todos", authenticate, (req, res) => {
	Todo.find({ _creator: req.user._id })
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

app.post("/todos", authenticate, (req, res) => {
	let todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});
	
	todo.save()
		.then((doc) => {
			res.send(doc);
		})
		.catch((e) => {
			res.status(400).send("Unable to save todo");
		});
});

app.get("/todos/:id", authenticate, (req, res) => {
	if (!ObjectID.isValid(req.params.id)) {
		return res.status(404).send();
	}

	Todo.findOne({ _id: req.params.id, _creator: req.user._id })
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

app.patch("/todos/:id", authenticate, (req, res) => {
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

	Todo.findOneAndUpdate(
		{
			_id: req.params.id,
			_creator: req.user._id
		},
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

app.delete("/todos/:id", authenticate, (req, res) => {
	if (!ObjectID.isValid(req.params.id)) {
		return res.status(404).send();
	}

	Todo.findOneAndRemove({ _id: req.params.id, _creator: req.user._id })
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

app.get("/users/me", authenticate, (req, res) => {
	res.send(req.user);
});

app.post("/users", (req, res) => {
	let body = _.pick(req.body, ['email', 'password']);

	let user = new User(body);

	user.save()
		.then(() => {
			return user.generateAuthToken();
		})
		.then((token) => {
			res.header('x-auth', token).send(user);
		})
		.catch((e) => {
			res.status(400).send(e);
		});
});

app.post("/users/login", (req, res) => {
	let body = _.pick(req.body, ['email', 'password']);
	
	User.findByCredentials(body.email, body.password)
		.then((user) => {
			return user.generateAuthToken()
				.then((token) => {
					res.header('x-auth', token).send(user);
				});
		})
		.catch((e) => {
			res.status(400).send();
		});
});

app.delete("/users/me/token", authenticate,(req, res) => {
	req.user.removeToken(req.token)
		.then(() => {
			res.status(200).send();
		}, () => {
			res.status(400).send();
		})
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

module.exports = { app };