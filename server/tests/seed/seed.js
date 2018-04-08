const { ObjectID } = require("mongodb"),
               jwt = require("jsonwebtoken");

let { Todo } = require("./../../models/Todo"),
	{ User } = require("./../../models/User");

const todos = [
	{
		_id: new ObjectID(),
		text: "This is a test todo test 1"
	},
	{
		_id: new ObjectID(),
		text: "This is a test todo test 2",
		completed: true,
		completedAt: 333
	}
];

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
				token: jwt.sign({ _id: userOneId, access: "auth" }, "abc123").toString()
			}
		]
	},
	{
		_id: userTwoId,
		email: "nora@example.com",
		password: "userTwoPass"
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