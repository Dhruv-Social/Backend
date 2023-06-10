import { spawn, Worker } from "threads";

let autoDeleteUsers = async () => {
  const deleteUsers = await spawn(new Worker("../../workers/worker.ts"));

  deleteUsers();
};
//e

export { autoDeleteUsers };
