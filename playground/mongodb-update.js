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
		
		db.collection('users')
			.findOneAndUpdate({
				_id: new ObjectID('5abe77343f23962b4e9c700c')
			},
			{
				$set: {
					name: "Corrie Godfrey"
				},
				$inc: {
					age: -2
				}
			},
			{
				returnOriginal: false
			})
			.then((result) => {
				console.log(result);
			});
		
		client.close();
	}	
);