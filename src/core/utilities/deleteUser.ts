import { spawn, Worker } from "threads";

const autoDeleteUsers = async () => {
  const deleteUsers = await spawn(new Worker("../../workers/worker.ts"));

  deleteUsers();
};

export { autoDeleteUsers };
