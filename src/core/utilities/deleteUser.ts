import { spawn, Worker } from "threads";

// Function to spawn a thread and auto delete the users
const autoDeleteUsers = async () => {
  const deleteUsers = await spawn(new Worker("../../workers/worker.ts"));

  deleteUsers();
};

export { autoDeleteUsers };
