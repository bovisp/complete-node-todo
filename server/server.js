const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://todouser:DebriS979@ds229609.mlab.com:29609/complete-node-todo");

const Todo = mongoose.model("Todo", {
	text: {
		type: String
	},
	completed: {
		type: Boolean
	},
	completedAt: {
		type: Number
	}	
});

let todo = new Todo({
	text: "Give daughters baths",
	completed: false,
	completedAt: 127298727823753475
});

todo.save()
	.then((doc) => {
		console.log("Saved todo", doc);
	},
	(e) => {
		console.log("Unable to save todo", e);
	});

