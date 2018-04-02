const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose"),
	  { Todo }	   = require("./../server/models/Todo"),
	  { User }	   = require("./../server/models/User");

let _id = "5ac2504bef428b0a94997ecb";

// if (!ObjectID.isValid(_id)) {
// 	console.log("ID not valid");
// }

User.find({ _id })
	.then((users) => {
		if (users.length === 0) {
			return console.log("No users found");
		}

		console.log("users", JSON.stringify(users, undefined, 2));
	});

User.findOne({ _id })
	.then((user) => {
		if (user === null) {
			return console.log("User not found");
		}

		console.log("User", JSON.stringify(user, undefined, 2));
	});

User.findById(_id)
	.then((user) => {
		if (user === null) {
			return console.log("Id not found");
		}
		console.log("User by ID", JSON.stringify(user, undefined, 2));
	})
	.catch((e) => {
		console.log(e);
	});