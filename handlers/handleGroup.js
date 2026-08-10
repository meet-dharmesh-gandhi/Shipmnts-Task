const { default: mongoose } = require("mongoose");
const Group = require("../Models/Group");
const User = require("../Models/User");
const Expense = require("../Models/Expense");

async function handleGroup(req, res) {
	try {
		const { group_name, owner_id, members, base_currency } = req.body;

		if (
			!(
				typeof group_name == "string" &&
				group_name.length > 0 &&
				mongoose.isObjectIdOrHexString(owner_id) &&
				Array.isArray(members) &&
				members.every((ele) => mongoose.isObjectIdOrHexString(ele)) &&
				typeof base_currency == "string" &&
				base_currency.length > 0
			)
		) {
			res.status(400).json({
				success: false,
				message: "Please add all required field",
			});
			return;
		}

		const users = await User.find({
			_id: { $in: members },
		});

		if (users.length != members.length) {
			let unmatched = -1;
			for (let i = 0; i < members.length; i++) {
				if (i < users.length || members[i] != users[i]._id) {
					unmatched = members[i];
					break;
				}
			}
			res.status(404).json({
				success: false,
				message: `No user found with id ${unmatched}`,
			});
			return;
		}

		const user = await User.find({ _id: owner_id });

		if (user.length == 0) {
			res.status(404).json({
				success: false,
				message: `No user found with id ${owner_id}`,
			});
			return;
		}

		const group = new Group({
			group_name,
			owner_id,
			members,
			base_currency,
		});

		const result = await group.save();

		res.status(201).json({
			success: true,
			message: "Group created successfully",
			data: {
				group_id: group._id,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Something went wrong, please try again",
		});
	}
}

async function getOwes(req, res) {
	try {
		const { group_id } = req.params;

		if (!mongoose.isObjectIdOrHexString(group_id)) {
			res.status(404).json({
				success: false,
				message: `No group found with id ${group_id}`,
			});
			return;
		}

		const expenses = await Expense.find({ group_id });

		const group = await Group.find({ _id: group_id });

		if (group.length == 0) {
			res.status(404).json({
				success: false,
				message: "No group found with id 1",
			});
			return;
		}

		const owes = [];
		for (let i = 0; i < expenses.length; i++) {
			for (let i = 0; i < expenses[i].involved_members.length; i++) {
				owes.push({
					from: expenses[i].involved_members[i],
					to: expenses[i].paid_by,
					amount: expenses[i].amount,
					currency: expenses[i].expense_currency,
				});
			}
		}

		// A -> B -> C
		// [A: [B], B: [C]]
		// simplify possible when...
		// a child of A has another child, then remove current child
		// (if amounts match) and add the new one

		// let mat = {};
		// for (let i = 0; i < owes.length; i++) {
		// 	if (!Object.hasOwn(mat, owes[i].from)) {
		// 		mat[owes[i].from] = [];
		// 	}
		// 	mat[owes[i].from].push({
		// 		to: owes[i].to,
		// 		amount: owes[i].amount,
		// 		currency: owes[i].currency,
		// 	});
		// }

		res.status(200).json({
			success: true,
			data: {
				group_id: group_id,
				group_currency: group[0].base_currency,
				simplified_owes: owes,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Something went wrong, please try again",
		});
	}
}

module.exports = { handleGroup, getOwes };
