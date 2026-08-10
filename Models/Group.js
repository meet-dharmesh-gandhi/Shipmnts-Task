const mongoose = require("mongoose");

const Group = new mongoose.Schema({
	groupName: String,
	ownerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	members: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	base_currency: String,
});

module.exports = mongoose.model("Group", Group);
