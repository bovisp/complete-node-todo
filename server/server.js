const express    = require("express"),
	  bodyParser = require("body-parser");

const { mongoose } = require('./db/mongoose'),
	  { User }	   = require('./models/User'),
	  { Todo }	   = require('./models/Todo');
	  
let app = express();

app.use(bodyParser.json());
app.set("port", process.env.PORT || 8080);

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

app.listen(app.get('port'), process.env.IP, () => {
  console.log(`Listening on port ${app.get('port')}`);
});

module.exports = { app };