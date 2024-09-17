import connectDB from "./connect-mongo";
import Task from "@/models/tasks";

/* Returns all the tasks that have been created so far */
export async function getTasks() {
	try {
		await connectDB();
	} catch (error) {
		console.error(error);
	}
}

/* Create a task and returns the json of task */
export async function createTask(name: string) {
	try {
		await connectDB();
		try {
			const newTask = await Task.create({
				name: name,
				// default values
				started: false,
				completed: false,
				createdDate: new Date(),
				completedSessions: 0,
				totalSessions: 0,
			});
			return newTask;
		} catch (error) {
			console.error(error);
			return error;
		}
	} catch (error) {
		console.error(error);
	}
}

/* Updates the number of sessions a task has undergone */
export async function updateTask(id: string) {
	try {
		await connectDB();
	} catch (error) {
		console.error(error);
	}
}

export async function deleteTask(id: string) {
	try {
		await connectDB();
	} catch (error) {
		console.error(error);
	}
}
