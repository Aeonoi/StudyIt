import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface ITask extends Document {
	_id: string;
	name: string;
	started?: Date;
	completed?: boolean;
	createdDate?: Date;
	lastDone?: Date;
	completedSessions?: number;
	totalSessions?: number;
}

export const TasksSchema = new mongoose.Schema({
	// name of the task
	name: {
		type: String,
		required: true,
	},
	// whether the current session has been started
	started: {
		type: Boolean,
	},
	// whether the current session has been completed
	completed: {
		type: Boolean,
	},
	// when the task was created
	createdDate: {
		type: Date,
	},
	// represents when last finished a session
	lastDone: {
		type: Date,
	},
	// number of sessions completed
	completedSessions: {
		type: Number,
		min: 0,
	},
	// total number of sessions (started)
	totalSessions: {
		type: Number,
		min: 0,
	},
});

const Task = mongoose.models.Task || mongoose.model<ITask>("Task", TasksSchema);
export default Task;
