const { User } = require("./../models/User");

let authenticate = async (req, res, next) => {
	const token = req.header('x-auth'); 
	
	try {
		const user = await User.findByToken(token);	
		
		if (user === null) {
			return Promise.reject();
		}

		req.user = user;
		req.token = token;

		next();
	} catch(e) {
		res.status(401).send();
	}
};

module.exports = { authenticate };