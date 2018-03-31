const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect(
	'mongodb://todouser:DebriS979@ds229609.mlab.com:29609/complete-node-todo',
	(err, client) => {
		if (err) {
			return console.log('Unable to connect to the mongodb client');
		}
		
		console.log('connected to the mongodb client');
		
		const db = client.db('complete-node-todo');
		
		// deleteMany
		// db.collection('todos')
		//	.deleteMany({
		//		text: "My second todo"
		//	})
		//	.then((result) => {
		//		console.log(result)
		//	});
		
		// deleteOne
		// db.collection('todos')
		//	.deleteOne({
		//		text: "My sixth todo"
		//	})
		//	.then((result) => {
		//		console.log(result);
		//	});
		
		//findOneAndDelete
		db.collection('todos')
			.findOneAndDelete({
				_id: new ObjectID('5abf7fd854a0234e8204ed57')
			})
			.then((result) => {
				console.log(result);
			});
		
		client.close();
	}	
);