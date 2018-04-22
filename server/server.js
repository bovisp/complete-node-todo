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

app.get("/todos", authenticate, async (req, res) => {
	try {
		const todos = await Todo.find({ _creator: req.user._id })
		
		if (todos.length === 0) {
			return console.log("No todos found");
		}

		res.send({ todos });
	} catch(e) {
		res.status(400).send("could not fetch todos");
	}
});

app.post("/todos", authenticate, async (req, res) => {
	let todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});
	
	try {
		const doc = await todo.save();
		
		res.send(doc);
	} catch(e) {
		res.status(400).send("Unable to save todo");
	}
});

app.get("/todos/:id", authenticate, async (req, res) => {
	if (!ObjectID.isValid(req.params.id)) {
		return res.status(404).send();
	}

	try {
		const todo = await Todo.findOne({ _id: req.params.id, _creator: req.user._id });
		
		if (todo === null) {
			return res.status(404).send();
		}

		res.send({ todo });
	} catch(e) {
		res.status(400).send();
	}
});

app.patch("/todos/:id", authenticate, async (req, res) => {
	const body = _.pick(req.body, ['text', 'completed']);

	if (!ObjectID.isValid(req.params.id)) {
		return res.status(404).send();
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	try {
		const todo = await Todo.findOneAndUpdate(
			{ _id: req.params.id, _creator: req.user._id },
			{ $set: body },
			{ new: true }
		);
		
		if (todo === null) {
			return res.status(404).send();
		}

		res.send({ todo });	
	} catch(e) {
		res.status(400).send();
	}
});

app.delete("/todos/:id", authenticate, async (req, res) => {
	if (!ObjectID.isValid(req.params.id)) {
		return res.status(404).send();
	}
	
	try {
		const todo = await Todo.findOneAndRemove({ 
			_id: req.params.id,
			_creator: req.user._id
		});
	
		if (todo === null) {
			return res.status(404).send();
		}
		
		res.send({ todo });	
	} catch(e) {
		res.status(400).send();	
	}
});

app.get("/users/me", authenticate, (req, res) => {
	res.send(req.user);
});

app.post("/users", async (req, res) => {
	try {
		const body = _.pick(req.body, ['email', 'password']);
		const user = new User(body);
		
		await user.save();
		
		const token = await user.generateAuthToken();
		
		res.header('x-auth', token).send(user);
	} catch(e) {
		res.status(400).send(e);
	}
});

app.post("/users/login", async (req, res) => {
	try {
		const body = _.pick(req.body, ['email', 'password']);
		
		const user = await User.findByCredentials(body.email, body.password);
		const token = await user.generateAuthToken();
		
		res.header('x-auth', token).send(user);
	} catch(e) {
		res.status(400).send();
	}
});

app.delete("/users/me/token", authenticate, async (req, res) => {
	try {
		await req.user.removeToken(req.token);
		res.status(200).send();	
	} catch(e) {
		res.status(400).send();
	}
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

module.exports = { app };