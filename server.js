const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const handleUser = require("./handlers/handleUser");
const { handleGroup, getOwes } = require("./handlers/handleGroup");
const { createExpense, updateExpense } = require("./handlers/handleExpense");

dotenv.config();

cors({
	origin: ["*"],
});

const app = express();

app.use(express.json());

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log("MongoDB connected");
	})
	.catch((err) => {
		console.log("MongoDB not connected", err);
	});

app.post("/user", handleUser);

app.post("/group", handleGroup);

app.post("/group/:group_id/expense", createExpense);

app.put("/group/:group_id/expense/:expanse_id", updateExpense);

app.get("/group/:group_id/owes", getOwes);

app.listen(process.env.PORT, () => {
	console.log(`Server listening on port: ${process.env.PORT}`);
});
