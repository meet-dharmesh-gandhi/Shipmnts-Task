const User = require("../Models/User");

async function handleUser(req, res) {
	try {
		const params = req.body;
		if (
			!(
				typeof params == "object" &&
				Object.hasOwn(params, "username") &&
				Object.hasOwn(params, "email")
			)
		) {
			res.status(400).json({
				success: false,
				message: "username and email are required",
			});
			console.log(params);
			return;
		}

		const { username, email } = params;

		if (
			!(
				username != undefined &&
				typeof username == "string" &&
				username.length > 0 &&
				email != undefined &&
				typeof email == "string" &&
				email.length > 0
			)
		) {
			res.status(400).json({
				success: false,
				message: "username and email are required",
			});
			console.log(params);
			return;
		}

		const userExists = await User.find({ username });
		if (userExists.length != 0) {
			res.status(409).json({
				success: false,
				message: "A user with this email already exists",
			});
			return;
		}

		const newUser = new User({
			username,
			email,
		});

		const result = await newUser.save();

		res.status(201).json({
			success: true,
			message: "User created successfully",
			data: {
				user_id: result._id,
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

module.exports = handleUser;
