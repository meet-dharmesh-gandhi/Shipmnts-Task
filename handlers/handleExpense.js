const { default: mongoose } = require("mongoose");
const User = require("../Models/User");
const Group = require("../Models/Group");
const Expense = require("../Models/Expense");

async function createExpense(req, res) {
	try {
		const {
			paid_by,
			involved_members,
			amount,
			expense_currency,
			description,
		} = req.body;
		const { group_id } = req.params;

		if (
			!(
				mongoose.isObjectIdOrHexString(group_id) &&
				mongoose.isObjectIdOrHexString(paid_by) &&
				Array.isArray(involved_members) &&
				involved_members.every((ele) =>
					mongoose.isObjectIdOrHexString(ele),
				) &&
				typeof amount == "number" &&
				typeof expense_currency == "string" &&
				expense_currency.length > 0 &&
				typeof description == "string" &&
				description.length > 0
			)
		) {
			res.status(400).json({
				success: false,
				message: "Please add all required field",
			});
			return;
		}

		if (amount <= 0) {
			res.status(400).json({
				success: false,
				message: "amount must be greater than 0",
			});
			return;
		}

		const user = await User.find({ _id: paid_by });

		if (user.length == 0) {
			res.status(403).json({
				success: false,
				message: "paid_by must be a member of this group",
			});
			return;
		}

		const group = await Group.find({ _id: group_id });

		if (group.length == 0) {
			res.status(403).json({
				success: false,
				message: `No group found with id ${group_id}`,
			});
			return;
		}

		const expense = new Expense({
			group_id,
			paid_by,
			involved_members,
			amount,
			expense_currency,
			description,
		});

		expense.save();

		res.status(201).json({
			success: true,
			message: "Expanse created successfully",
			data: {
				expanse_id: expense._id,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong, please try again",
		});
	}
}

async function updateExpense(req, res) {
	try {
		const {
			paid_by,
			involved_members,
			amount,
			expense_currency,
			description,
		} = req.body;
		const { group_id, expanse_id } = req.params;

		if (
			!(
				mongoose.isObjectIdOrHexString(group_id) &&
				mongoose.isObjectIdOrHexString(paid_by) &&
				Array.isArray(involved_members) &&
				involved_members.every((ele) =>
					mongoose.isObjectIdOrHexString(ele),
				) &&
				typeof amount == "number" &&
				typeof expense_currency == "string" &&
				expense_currency.length > 0 &&
				typeof description == "string" &&
				description.length > 0
			)
		) {
			res.status(400).json({
				success: false,
				message: "Please add all required field",
			});
			return;
		}

		if (amount <= 0) {
			res.status(400).json({
				success: false,
				message: "amount must be greater than 0",
			});
			return;
		}

		const user = await User.find({ _id: paid_by });

		if (user.length == 0) {
			res.status(403).json({
				success: false,
				message: "paid_by must be a member of this group",
			});
			return;
		}

		const group = await Group.find({ _id: group_id });

		if (group.length == 0) {
			res.status(403).json({
				success: false,
				message: `No group found with id ${group_id}`,
			});
			return;
		}

		const expense = await Expense.find({ _id: expanse_id });

		if (expense.length == 0) {
			res.status(403).json({
				success: false,
				message: `No expense found with id ${expanse_id}`,
			});
			return;
		}

		const updated = await Expense.updateOne(
			{ _id: expanse_id },
			{
				group_id,
				paid_by,
				involved_members,
				amount,
				expense_currency,
				description,
			},
		);

		if (updated.matchedCount == 0) {
			throw Error("No such expense");
		}

		res.status(201).json({
			success: true,
			message: "Expanse updated successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong, please try again",
		});
	}
}

module.exports = { createExpense, updateExpense };
