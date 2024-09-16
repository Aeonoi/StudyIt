import mongoose from "mongoose";

const todo = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
});
