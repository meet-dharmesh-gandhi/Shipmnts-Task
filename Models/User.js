const mongoose = require("mongoose");

const User = new mongoose.Schema({
	username: String,
	email: String,
});

module.exports = mongoose.model("User", User);
