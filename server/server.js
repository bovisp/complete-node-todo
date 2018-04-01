const express    = require("express"),
	  bodyParser = require("body-parser");

const { mongoose } = require('./db/mongoose'),
	  { User }	   = require('./models/User'),
	  { Todo }	   = require('./models/Todo');
	  
let app = express();

app.use(bodyParser.json());
app.set("port", process.env.PORT || 8080);

app.get("/", (req, res) => {
	res.send("Hello");
});

app.post("/todos", (req, res) => {
	res.send(req.body);
	/* let todo = new Todo({
		text: req.body.text
	});
	
	todo.save()
		.then((doc) => {
			res.send(doc);
		}, (e) => {
			res.status(400).send("Could not save todo.", e);
		}); */
});

app.listen(app.get('port'), process.env.IP, () => {
  console.log(`Listening on port ${app.get('port')}`);
});