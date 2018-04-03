const mongoose = require("mongoose");

require("dotenv").config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.PROD_MONGODB_URL);

module.exports = { mongoose };