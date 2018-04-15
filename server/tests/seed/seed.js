const { ObjectID } = require("mongodb"),
               jwt = require("jsonwebtoken");

let { Todo } = require("./../../models/Todo"),
	{ User } = require("./../../models/User");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
	{
		_id: userOneId,
		email: "vida@example.com",
		password: "userOnePass",
		tokens: [
			{
				access: "auth",
				token: jwt.sign({ _id: userOneId, access: "auth" }, process.env.JWT_SECRET).toString()
			}
		]
	},
	{
		_id: userTwoId,
		email: "nora@example.com",
		password: "userTwoPass",
		tokens: [
			{
				access: "auth",
				token: jwt.sign({ _id: userTwoId, access: "auth" }, process.env.JWT_SECRET).toString()
			}
		]
	}
];

const todos = [
	{
		_id: new ObjectID(),
		text: "This is a test todo test 1",
		_creator: userOneId
	},
	{
		_id: new ObjectID(),
		text: "This is a test todo test 2",
		completed: true,
		completedAt: 333,
		_creator: userTwoId
	}
];

const populateTodos = (done) => {
	Todo.remove({})
		.then(() => {
			return Todo.insertMany(todos)
		})
		.then(() => done());
};

const populateUsers = (done) => {
	User.remove({})
		.then(() => {
			let userOne = new User(users[0]).save();
			let userTwo = new User(users[1]).save();

			return Promise.all([
				userOne, userTwo
			]);
		})
		.then(() => {
			done();
		});
};

module.exports = { todos, users, populateTodos, populateUsers };