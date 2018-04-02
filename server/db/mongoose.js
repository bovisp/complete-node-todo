const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://todouser:DebriS979@ds229609.mlab.com:29609/complete-node-todo");

module.exports = { mongoose };