const { MongoClient, ObjectID } = require('mongodb');

let obj = new ObjectID();

console.log(obj);

MongoClient.connect(
	'mongodb://todouser:DebriS979@ds229609.mlab.com:29609/complete-node-todo',
	(err, client) => {
		if (err) {
			return console.log('Unable to connect to the mongodb client');
		}
		
		console.log('connected to the mongodb client');
		
		const db = client.db('complete-node-todo');
		
		db.collection('todos').insertOne(
			{
				text: 'My sixth todo',
				completed: false
			},
			(err, result) => {
				if (err) {
					return console.log('Unable to insert todo', err);
				}
				
				console.log(JSON.stringify(result.ops, undefined, 2));
			}
		);
		
		//db.collection('users').insertOne(
		//	{
		//		name: "Nora Bovis",
		//		age: 5,
		//		location: "Edmonton"
		//	},
		//	(err, result) => {
		//		if (err) {
		//			return console.log('unable to insert user', err);
		//		}
		//		
		//		console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
		//	}
		//);
		
		
		
		client.close();
	}	
);