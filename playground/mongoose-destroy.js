const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose"),
	  { Todo }	   = require("./../server/models/Todo"),
	  { User }	   = require("./../server/models/User");

// Todo.remove({})
// 	.then((result) => {
// 		console.log(result);
// 	});

// Todo.findOneAndRemove({
// 	text: "Fold the laundry"
// })
// 	.then((todo) => {
// 		console.log(todo);
// 	});

Todo.findByIdAndRemove("5ac2c101ea101600143f8757")
	.then((todo) => {
		console.log(todo);
	});