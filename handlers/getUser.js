const User = require("../Models/User");

async function getUser(req, res) {
	const response = await User.find();
	res.status(200).json(response);
	return;
}

module.exports = {
	getUser,
};
