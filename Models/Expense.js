const mongoose = require("mongoose");

const Expense = new mongoose.Schema({
	group_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Group",
	},
	paid_by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	involved_members: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	amount: Number,
	expense_currency: String,
	description: String,
});

module.exports = mongoose.model("Expense", Expense);
