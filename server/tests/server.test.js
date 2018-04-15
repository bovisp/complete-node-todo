const expect       = require("expect"),
	  request      = require("supertest"),
	  { ObjectID } = require("mongodb");

let { app }                                        = require("./../server"),
	{ Todo }                                       = require("./../models/Todo"),
	{ User }                                       = require("./../models/User"),
	{ todos, users, populateTodos, populateUsers } = require("./seed/seed");

beforeEach(populateTodos);
beforeEach(populateUsers);

describe("POST /todos", () => {
	it ("should create a new todo", (done) => {
		let text = 'Test todo test';

		request(app)
			.post("/todos")
			.set("x-auth", users[0].tokens[0].token)
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
			.set("x-auth", users[0].tokens[0].token)
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
				.set("x-auth", users[0].tokens[0].token)
				.expect(200)
				.expect((res) => {
					expect(res.body.todos.length).toBe(1);
				})
				.end(done);
		});
	});

	describe ("GET /todos/:id", () => {
		it ("should return todo doc", (done) => {
			request(app)
				.get(`/todos/${todos[0]._id.toHexString()}`)
				.set("x-auth", users[0].tokens[0].token)
				.expect(200)
				.expect((res) => {
					expect(res.body.todo.text).toBe(todos[0].text);
				})
				.end(done);
		});

		it ("should not return todo doc that does not belong to it", (done) => {
			request(app)
				.get(`/todos/${todos[1]._id.toHexString()}`)
				.set("x-auth", users[0].tokens[0].token)
				.expect(404)
				.end(done);
		});

		it ("should return 404 if todo not found", (done) => {
			request(app)
				.get(`/todos/${(new ObjectID()).toHexString()}`)
				.set("x-auth", users[0].tokens[0].token)
				.expect(404)
				.end(done);
		});

		it ("should return 404 for non-object IDs", (done) => {
			request(app)
				.get("/todos/123")
				.set("x-auth", users[0].tokens[0].token)
				.expect(404)
				.end(done);
		});
	});

	describe ("DELETE /todos/:id", () => {
		it ("should remove a todo", (done) => {
			let hexId = todos[1]._id.toHexString();

			request(app)
				.delete(`/todos/${hexId}`)
				.set("x-auth", users[1].tokens[0].token)
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

		it ("should not remove a todo that does not belong to it", (done) => {
			let hexId = todos[1]._id.toHexString();

			request(app)
				.delete(`/todos/${hexId}`)
				.set("x-auth", users[0].tokens[0].token)
				.expect(404)
				.end((err, res) => {
					if (err) {
						return done(err);
					}

					Todo.findById(hexId)
						.then((todo) => {
							expect(todo).toExist();

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
				.set("x-auth", users[1].tokens[0].token)
				.expect(404)
				.end(done);
		});

		it ("should return 404 if object ID is invalid", (done) => {
			request(app)
				.delete("/todos/123")
				.set("x-auth", users[1].tokens[0].token)
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
				.set("x-auth", users[0].tokens[0].token)
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
				.set("x-auth", users[1].tokens[0].token)
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

	describe ("GET /users/me", () =>{
		it ("should return user if authentcated", (done) => {
			request(app)
				.get("/users/me")
				.set("x-auth", users[0].tokens[0].token)
				.expect(200)
				.expect((res) => {
					expect(res.body._id).toBe(users[0]._id.toHexString());
					expect(res.body.email).toBe(users[0].email);
				})
				.end(done);
		});

		it ("should return a 401 if not authenticated", (done) => {
			request(app)
				.get("/users/me")
				.expect(401)
				.expect((res) =>{
					expect(res.body).toEqual({});
				})
				.end(done);
		});
	});

	describe("POST /users", () => {
		it ("should create a user", (done) => {
			let email = "me@example.com";
			let password = "123mn!";

			request(app)
				.post("/users")
				.send({ email, password })
				.expect(200)
				.expect((res) => {
					expect(res.headers['x-auth']).toExist();
					expect(res.body._id).toExist();
					expect(res.body.email).toBe(email);
				})
				.end((err) => {
					if (err) {
						return done();
					}

					User.findOne({email})
						.then((user) => {
							expect(user).toExist();
							expect(user.password).toNotBe(password);

							done();
						})
						.catch((e) => done(e));
				});
		});

		it ("should return validation errors if request invalid", (done) => {
			request(app)
				.post("/users")
				.send({
					email: 'and',
					password: "123"
				})
				.expect(400)
				.end(done);
		});

		it ("should not create user if email in use", (done) => {
			request(app)
				.post("/users")
				.send({
					email: users[0].email,
					password: "Password"
				})
				.expect(400)
				.end(done);
		});
	});
	
	describe("POST /users/login", () => {
		it ("should login user and send auth token", (done) => {
			request(app)
				.post("/users/login")
				.send({
					email: users[1].email,
					password: users[1].password
				})
				.expect(200)
				.expect((res) => {
					expect(res.headers['x-auth']).toExist();
				})
				.end((err, res) => {
					if (err) {
						done(err);
					}
					
					User.findById(users[1]._id)
						.then((user) => {
							expect(user.tokens[1]).toInclude({
								access: 'auth',
								token: res.headers['x-auth']
							});
							
							done();
						})
						.catch((e) => done(e));
				});
		});
		
		it ("should reject an invalid login", (done) => {
			request(app)
				.post("/users/login")
				.send({
					email: users[1].email + "1",
					password: users[1].password + "1"
				})
				.expect(400)
				.expect((res) => {
					expect(res.headers['x-auth']).toNotExist();
				})
				.end((err, res) => {
					if (err) {
						done(err);
					}
					
					User.findById(users[1]._id)
						.then((user) => {
							expect(user.tokens.length).toBe(1);
							
							done();
						})
						.catch((e) => done(e));
				});
		});
	});

	describe ("DELETE /users/me/token", () => {
		it ("should remove auth token on logout", (done) => {
			request(app)
				.delete("/users/me/token")
				.set("x-auth", users[0].tokens[0].token)
				.expect(200)
				.end((err, res) => {
					if (err) {
						done(err);
					}
					
					User.findById(users[0]._id)
						.then((user) => {
							expect(user.tokens.length).toBe(0);
							
							done();
						})
						.catch((e) => done(e));
				});
		});
	});
});