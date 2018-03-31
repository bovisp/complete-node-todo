const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect(
	'mongodb://todouser:DebriS979@ds229609.mlab.com:29609/complete-node-todo',
	(err, client) => {
		if (err) {
			return console.log('Unable to connect to the mongodb client');
		}
		
		console.log('connected to the mongodb client');
		
		const db = client.db('complete-node-todo');
		
		// db.collection("todos")
		//	.find({
				// completed: false
				// _id: new ObjectID('5abee3c503b88b3616d34fcc')
		//	})
		//	.toArray()
		//	.then((docs) => {
		//		console.log("Todos:");
		//		console.log(JSON.stringify(docs, undefined, 2));
		//	}, (err) => {
		//		return console.log("could not fetch todos", err);
		//	});
		
		db.collection("users")
			.find({
				name: "Paul Bovis"
			})
			.toArray()
			.then((docs) => {
				console.log("Users:");
				console.log(JSON.stringify(docs, undefined, 2));
			}, (err) => {
				return console.log("could not fetch todos", err);
			});
		
	    // db.collection("todos")
		//	.find()
		//	.count()
		//	.then((count) => {
		//		console.log(`Todos count: ${count}`);
		//	}, (err) => {
		//		return console.log("could not fetch todos", err);
		//	});
				
		// client.close();
	}	
);