const expect       = require("expect"),
	  request      = require("supertest"),
	  { ObjectID } = require("mongodb");

let { app }  = require("./../server"),
	{ Todo } = require("./../models/Todo");

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

beforeEach((done) => {
	Todo.remove({})
		.then(() => {
			return Todo.insertMany(todos)
		})
		.then(() => done());
});

describe("POST /todos", () => {
	it ("should create a new todo", (done) => {
		let text = 'Test todo test';

		request(app)
			.post("/todos")
			.send({ text })
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find({text})
					.then((todos) => {
						expect(todos.length).toBe(1);

						expect(todos[0].text).toBe(text);

						done();
					})
					.catch((e) => {
						done();
					});
			});
	});

	it ("should not create todo with invalid body data", (done) => {
		let text = '';

		request(app)
			.post("/todos")
			.send({ text })
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find()
					.then((todos) => {
						expect(todos.length).toBe(2);

						done();
					})
					.catch((e) => {
						done();
					});
			});
	});

	describe ("GET /todos", () => {
		it ("should get all todos", (done) => {
			request(app)
				.get("/todos")
				.expect(200)
				.expect((res) => {
					expect(res.body.todos.length).toBe(2);
				})
				.end(done);
		});
	});

	describe ("GET /todos/:id", () => {
		it ("should return todo doc", (done) => {
			request(app)
				.get(`/todos/${todos[0]._id.toHexString()}`)
				.expect(200)
				.expect((res) => {
					expect(res.body.todo.text).toBe(todos[0].text);
				})
				.end(done);
		});

		it ("should return 404 if todo not found", (done) => {
			request(app)
				.get(`/todos/${(new ObjectID()).toHexString()}`)
				.expect(404)
				.end(done);
		});

		it ("should return 404 for non-object IDs", (done) => {
			request(app)
				.get("/todos/123")
				.expect(404)
				.end(done);
		});
	});

	describe ("DELETE /todos/:id", () => {
		it ("should remove a todo", (done) => {
			let hexId = todos[1]._id.toHexString();

			request(app)
				.delete(`/todos/${hexId}`)
				.expect(200)
				.expect((res) => {
					expect(res.body.todo._id).toBe(hexId);
				})
				.end((err, res) => {
					if (err) {
						return done(err);
					}

					Todo.findById(hexId)
						.then((todo) => {
							expect(todo).toNotExist();

							done();
						})
						.catch((e) => {
							done();
						});
				})
		});

		it ("should return 404 if todo not found", (done) => {
			request(app)
				.delete(`/todos/${(new ObjectID()).toHexString()}`)
				.expect(404)
				.end(done);
		});

		it ("should return 404 if object ID is invalid", (done) => {
			request(app)
				.delete("/todos/123")
				.expect(404)
				.end(done);
		});
	});

	describe ("PATCH /todos/:id", () => {
		it ("should update the todo", (done) => {
			let hexId = todos[0]._id.toHexString();

			let text = "This is my updated todo from a test";

			request(app)
				.patch(`/todos/${hexId}`)
				.send({ text, completed: true })
				.expect(200)
				.expect((res) => {
					expect(res.body.todo.text).toBe(text);
					expect(res.body.todo.completed).toBe(true);
					expect(res.body.todo.completedAt).toBeA('number');
				})
				.end(done);
		});

		it ("should clear completedAt when todo is not completed", (done) => {
			let hexId = todos[1]._id.toHexString();

			let text = "This is my updated todo from a test part 2";

			request(app)
				.patch(`/todos/${hexId}`)
				.send({ completed: false, text })
				.expect(200)
				.expect((res) => {
					expect(res.body.todo.text).toBe(text);
					expect(res.body.todo.completed).toBe(false);
					expect(res.body.todo.completedAt).toNotExist();
				})
				.end(done); 
		});
	});
});