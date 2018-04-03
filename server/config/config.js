let env = process.env.NODE_ENV || 'development';

require("dotenv").config();

if (env === 'development') {
	process.env.PORT = 3000;
	process.env.MONGODB_URL = process.env.DEV_MONGODB_URL
} else if (env === 'test') {
	process.env.PORT = 3000;
	process.env.MONGODB_URL = process.env.TEST_MONGODB_URL
}