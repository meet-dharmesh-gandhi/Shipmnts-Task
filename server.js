const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

cors({
	origin: ["*"],
});

const app = express();

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log("MongoDB connected");
	})
	.catch((err) => {
		console.log("MongoDB not connected", err);
	});

app.listen(process.env.PORT, () => {
	console.log(`Server listening on port: ${process.env.PORT}`);
});
