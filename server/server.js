const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://todouser:DebriS979@ds229609.mlab.com:29609/complete-node-todo");

const Todo = mongoose.model("Todo", {
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,
		default: null
	}	
});

const User = mongoose.model("User", {
	email: {
		type: String,
		required: true,
		menlength: 1,
		trim: true
	}
})

let user = new User({
	email: '  paul.bovis@me.com    '
});

user.save()
	.then((doc) => {
		console.log("Saved user", doc);
	},
	(e) => {
		console.log("Unable to save todo", e);
	});

// let todo = new Todo({
//	text: '  Make a new MongoDB schema     '
// });

//todo.save()
//	.then((doc) => {
//		console.log("Saved todo", doc);
//	},
//	(e) => {
//		console.log("Unable to save todo", e);
//	});

